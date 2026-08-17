import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Zero-pad a folio/section number, e.g. 3 -> "03". */
export function folio(n: number): string {
  return n.toString().padStart(2, "0");
}
