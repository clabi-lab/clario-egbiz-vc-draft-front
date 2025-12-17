// ============================================================================
// 상수 정의
// ============================================================================

const TIMEOUT = {
  INIT_REQUEST: 60000, // 60초
  STATUS_CHECK: 30000, // 30초
} as const;

const POLLING = {
  MAX_ATTEMPTS: 60,
  INTERVAL: 10000, // 10초
  INITIAL_DELAY: 2000, // 2초
} as const;

const PROCESSING_CONFIG = {
  INPUT_TYPE: "file",
  OUTPUT_TYPE: "storage",
  PROCESSING_MODE: "text-ocr-others-vlm",
} as const;

// ============================================================================
// 타입 정의
// ============================================================================

export interface ClaDocResponse {
  task_id: string;
  status_url: string;
  stream_url: string;
  created_at: string;
  processing_mode: string;
}

export interface ImageDimensions {
  width: number;
  height: number;
}

export interface CroppedImage {
  id: number;
  url: string;
  width: number;
  height: number;
  class_name: string;
  confidence: number;
  vlm_result: unknown;
  coordinates: number[];
  extracted_text: string;
}

export interface PageResult {
  page: number;
  cropped_images: CroppedImage[];
  elements_count: number;
  original_image_url: string;
  processing_time_seconds: number;
  original_image_dimensions: ImageDimensions;
}

export interface PageItem {
  page: number;
  status: string;
  result: PageResult;
  error: string | null;
  processing_time_seconds: number;
}

export interface ProcessingResult {
  pages: {
    page: number;
    result: PageResult;
    status: string;
  }[];
  task_id: string | null;
  output_type: string;
  total_pages: number;
  process_type: string;
  processing_mode: string;
  parallel_processes: number;
  page_processing_times: Record<string, number>;
  total_processing_time_seconds: number;
}

export interface ClaDocStatusResponse {
  task_id: string;
  status: string;
  input_type: string;
  output_type: string;
  process_type: string;
  total_pages: number;
  processed_pages: number;
  progress_percent: number;
  created_at: string;
  started_at: string;
  completed_at: string;
  expires_at: string;
  pages: PageItem[];
  result: ProcessingResult;
  error: string | null;
  error_message?: string;
  total_processing_time_seconds: number;
  parallel_processes: number;
  vlm_summary: unknown;
}

type ProgressCallback = (message: string) => void;

// ============================================================================
// 헬퍼 함수
// ============================================================================

/**
 * timeout을 포함한 fetch 요청을 실행합니다.
 */
async function fetchWithTimeout(
  url: string,
  options: RequestInit,
  timeoutMs: number
): Promise<Response> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === "AbortError") {
      throw new Error("요청이 시간 초과되었습니다.");
    }
    throw error;
  }
}

/**
 * PDF 처리를 시작합니다.
 */
async function initiatePdfProcessing(
  file: File,
  onProgress?: ProgressCallback
): Promise<ClaDocResponse> {
  const formData = new FormData();
  formData.append("input_type", PROCESSING_CONFIG.INPUT_TYPE);
  formData.append("output_type", PROCESSING_CONFIG.OUTPUT_TYPE);
  formData.append("processing_mode", PROCESSING_CONFIG.PROCESSING_MODE);
  formData.append("file", file);

  const response = await fetchWithTimeout(
    `${process.env.NEXT_PUBLIC_CLADOC_SERVER}/pdf-process-integrated`,
    {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    },
    TIMEOUT.INIT_REQUEST
  );

  if (!response.ok) {
    throw new Error(`PDF 처리 요청 실패: ${response.status}`);
  }

  const data: ClaDocResponse = await response.json();
  onProgress?.("PDF 처리가 시작되었습니다...");

  return data;
}

/**
 * 처리 상태를 확인합니다.
 */
async function fetchProcessingStatus(
  taskId: string
): Promise<ClaDocStatusResponse> {
  const response = await fetchWithTimeout(
    `${process.env.NEXT_PUBLIC_CLADOC_SERVER}/pdf-process/status/${taskId}`,
    {
      method: "GET",
      headers: {
        Accept: "application/json",
        "Cache-Control": "no-store",
      },
    },
    TIMEOUT.STATUS_CHECK
  );

  if (!response.ok) {
    throw new Error(`상태 확인 요청 실패: ${response.status}`);
  }

  return response.json();
}

/**
 * 처리 상태를 처리합니다.
 */
function handleProcessingStatus(
  statusData: ClaDocStatusResponse,
  onProgress?: ProgressCallback
): "completed" | "failed" | "continue" {
  const { status } = statusData;

  if (status === "completed") {
    onProgress?.("PDF 처리가 완료되었습니다.");
    return "completed";
  }

  if (status === "failed") {
    throw new Error(
      statusData.error_message || "PDF 처리 중 오류가 발생했습니다."
    );
  }

  if (status === "processing") {
    onProgress?.("PDF를 처리하고 있습니다");
    return "continue";
  }

  // 알 수 없는 상태
  onProgress?.(`처리 중: ${status}`);
  return "continue";
}

/**
 * Polling을 통해 처리 완료를 기다립니다.
 */
async function pollProcessingStatus(
  taskId: string,
  onProgress?: ProgressCallback
): Promise<ClaDocStatusResponse> {
  let attempts = 0;

  const checkStatus = async (): Promise<ClaDocStatusResponse> => {
    attempts++;

    if (attempts > POLLING.MAX_ATTEMPTS) {
      throw new Error("PDF 처리 시간이 초과되었습니다.");
    }

    try {
      const statusData = await fetchProcessingStatus(taskId);
      const result = handleProcessingStatus(statusData, onProgress);

      if (result === "completed") {
        return statusData;
      }

      // 계속 처리 중인 경우 재귀적으로 다시 확인
      await new Promise((resolve) => setTimeout(resolve, POLLING.INTERVAL));
      return checkStatus();
    } catch (error) {
      // 네트워크 오류 등의 경우 재시도
      if (error instanceof Error && error.message.includes("시간 초과")) {
        throw error;
      }

      console.error("상태 확인 오류:", error);

      if (attempts >= POLLING.MAX_ATTEMPTS) {
        throw new Error("PDF 처리 시간이 초과되었습니다.");
      }

      // 오류 발생 시에도 재시도
      await new Promise((resolve) => setTimeout(resolve, POLLING.INTERVAL));
      return checkStatus();
    }
  };

  // 초기 지연 후 상태 확인 시작
  await new Promise((resolve) => setTimeout(resolve, POLLING.INITIAL_DELAY));
  return checkStatus();
}

// ============================================================================
// 메인 함수
// ============================================================================

/**
 * ClaDoc을 사용하여 PDF를 처리합니다.
 *
 * @param file - 처리할 PDF 파일
 * @param onProgress - 진행 상황 콜백
 * @returns 처리 완료된 결과
 */
export async function processPdfWithClaDoc(
  file: File,
  onProgress?: ProgressCallback
): Promise<ClaDocStatusResponse> {
  try {
    // 1단계: PDF 처리 요청
    const initData = await initiatePdfProcessing(file, onProgress);

    // 2단계: Polling으로 처리 상태 확인
    const result = await pollProcessingStatus(initData.task_id, onProgress);

    return result;
  } catch (error) {
    console.error("ClaDoc API 오류:", error);
    throw error;
  }
}
