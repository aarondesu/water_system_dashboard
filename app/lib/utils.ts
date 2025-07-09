import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

const formatter = new Intl.NumberFormat("en-us", {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function buildUrlParams(
  baseUrl: string,
  params: (string | undefined)[]
) {
  let url = baseUrl;
  params.forEach((value, index) => {
    if (value !== undefined) {
      if (index === 0) url += `?${value}`;
      else url += `&${value}`;
    }
  });

  return url;
}

export function formatNumber(num: number) {
  return formatter.format(num);
}

export function resolvePromises(promises: (() => Promise<any>)[]) {
  return promises.reduce(
    (prev, next) => prev.then(() => next()),
    Promise.resolve()
  );
}
