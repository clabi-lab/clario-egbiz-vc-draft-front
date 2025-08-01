## 프로젝트 개요

대한전기협회 프로젝트는 AI 기반의 대화 인터페이스 구현을 위한 템플릿 프로젝트입니다.  
Next.js App Router 구조를 기반으로 하며, 채팅 기능, 스타일 변경, 최근 질문 조회 등의 기능을 제공합니다.

---

## 주요 기능

> `config/common` 에서 기능 사용 여부를 설정할 수 있습니다.

### Drawer

**기본 메뉴**

- 홈
- 스타일 변경
- 새 대화 시작
- 최근 질문
- 필터

> 메뉴 구성은 `config/drawer.config.ts`에서 수정 가능합니다.

### Home Page

- 검색 입력 UI 제공
- 검색어 입력 후 Chat Page로 이동

### Chat Page

- 검색 입력 UI 제공
- AI 응답 확인 및 채팅 내용 출력
- 채팅 공유 기능 제공
- 채팅 설정 기능 제공

#### 작동흐름

1. 채팅 그룹 생성
2. AI API 호출을 통해 응답 수신
3. 채팅 데이터 저장
4. IndexedDB에 데이터 저장

**IndexedDB 저장 구조**

```ts
// ChatHistoryStore - 채팅 히스토리에 활용
{
  id: number; // 채팅 그룹 ID
  title: string; // 채팅 제목
}

// SatisfactionStore - 채팅 만족도에 활용
{
  chatId: number; // 채팅 그룹 ID
  satisfactionId: string; // 만족도 내용 불러올 때 사용됩니다.
}

// SavedChatStore - 채팅 저장에 활용
{
  id: number; // 채팅 그룹 ID
  title: string; // 채팅 제목
}
```

### Share Page

- 공유된 채팅 내용 출력

---

## 디렉토리 설명

| 디렉토리/파일       | 설명                                            |
| ------------------- | ----------------------------------------------- |
| `app/`              | Next.js App Router 기반 페이지 및 레이아웃 구성 |
| `components/`       | UI 및 공통 컴포넌트                             |
| `config/`           | 전역 설정, 메뉴 설정 등                         |
| `hooks/`            | 커스텀 React Hooks                              |
| `lib/`              | 외부 라이브러리 래퍼 및 유틸 함수               |
| `public/`           | 정적 리소스 (이미지, 폰트 등)                   |
| `services/`         | API 요청 및 비즈니스 로직 처리                  |
| `store/`            | Zustand 기반 전역 상태 관리                     |
| `types/`            | 공용 타입 정의                                  |
| `utils/`            | 순수 유틸리티 함수 (포맷터, 계산 등)            |
| `.env`              | 환경 변수 정의 파일                             |
| `next.config.js`    | Next.js 설정                                    |
| `eslint.config.mjs` | ESLint 설정                                     |

---

## 설치 및 실행

`npm install`
`npm run start`

---

## 기술 스택

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Material UI](https://mui.com/material-ui/getting-started/installation/)
- [Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
- [react-markdown](https://github.com/remarkjs/react-markdown)
- [msw](https://mswjs.io/)

---

## 추후 개발

- history 순서 변경 기능 개발
- 스타일 변경 기능 개발
- msw 적용
