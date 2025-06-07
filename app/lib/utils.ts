import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrlParams(baseUrl: string, params: string[]) {
  let url = baseUrl;
  params.forEach((value, index) => {
    if (index === 0) url += `?${value}`;
    else url += `&${value}`;
  });

  return url;
}
