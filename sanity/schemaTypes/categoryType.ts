import { BookIcon, TagIcon } from "@sanity/icons";
import { defineField, defineType } from "sanity";

export const categoryType = defineType({
  name: "category",
  title: "Category",
  type: "document",
  icon: TagIcon,
  groups: [
    { name: "details", title: "Details", icon: TagIcon, default: true },
    { name: "courses", title: "Courses", icon: BookIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "details",
      validation: (Rule) => [
        Rule.required().error("Category title is required"),
        Rule.max(50).warning("Keep category names concise"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "details",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => [
        Rule.required().error("Slug is required for URL generation"),
      ],
    }),
    defineField({
      name: "description",
      type: "text",
      group: "details",
      description: "Brief description of what courses fall under this category",
      validation: (Rule) => [
        Rule.max(200).warning("Keep descriptions under 200 characters"),
      ],
    }),
    defineField({
      name: "icon",
      type: "string",
      group: "details",
      description:
        "Icon name from lucide-react (e.g., 'code', 'palette', 'database')",
    }),
    defineField({
      name: "coursesInfo",
      title: "Courses in this Category",
      type: "string",
      group: "courses",
      description:
        "Courses are linked to this category via the course's category field. View courses in the Courses section filtered by this category.",
      readOnly: true,
      components: {
        field: (props) => null, // Hide the input, just show the description
      },
    }),
  ],
  preview: {
    select: {
      title: "title",
      subtitle: "description",
    },
    prepare({ title, subtitle }) {
      return {
        title: title || "Untitled Category",
        subtitle: subtitle || "No description",
      };
    },
  },
});
