## 프로젝트 개요

Clabi Chat Bot Template 입니다.

## 기능

### 1. Drawer

기본적으로 아래 4가지의 메뉴가 있습니다.

- 홈
- 스타일 변경
- 새 대화 시작
- 최근 질문

**추가 기능**

- 필터(Project. 대한전기협회)

메뉴는 `config/drawer.config`에서 추가 가능합니다.
Drawer Color는 `app/globals.css`에서 변경 가능합니다.

### 2. Home Page

사용자는 검색 기능을 통해 질문을 입력할 수 있습니다.
검색을 실행하면 Chat Page로 이동하여 결과를 확인합니다.

### 3. Chat Page

Chat Page에 진입하면 다음과 같은 순서로 동작이 수행됩니다:

1. 채팅 그룹 생성
2. AI API 호출을 통해 응답 수신
3. 채팅 데이터 저장
4. IndexedDB에 데이터 저장

#### IndexedDB 저장 구조

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

## 설치 및 실행

`npm install`
`npm run start`

## 기술 스택

[Next.js](https://nextjs.org/)
[TypeScript](https://www.typescriptlang.org/)

## 추가 라이브러리

[Tailwind CSS](https://tailwindcss.com/)
[Material UI](https://mui.com/material-ui/getting-started/installation/)
[Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
[react-markdown](https://github.com/remarkjs/react-markdown)
[msw](https://mswjs.io/)

## 추후 개발

### Drawer

- history 순서 변경 기능 개발
- 스타일 변경 기능 개발

### Chat Page

- 설정 기능 개발
- 공유 기능 개발

### 기타

- 공유 페이지 개발
