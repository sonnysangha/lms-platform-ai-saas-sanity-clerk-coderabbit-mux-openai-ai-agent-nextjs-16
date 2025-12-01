import type { DocumentHandle } from "@sanity/sdk-react";

export interface LessonListProps {
  projectId: string;
  dataset: string;
}

export interface LessonData {
  title?: string;
  description?: string;
  slug?: { current?: string };
  hasVideo?: boolean;
  hasContent?: boolean;
}

export interface ModuleLessonsData {
  title?: string;
  lessons?: Array<{
    _ref?: string;
  }>;
}

export interface CourseModulesData {
  title?: string;
  modules?: Array<{
    _ref?: string;
  }>;
}

export type LessonItemProps = DocumentHandle & { index?: number };
