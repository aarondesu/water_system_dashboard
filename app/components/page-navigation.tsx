import { Separator } from "./ui/separator";
import { SidebarTrigger } from "./ui/sidebar";

export default function PageNavigation() {
  return (
    <div className="w-full p-2 flex gap-2 items-center border-b">
      <SidebarTrigger />
      <Separator orientation="vertical" />
      <h4 className="font-bold">Dashboard</h4>
    </div>
  );
}
