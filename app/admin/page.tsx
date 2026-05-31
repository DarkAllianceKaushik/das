import { AdminPageClient } from "@/components/admin/AdminPageClient";

export const metadata = {
  title: "Admin | Dark Alliance Script Store",
};

export default function AdminPage() {
  return (
    <div className="relative z-10 mx-auto max-w-5xl px-4 py-10 sm:px-6 sm:py-14">
      <AdminPageClient />
    </div>
  );
}
