"use client";

import { useEffect } from "react";

import Link from "next/link";

import { useDrawerStore } from "../shared/store/useDrawerStore";

const NotFound = () => {
  const setOpen = useDrawerStore((state) => state.setOpen);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <section
      className="h-[100vh] flex flex-1 items-center justify-center flex-col bg-gray-600"
      aria-labelledby="error-title"
    >
      <h1 id="error-title" className="text-5xl font-extrabold text-white">
        404 - Not Found
      </h1>
      <p className="text-xl text-white mt-4 mb-8">
        요청하신 페이지가 존재하지 않습니다.
      </p>
      <nav aria-label="오류 페이지 네비게이션">
        <Link
          href="/"
          className="button-action-primary mt-5 text-2xl text-white"
          aria-label="홈페이지로 돌아가기"
        >
          홈으로 가기
        </Link>
      </nav>
    </section>
  );
};

export default NotFound;
