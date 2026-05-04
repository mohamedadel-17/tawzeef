import { RoseLoader } from "@/src/components/Loader";

export default function MyPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <RoseLoader size={80} className="text-blue-500" />
      <p className="mt-4 text-sm text-muted-foreground">Data loading...</p>
    </div>
  );
}