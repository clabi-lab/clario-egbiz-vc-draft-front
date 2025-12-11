"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";

const ProjectPage = () => {
  useEffect(() => {
    redirect("/");
  }, []);

  return null;
};

export default ProjectPage;
