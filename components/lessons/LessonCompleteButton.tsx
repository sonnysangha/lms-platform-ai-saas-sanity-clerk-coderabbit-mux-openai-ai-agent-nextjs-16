"use client";

import { useState, useTransition } from "react";
import { CheckCircle2, Circle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toggleLessonCompletion } from "@/app/(app)/lessons/actions";

interface LessonCompleteButtonProps {
  lessonId: string;
  isCompleted: boolean;
}

export function LessonCompleteButton({
  lessonId,
  isCompleted: initialCompleted,
}: LessonCompleteButtonProps) {
  const [isCompleted, setIsCompleted] = useState(initialCompleted);
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    startTransition(async () => {
      const result = await toggleLessonCompletion(lessonId, !isCompleted);
      if (result.success) {
        setIsCompleted(result.isCompleted);
      }
    });
  };

  return (
    <Button
      onClick={handleToggle}
      disabled={isPending}
      variant={isCompleted ? "ghost" : "default"}
      className={
        isCompleted
          ? "bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300"
          : "bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white border-0"
      }
    >
      {isPending ? (
        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
      ) : isCompleted ? (
        <CheckCircle2 className="w-4 h-4 mr-2" />
      ) : (
        <Circle className="w-4 h-4 mr-2" />
      )}
      {isCompleted ? "Completed" : "Mark as Complete"}
    </Button>
  );
}
