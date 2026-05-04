"use client";

import { useTransition } from "react";
import { updateStatusAction } from "@/lib/actions/applications"; 
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { toast } from "sonner"; // اختياري: لإظهار تنبيه عند النجاح

export function StatusSwitcher({ id, currentStatus }: { id: number, currentStatus: string }) {
  const [isPending, startTransition] = useTransition();

  const handleUpdate = (newStatus: string) => {
    startTransition(async () => {
      try {
        await updateStatusAction(id, newStatus);
        // Optional: show a success toast
        console.log("Status updated successfully");
      } catch (error) {
        console.error("Failed to update status", error);
      }
    });
  };

  return (
    <Select 
      defaultValue={currentStatus} 
      onValueChange={handleUpdate} 
      disabled={isPending}
    >
      <SelectTrigger className="w-[180px]">
        <SelectValue placeholder="Select Status" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Under Review">Under Review</SelectItem>
        <SelectItem value="Accepted">Accepted</SelectItem>
        <SelectItem value="Rejected">Rejected</SelectItem>
      </SelectContent>
    </Select>
  );
}