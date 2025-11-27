import { BlockContentIcon, BookIcon, PlayIcon, TagIcon } from "@sanity/icons";
import type { StructureResolver } from "sanity/structure";

export const structure: StructureResolver = (S, context) =>
  S.list()
    .title("LMS Content")
    .items([
      S.listItem()
        .title("Courses")
        .icon(BookIcon)
        .child(S.documentTypeList("course").title("Courses")),
      S.listItem()
        .title("Modules")
        .icon(BlockContentIcon)
        .child(S.documentTypeList("module").title("Modules")),
      S.listItem()
        .title("Lessons")
        .icon(PlayIcon)
        .child(S.documentTypeList("lesson").title("Lessons")),
      S.divider(),
      S.listItem()
        .title("Categories")
        .icon(TagIcon)
        .child(
          S.documentTypeList("category")
            .title("Categories")
            .child((categoryId) =>
              S.list()
                .title("Category")
                .items([
                  S.listItem()
                    .title("Category Details")
                    .icon(TagIcon)
                    .child(
                      S.document()
                        .schemaType("category")
                        .documentId(categoryId)
                    ),
                  S.listItem()
                    .title("Courses in Category")
                    .icon(BookIcon)
                    .child(
                      S.documentList()
                        .title("Courses")
                        .filter('_type == "course" && category._ref == $categoryId')
                        .params({ categoryId })
                    ),
                ])
            )
        ),
    ]);
