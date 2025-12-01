"use server";

import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";
import { writeClient } from "@/sanity/lib/client";

export async function toggleCourseCompletion(
  courseId: string,
  markComplete: boolean
): Promise<{ success: boolean; isCompleted: boolean }> {
  const { userId } = await auth();

  if (!userId) {
    return { success: false, isCompleted: false };
  }

  try {
    if (markComplete) {
      await writeClient
        .patch(courseId)
        .setIfMissing({ completedBy: [] })
        .append("completedBy", [userId])
        .commit();
    } else {
      await writeClient
        .patch(courseId)
        .unset([`completedBy[@ == "${userId}"]`])
        .commit();
    }

    revalidatePath(`/courses/${courseId}`);
    revalidatePath("/dashboard");

    return { success: true, isCompleted: markComplete };
  } catch (error) {
    console.error("Failed to toggle course completion:", error);
    return { success: false, isCompleted: !markComplete };
  }
}

