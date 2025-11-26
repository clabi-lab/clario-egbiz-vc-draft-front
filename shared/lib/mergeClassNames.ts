import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/* Tailwind 클래스를 최적화하여 병합하는 함수 */
export function mergeClassNames(...classes: ClassValue[]) {
  return twMerge(clsx(classes));
}
