import { RoseLoader } from "@/src/components/Loader";

export default function Loading() {
  return (
    <div className="flex h-[80vh] w-full flex-col items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <RoseLoader size={80} className="text-blue-500" />
        <p className="text-sm text-muted-foreground animate-pulse">
          Data loading...
        </p>
      </div>
    </div>
  );
}