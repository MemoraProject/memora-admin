import { Color } from "@tiptap/extension-color";
import { ListItem } from "@tiptap/extension-list-item";
import { TextStyle, TextStyleOptions } from "@tiptap/extension-text-style";
import { StarterKit } from "@tiptap/starter-kit";
import { Youtube } from "@tiptap/extension-youtube";
import { Image } from "@tiptap/extension-image";
import { Typography } from "@tiptap/extension-typography";
import ImageResize from "tiptap-extension-resize-image";
import { TextAlign } from "@tiptap/extension-text-align";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Link } from "@tiptap/extension-link";

export const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] } as
    | Partial<TextStyleOptions>
    | undefined),
  TextStyle.configure({ HTMLAttributes: { li: { class: "my-list-item" } } }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
  }),
  Youtube.configure({
    inline: false,
    nocookie: true,
    controls: true,
    modestBranding: true,
    HTMLAttributes: {
      class: "youtube-embed",
    },
  }),
  Image.configure({
    allowBase64: true,
    inline: true,
  }),
  ImageResize,
  Typography,
  TextAlign.configure({ types: ["heading", "paragraph", "image"] }),
  // Table extensions
  Table.configure({
    resizable: true,
    HTMLAttributes: {
      class: "border-collapse table-auto w-full border border-gray-200",
    },
  }),
  TableRow.configure({
    HTMLAttributes: {
      class: "border-b border-gray-200",
    },
  }),
  TableHeader.configure({
    HTMLAttributes: {
      class:
        "border-b-2 border-gray-200 bg-gray-100 font-bold text-left px-4 py-2",
    },
  }),
  TableCell.configure({
    HTMLAttributes: {
      class: "border border-gray-200 px-4 py-2",
    },
  }),
  // Enhanced Link extension with options
  Link.configure({
    openOnClick: true, // Make links clickable in view mode
    HTMLAttributes: {
      class: "text-primary underline",
      target: "_blank", // Open links in new tab by default
      rel: "noopener noreferrer nofollow", // Best practice for security
    },
  }),
  // MyImage,
];
