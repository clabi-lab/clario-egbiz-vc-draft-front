## 프로젝트 개요

Chat Bot Template 입니다.

## 기능

### Drawer

기본적으로 아래 4가지의 메뉴가 있습니다.

- 홈
- 스타일 변경
- 새 대화 시작
- 최근 질문

메뉴는 `config/drawer.config`에서 추가 가능합니다.
Drawer Color는 `app/globals.css`에서 변경 가능합니다.

### Home Page

사용자는 검색 기능을 통해 질문을 입력할 수 있습니다.
검색을 실행하면 Chat Page로 이동하여 결과를 확인합니다.

### Chat Page

Chat Page에 진입하면 다음과 같은 순서로 동작이 수행됩니다:

1. 채팅 그룹 생성
2. AI API 호출을 통해 응답 수신
3. 채팅 데이터 저장
4. IndexedDB에 데이터 저장

#### IndexedDB 저장 구조

```ts
{
  id: number; // 채팅 그룹 ID
  title: string; // 채팅 제목
  shareCode: string; // 대화 내용 불러올 때 사용됩니다.
}
```

## 설치 및 실행

`npm install`
`npm run start`

## 기술 스택

[next.js](https://nextjs.org/)
[TypeScript](https://www.typescriptlang.org/)

## 추가 라이브러리

[Tailwind CSS](https://tailwindcss.com/)
[Material UI](https://mui.com/material-ui/getting-started/installation/)
[Zustand](https://zustand.docs.pmnd.rs/getting-started/introduction)
[react-markdown](https://github.com/remarkjs/react-markdown)
[msw](https://mswjs.io/)

## 추후 개발

### Drawer

- history 수정, 삭제, 저장 기능 개발
- history 순서 변경 기능 개발
- 스타일 변경 기능 개발

### Chat Page

- 멀티턴 기능 개발
- 새로운 AI 로직으로 변경
- 설정 기능 개발
- 공유 기능 개발

### 기타

- 공유 페이지 개발
