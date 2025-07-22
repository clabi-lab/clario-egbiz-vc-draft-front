"use client";

import { useEffect } from "react";

import Link from "next/link";

import { useDrawerStore } from "../store/useDrawerStore";

const NotFound = () => {
  const setOpen = useDrawerStore((state) => state.setOpen);

  useEffect(() => {
    setOpen(false);
  }, []);

  return (
    <div className="h-[100vh] flex flex-1 items-center justify-center flex-col bg-gray-600">
      <h2 className={"text-5xl font-extrabold text-white"}>Not Found</h2>
      <Link
        href="/"
        className={"button-action-primary mt-5 text-2xl text-white"}
      >
        홈으로 가기
      </Link>
    </div>
  );
};

export default NotFound;
