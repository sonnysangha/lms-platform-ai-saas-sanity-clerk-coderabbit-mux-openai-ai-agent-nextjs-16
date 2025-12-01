import { PlayIcon, UserIcon, VideoIcon } from "@sanity/icons";
import { defineArrayMember, defineField, defineType } from "sanity";

export const lessonType = defineType({
  name: "lesson",
  title: "Lesson",
  type: "document",
  icon: PlayIcon,
  groups: [
    { name: "content", title: "Content", icon: PlayIcon, default: true },
    { name: "video", title: "Video", icon: VideoIcon },
    { name: "settings", title: "Settings" },
    { name: "completion", title: "Completed By", icon: UserIcon },
  ],
  fields: [
    defineField({
      name: "title",
      type: "string",
      group: "content",
      validation: (Rule) => [
        Rule.required().error("Lesson title is required"),
        Rule.max(100).warning("Keep lesson titles concise"),
      ],
    }),
    defineField({
      name: "slug",
      type: "slug",
      group: "settings",
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
      group: "content",
      description: "Brief overview of what this lesson covers",
      validation: (Rule) => [
        Rule.max(500).warning("Keep descriptions under 500 characters"),
      ],
    }),
    defineField({
      title: "Video file",
      name: "video",
      type: "mux.video",
      group: ["content", "video"],
      description: "Upload or select a video for this lesson",
    }),
    defineField({
      name: "content",
      type: "array",
      group: "content",
      description: "Additional lesson content, notes, or resources",
      of: [
        defineArrayMember({
          type: "block",
        }),
        defineArrayMember({
          type: "image",
          fields: [
            defineField({
              name: "caption",
              type: "string",
              description: "Optional caption for the image",
            }),
            defineField({
              name: "alt",
              type: "string",
              description: "Alternative text for accessibility",
            }),
          ],
        }),
        // TODO: Add code blocks once @sanity/code-input is installed
        // defineArrayMember({
        //   type: "code",
        //   options: {
        //     withFilename: true,
        //   },
        // }),
      ],
    }),
    defineField({
      name: "completedBy",
      type: "array",
      group: "completion",
      description: "List of user IDs who have completed this lesson",
      of: [defineArrayMember({ type: "string" })],
      readOnly: true,
    }),
  ],
  preview: {
    select: {
      title: "title",
    },
    prepare({ title }) {
      return {
        title: title || "Untitled Lesson",
        media: PlayIcon,
      };
    },
  },
});
