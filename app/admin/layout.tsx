import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/src/components/AdminSidebar"

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarTrigger />
      <main className="py-6 pr-6 p-1">
        {children}
      </main>
    </SidebarProvider>
  )
}