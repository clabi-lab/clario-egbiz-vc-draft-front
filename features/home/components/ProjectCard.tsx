import { useRouter } from "next/navigation";
import dayjs from "dayjs";

import { useAlertStore } from "@/shared/store/useAlertStore";
import { useDialogStore } from "@/shared/store/useDialogStore";

import { Card, IconButton } from "@mui/material";

import CalendarIcon from "@mui/icons-material/CalendarTodayOutlined";
import CopyIcon from "@mui/icons-material/ContentCopyOutlined";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

import { copyProject, deleteProject } from "../services/home";

interface Project {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ProjectCardProps {
  className?: string;
  project: Project;
  refetchProjects: () => void;
}

const ProjectCard = ({
  className,
  project,
  refetchProjects,
}: ProjectCardProps) => {
  const router = useRouter();
  const { openAlert } = useAlertStore();
  const { openDialog } = useDialogStore();
  const handleClick = () => {
    router.push(`/project/${project.id}`);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  const handleCopy = async () => {
    try {
      await copyProject(project.id);

      openAlert({ message: "프로젝트가 복사되었습니다.", severity: "success" });
      refetchProjects();
    } catch (error) {
      openAlert({
        message: "프로젝트 복사에 실패했습니다.",
        severity: "error",
      });
    }
  };

  const handleDelete = async () => {
    try {
      await deleteProject(project.id);
      refetchProjects();
      openAlert({ message: "프로젝트가 삭제되었습니다.", severity: "success" });
    } catch (error) {
      openAlert({
        message: "프로젝트 삭제에 실패했습니다.",
        severity: "error",
      });
    }
  };

  return (
    <Card
      className={`p-6 border border-gray-200 cursor-pointer group ${className}`}
      sx={{
        boxShadow: "none",
        borderRadius: "16px",
        "&:hover": {
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        },
        "&:focus": {
          outline: "2px solid #f5f5f5",
          boxShadow: "0 0 10px 0 rgba(0, 0, 0, 0.1)",
        },
      }}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`프로젝트 ${project.title} 상세보기`}
    >
      <div className="flex items-center justify-between">
        <p className="text-lg font-bold">{project.title}</p>
        <div className="opacity-0 group-hover:opacity-100 focus-within:opacity-100 transition-opacity duration-200">
          <IconButton
            aria-label="copy"
            size="small"
            color="primary"
            onClick={(e) => {
              e.stopPropagation();
              handleCopy();
            }}
          >
            <CopyIcon sx={{ width: 16, height: 16 }} />
          </IconButton>
          <IconButton
            aria-label="delete"
            size="small"
            color="error"
            onClick={(e) => {
              e.stopPropagation();
              openDialog({
                title: "프로젝트 삭제",
                message: "프로젝트를 삭제하시겠습니까?",
                confirmButtonText: "삭제",
                cancelButtonText: "취소",
                confirmButtonColor: "error",
                onConfirm: handleDelete,
              });
            }}
          >
            <DeleteIcon sx={{ width: 20, height: 20 }} />
          </IconButton>
        </div>
      </div>
      <p className="text-sm text-gray-500 mt-8">
        <CalendarIcon sx={{ width: 16, height: 16 }} /> 생성일:{" "}
        {dayjs(project.createdAt).format("YYYY년 MM월 DD일")}
      </p>
      <p className="text-sm text-gray-500 mt-2">
        <CalendarIcon sx={{ width: 16, height: 16 }} /> 수정일:{" "}
        {dayjs(project.updatedAt).format("YYYY년 MM월 DD일 HH:mm")}
      </p>
    </Card>
  );
};

export default ProjectCard;
