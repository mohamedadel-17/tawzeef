import { Navbar } from "@/src/components/user/NavBar";

export default function Layout({ children }: { children: React.ReactNode }) {
return (
      <div>
        <Navbar />
        <main>{children}</main>
      </div>
  );
}