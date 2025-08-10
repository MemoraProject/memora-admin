import { Image } from "@tiptap/extension-image";
import { RawCommands, mergeAttributes } from "@tiptap/react";

// export const MyImage = Image.extend({
//   addOptions() {
//     return {
//       inline: false,
//       allowBase64: true,
//       HTMLAttributes: {},
//       sizes: ["inline", "block", "left", "right"],
//     };
//   },
//   renderHTML({ HTMLAttributes }) {
//     const { style } = HTMLAttributes;
//     return [
//       "figure",
//       { style },
//       ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
//     ];
//   },
// });

// interface ExtendedRawCommands extends RawCommands {
//   setImageAlignment: (
//     alignment: any
//   ) => ({ commands }: { commands: any }) => any;
// }

// export const MyImage = Image.extend({
//   addCommands() {
//     return {
//       setImageAlignment:
//         (alignment) =>
//         ({ commands }) => {
//           return commands.setNodeAttributes("myImage", { align: alignment });
//         },
//     } as Partial<ExtendedRawCommands>;
//   },
//   addOptions() {
//     return {
//       inline: false,
//       allowBase64: true,
//       HTMLAttributes: {},
//       sizes: ["inline", "block", "left", "right"],
//       align: "center", // default alignment
//     };
//   },
//   renderHTML({ node, HTMLAttributes }) {
//     let style = HTMLAttributes.style || "";
//     if (node.attrs.align === "left") {
//       style += "float: left;";
//     } else if (node.attrs.align === "right") {
//       style += "float: right;";
//     } else {
//       style += "display: block; margin-left: auto; margin-right: auto;";
//     }

//     return [
//       "figure",
//       { style },
//       ["img", mergeAttributes(this.options.HTMLAttributes, HTMLAttributes)],
//     ];
//   },
// });
