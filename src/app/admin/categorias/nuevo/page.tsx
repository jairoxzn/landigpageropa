import { AdminTopbar } from "@/components/admin/topbar";
import { CategoryForm } from "@/components/admin/category-form";

export const dynamic = "force-dynamic";

export default function NewCategoryPage() {
  return (
    <>
      <AdminTopbar title="Nueva categoría" />
      <main className="p-6 lg:p-8">
        <CategoryForm />
      </main>
    </>
  );
}
