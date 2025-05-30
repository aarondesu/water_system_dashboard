import type { Route } from "./+types/index";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Dashboard" }];
}

export default function DashboardIndex() {
  return <div className="">Hello World!</div>;
}
