"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { createDocument, useApplyDocumentActions } from "@sanity/sdk-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function NewCategoryPage() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const apply = useApplyDocumentActions();

  const handleCreate = () => {
    startTransition(async () => {
      await apply(
        createDocument({
          documentType: "category",
        }),
      );

      // Navigate to categories list - new document will appear at top
      router.push("/admin/categories");
    });
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <Link href="/admin/categories">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">New Category</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Create a new category</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            A new category will be created. You can then click on it from the
            list to edit its details.
          </p>
          <Button
            onClick={handleCreate}
            disabled={isPending}
            className="w-full"
          >
            {isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Category"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
