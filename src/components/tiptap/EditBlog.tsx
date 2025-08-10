"use client";

import {
  ChainedCommands,
  Editor,
  EditorProvider,
  useCurrentEditor,
} from "@tiptap/react";
import {
  AlignCenterIcon,
  AlignLeftIcon,
  AlignRightIcon,
  Bold,
  Code,
  CornerDownLeft,
  Eraser,
  Heading1,
  Heading2,
  Heading3,
  Heading4,
  Heading5,
  Heading6,
  ImagePlus,
  Italic,
  Link as LinkIcon,
  List,
  ListOrdered,
  Pilcrow,
  Redo,
  RemoveFormatting,
  SquareCode,
  Strikethrough,
  Table as TableIcon,
  TextQuote,
  Undo,
  WrapText,
  YoutubeIcon,
  ExternalLink,
} from "lucide-react";
import React, { useRef, useState, useEffect } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { extensions } from "./extensions";
import "./tiptap.css";
import { extractTableOfContents, addHeadingIds } from "./blog-helpers";

import Image from "next/image";
import { uploadMultiImages } from "@/api/upload";

export const MenuBar = ({ fileRoute = "temp/" }: { fileRoute?: string }) => {
  const { editor } = useCurrentEditor();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [linkUrl, setLinkUrl] = useState("");
  const [linkTarget, setLinkTarget] = useState("_self");
  const [linkRel, setLinkRel] = useState("");
  const [showLinkDialog, setShowLinkDialog] = useState(false);
  const [showYoutubeDialog, setShowYoutubeDialog] = useState(false);
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [simpleLinkDialog, setSimpleLinkDialog] = useState(false);
  const [simpleLinkUrl, setSimpleLinkUrl] = useState("");
  const [simpleLinkText, setSimpleLinkText] = useState("");
  const [simpleLinkNofollow, setSimpleLinkNofollow] = useState(false);

  // Table dialog state
  const [showTableDialog, setShowTableDialog] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableColumns, setTableColumns] = useState(3);
  const [tableWithHeaderRow, setTableWithHeaderRow] = useState(true);

  // Image upload state
  const [showImageDialog, setShowImageDialog] = useState(false);
  const [imageAlt, setImageAlt] = useState("");
  const [imageTitle, setImageTitle] = useState("");
  const [pendingImageFile, setPendingImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreviewUrl, setImagePreviewUrl] = useState<string | null>(null);

  // Add useRef for inputs that should get focus
  const youtubeInputRef = useRef<HTMLInputElement>(null);
  const simpleLinkUrlRef = useRef<HTMLInputElement>(null);
  const linkUrlRef = useRef<HTMLInputElement>(null);
  const imageAltRef = useRef<HTMLInputElement>(null);

  // Effect hooks to focus inputs when dialogs open
  useEffect(() => {
    if (showYoutubeDialog) {
      setTimeout(() => youtubeInputRef.current?.focus(), 0);
    }
  }, [showYoutubeDialog]);

  useEffect(() => {
    if (simpleLinkDialog) {
      setTimeout(() => simpleLinkUrlRef.current?.focus(), 0);
    }
  }, [simpleLinkDialog]);

  useEffect(() => {
    if (showLinkDialog) {
      setTimeout(() => linkUrlRef.current?.focus(), 0);
    }
  }, [showLinkDialog]);

  useEffect(() => {
    if (showImageDialog && imageAltRef.current) {
      setTimeout(() => imageAltRef.current?.focus(), 0);
    }
  }, [showImageDialog]);

  if (!editor) {
    return null;
  }

  const handleAddYoutube = () => {
    setYoutubeUrl("");
    setShowYoutubeDialog(true);
  };

  const confirmYoutube = () => {
    if (youtubeUrl) {
      editor
        .chain()
        .focus()
        .setYoutubeVideo({
          src: youtubeUrl,
          width: 640,
          height: 360,
        })
        .run();
      setShowYoutubeDialog(false);
    }
  };

  const handleClickAddOpenFile = () => {
    if (!fileInputRef.current) return;

    // If we're using the enhanced image dialog
    if (showImageDialog) {
      fileInputRef.current.click();
    } else {
      fileInputRef.current.click();
    }
  };

  const handleChangeAddImage = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const files = e.currentTarget.files;
    if (!files || files.length === 0) return;

    // If we're going to show the image dialog with metadata
    if (showImageDialog) {
      const file = files.item(0);
      if (!file) return;
      setPendingImageFile(file);

      // Create a preview URL for the selected image
      const previewUrl = URL.createObjectURL(file);
      setImagePreviewUrl(previewUrl);
      return;
    }

    const selectedImages = Array.from(files).map((file: any) =>
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
    let urls: any[] = await uploadMultiImages(
      selectedImages,
      "/blogs/" + fileRoute,
    );

    urls.forEach((url) => {
      editor
        .chain()
        .focus()
        .setImage({
          src: url,
        })
        .run();
    });
  };

  const openImageDialog = () => {
    setImageAlt("");
    setImageTitle("");
    setPendingImageFile(null);
    setImagePreviewUrl(null);
    setShowImageDialog(true);
  };

  const confirmImageUpload = async () => {
    if (!pendingImageFile) {
      fileInputRef.current?.click();
      return;
    }

    try {
      setUploadingImage(true);

      // Create an array with just the pending file
      const selectedImages = [
        Object.assign(pendingImageFile, {
          preview: URL.createObjectURL(pendingImageFile),
        }),
      ];

      // Upload the image
      const urls = await uploadMultiImages(
        selectedImages,
        "/blogs/" + fileRoute,
      );

      if (urls && urls.length > 0) {
        // Insert the image with alt text and title
        editor
          .chain()
          .focus()
          .setImage({
            src: urls[0] as string,
            alt: imageAlt || pendingImageFile.name,
            title: imageTitle || undefined,
          })
          .run();
      }
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setUploadingImage(false);
      setShowImageDialog(false);
      setPendingImageFile(null);
      if (imagePreviewUrl) {
        URL.revokeObjectURL(imagePreviewUrl);
        setImagePreviewUrl(null);
      }
    }
  };

  const handleAddTable = () => {
    setTableRows(3);
    setTableColumns(3);
    setTableWithHeaderRow(true);
    setShowTableDialog(true);
  };

  const confirmTableInsert = () => {
    editor
      .chain()
      .focus()
      .insertTable({
        rows: tableRows,
        cols: tableColumns,
        withHeaderRow: tableWithHeaderRow,
      })
      .run();
    setShowTableDialog(false);
  };

  const handleAddLink = () => {
    // If text is selected, show dialog to add link
    if (editor.isActive("link")) {
      // If a link is already active, unlink it
      editor.chain().focus().unsetLink().run();
    } else if (editor.state.selection.content().size > 0) {
      // Show dialog if text is selected
      setShowLinkDialog(true);
    } else {
      // If no text is selected, show the simple link dialog
      setSimpleLinkUrl("");
      setSimpleLinkText("");
      setSimpleLinkDialog(true);
    }
  };

  const confirmLink = () => {
    if (linkUrl) {
      // Check if URL has protocol
      let url = linkUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }

      // Always use target="_blank"
      // Ensure noopener is included for security
      let linkRelValue = "_blank";
      let relValue = linkRel;

      if (!relValue.includes("noopener")) {
        relValue = (relValue + " noopener").trim();
      }

      // Apply the link with options
      editor
        .chain()
        .focus()
        .setLink({
          href: url,
          target: "_blank", // Always open in new tab
          rel: relValue || "noopener",
        })
        .run();

      // Reset state and close dialog
      setLinkUrl("");
      setLinkTarget("_blank");
      setLinkRel("");
      setShowLinkDialog(false);
    }
  };

  const confirmSimpleLink = () => {
    if (simpleLinkUrl) {
      // Check if URL has protocol
      let url = simpleLinkUrl;
      if (!/^https?:\/\//i.test(url)) {
        url = "https://" + url;
      }

      const text = simpleLinkText || url;

      // Always use target="_blank" and add rel="noopener" for security
      // Add rel="nofollow" if the checkbox is checked
      const relAttr = simpleLinkNofollow ? "noopener nofollow" : "noopener";

      editor
        .chain()
        .focus()
        .insertContent(
          `<a href="${url}" target="_blank" rel="${relAttr}">${text}</a>`,
        )
        .run();

      setSimpleLinkDialog(false);
      setSimpleLinkNofollow(false);
    }
  };

  // Add keyboard handlers for better usability
  const handleYoutubeKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmYoutube();
    } else if (e.key === "Escape") {
      setShowYoutubeDialog(false);
    }
  };

  const handleSimpleLinkKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmSimpleLink();
    } else if (e.key === "Escape") {
      setSimpleLinkDialog(false);
    }
  };

  const handleLinkDialogKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Enter") {
      e.preventDefault();
      confirmLink();
    } else if (e.key === "Escape") {
      setShowLinkDialog(false);
    }
  };

  return (
    <>
      <div className="sticky top-0 z-10 mb-4 mt-2 flex flex-wrap gap-2 border-b bg-[#fff] px-0 pb-2">
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={
            editor.isActive("bold")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Bold className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={
            editor.isActive("italic")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Italic className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={
            editor.isActive("strike")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Strikethrough className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={
            editor.isActive("code")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Code className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
          variant="outline"
          size="icon"
        >
          <Eraser className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
          variant="outline"
          size="icon"
        >
          <RemoveFormatting className="h-4 w-4" />
        </Button>
        <Input
          type="color"
          className="w-10 rounded-sm p-1"
          value="#000"
          onChange={(e) =>
            editor.chain().focus().setColor(e.target.value).run()
          }
        />
        <Button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={
            editor.isActive("paragraph")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Pilcrow className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor.isActive("heading", { level: 1 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading1 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor.isActive("heading", { level: 2 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading2 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 3 }).run()
          }
          className={
            editor.isActive("heading", { level: 3 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading3 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 4 }).run()
          }
          className={
            editor.isActive("heading", { level: 4 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading4 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 5 }).run()
          }
          className={
            editor.isActive("heading", { level: 5 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading5 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() =>
            editor.chain().focus().toggleHeading({ level: 6 }).run()
          }
          className={
            editor.isActive("heading", { level: 6 })
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <Heading6 className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
          className={
            editor.isActive({ textAlign: "left" })
              ? "is-active text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
        >
          <AlignLeftIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
          className={
            editor.isActive({ textAlign: "center" })
              ? "is-active text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
        >
          <AlignCenterIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
          className={
            editor.isActive({ textAlign: "right" })
              ? "is-active text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
        >
          <AlignRightIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={
            editor.isActive("bulletList")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <List className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={
            editor.isActive("orderedList")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <ListOrdered className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={
            editor.isActive("codeBlock")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <SquareCode className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={
            editor.isActive("blockquote")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <TextQuote className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          variant="outline"
          size="icon"
        >
          <WrapText className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
          variant="outline"
          size="icon"
        >
          <CornerDownLeft className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
          variant="outline"
          size="icon"
        >
          <Undo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
          variant="outline"
          size="icon"
        >
          <Redo className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={() => handleAddYoutube()}
          variant="outline"
          size="icon"
        >
          <YoutubeIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={openImageDialog}
          variant="outline"
          size="icon"
          className="relative"
          aria-label="Add image with alt text"
        >
          <ImagePlus className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={handleAddTable}
          variant="outline"
          size="icon"
        >
          <TableIcon className="h-4 w-4" />
        </Button>
        <Button
          type="button"
          onClick={handleAddLink}
          className={
            editor.isActive("link")
              ? "text-shade-1-100% hover:text-shade-1-85% bg-secondary hover:bg-secondary/80"
              : ""
          }
          variant="outline"
          size="icon"
        >
          <LinkIcon className="h-4 w-4" />
        </Button>
        <input
          onChange={handleChangeAddImage}
          ref={fileInputRef}
          type="file"
          hidden
        />
      </div>

      {/* Link Dialog */}
      {showLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-shade-1-100% w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-primary">
              Add Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">URL</label>
                <input
                  type="text"
                  value={linkUrl}
                  onChange={(e) => setLinkUrl(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="https://example.com"
                  onKeyDown={handleLinkDialogKeyDown}
                  ref={linkUrlRef}
                />
              </div>

              <div>
                <label
                  htmlFor="link-target"
                  className="mb-1 block text-sm font-medium"
                >
                  Open in
                </label>
                <select
                  id="link-target"
                  value={linkTarget}
                  onChange={(e) => setLinkTarget(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  aria-label="Link target"
                >
                  <option value="_self">Same tab</option>
                  <option value="_blank">New tab</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  <div className="flex items-center">
                    <span>Rel attribute</span>
                    <span className="ml-1 text-xs text-gray-500">
                      (optional)
                    </span>
                  </div>
                </label>
                <div className="flex items-center space-x-2">
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={linkRel.includes("nofollow")}
                      onChange={(e) => {
                        const newRel = linkRel
                          .split(" ")
                          .filter((r) => r !== "nofollow");
                        if (e.target.checked) newRel.push("nofollow");
                        setLinkRel(newRel.join(" ").trim());
                      }}
                    />
                    <span className="ml-1">nofollow</span>
                  </label>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={linkRel.includes("sponsored")}
                      onChange={(e) => {
                        const newRel = linkRel
                          .split(" ")
                          .filter((r) => r !== "sponsored");
                        if (e.target.checked) newRel.push("sponsored");
                        setLinkRel(newRel.join(" ").trim());
                      }}
                    />
                    <span className="ml-1">sponsored</span>
                  </label>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowLinkDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmLink}
                className="text-shade-1-100% bg-secondary"
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* YouTube Dialog */}
      {showYoutubeDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-shade-1-100% w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-primary">
              Add YouTube Video
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  YouTube URL
                </label>
                <input
                  type="text"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
                  onKeyDown={handleYoutubeKeyDown}
                  ref={youtubeInputRef}
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowYoutubeDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmYoutube}
                className="text-shade-1-100% bg-secondary"
              >
                Add Video
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Simple Link Dialog */}
      {simpleLinkDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-shade-1-100% w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-primary">
              Add Link
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">URL</label>
                <input
                  type="text"
                  value={simpleLinkUrl}
                  onChange={(e) => setSimpleLinkUrl(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="https://example.com"
                  onKeyDown={handleSimpleLinkKeyDown}
                  ref={simpleLinkUrlRef}
                />
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Text</label>
                <input
                  type="text"
                  value={simpleLinkText}
                  onChange={(e) => setSimpleLinkText(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="Link Text"
                  onKeyDown={handleSimpleLinkKeyDown}
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={simpleLinkNofollow}
                    onChange={(e) => setSimpleLinkNofollow(e.target.checked)}
                    className="rounded"
                  />
                  <span>
                    Add <code>rel=&quot;nofollow&quot;</code> (tell search
                    engines not to follow this link)
                  </span>
                </label>
                <p className="ml-5 mt-1 text-xs text-gray-500">
                  All links will open in a new tab
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setSimpleLinkDialog(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={confirmSimpleLink}
                className="text-shade-1-100% bg-secondary"
              >
                Add Link
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Image Dialog */}
      {showImageDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-shade-1-100% w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-primary">
              Thêm Hình Ảnh với Thuộc Tính SEO
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tệp Hình Ảnh
                </label>
                {pendingImageFile ? (
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center justify-between rounded border p-2">
                      <span className="max-w-[250px] truncate">
                        {pendingImageFile.name}
                      </span>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setPendingImageFile(null);
                          if (imagePreviewUrl) {
                            URL.revokeObjectURL(imagePreviewUrl);
                            setImagePreviewUrl(null);
                          }
                        }}
                      >
                        Thay Đổi
                      </Button>
                    </div>

                    {imagePreviewUrl && (
                      <div className="mt-2 overflow-hidden rounded border">
                        <Image
                          src={imagePreviewUrl}
                          alt="Xem trước"
                          width={400}
                          height={200}
                          className="mx-auto h-auto max-h-[200px] max-w-full object-contain"
                          unoptimized
                        />
                      </div>
                    )}
                  </div>
                ) : (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    Chọn Hình Ảnh
                  </Button>
                )}
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Thuộc Tính Alt <span className="text-red-500">*</span>
                  <span className="ml-1 text-xs text-gray-500">
                    (cho SEO và trợ năng)
                  </span>
                </label>
                <input
                  type="text"
                  value={imageAlt}
                  onChange={(e) => setImageAlt(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="Mô tả nội dung hình ảnh"
                  ref={imageAltRef}
                />
                <p className="mt-1 text-xs text-gray-500">
                  Mô tả về nội dung của hình ảnh cho trình đọc màn hình và công
                  cụ tìm kiếm
                </p>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">
                  Tiêu Đề{" "}
                  <span className="text-xs text-gray-500">(tùy chọn)</span>
                </label>
                <input
                  type="text"
                  value={imageTitle}
                  onChange={(e) => setImageTitle(e.target.value)}
                  className="w-full rounded border border-gray-300 px-3 py-2"
                  placeholder="Tiêu đề hình ảnh (hiển thị khi di chuột qua)"
                />
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => {
                  setShowImageDialog(false);
                  if (imagePreviewUrl) {
                    URL.revokeObjectURL(imagePreviewUrl);
                    setImagePreviewUrl(null);
                  }
                }}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmImageUpload}
                className="text-shade-1-100% bg-secondary"
                disabled={uploadingImage}
              >
                {uploadingImage
                  ? "Đang Tải..."
                  : pendingImageFile
                    ? "Tải Lên & Chèn"
                    : "Chọn Tệp"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Table Dialog */}
      {showTableDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-shade-1-100% w-full max-w-md rounded-lg p-6 shadow-xl">
            <h3 className="mb-4 border-b pb-2 text-lg font-semibold text-primary">
              Tạo Bảng
            </h3>

            <div className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Số hàng
                </label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="20"
                    value={tableRows}
                    onChange={(e) =>
                      setTableRows(
                        Math.max(
                          1,
                          Math.min(20, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                    className="w-20 rounded border border-gray-300 px-3 py-2"
                    aria-label="Số hàng của bảng"
                  />
                  <div className="ml-2 flex">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setTableRows(Math.max(1, tableRows - 1))}
                      className="px-2"
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setTableRows(Math.min(20, tableRows + 1))}
                      className="ml-1 px-2"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="mb-1 block text-sm font-medium">Số cột</label>
                <div className="flex items-center">
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={tableColumns}
                    onChange={(e) =>
                      setTableColumns(
                        Math.max(
                          1,
                          Math.min(10, parseInt(e.target.value) || 1),
                        ),
                      )
                    }
                    className="w-20 rounded border border-gray-300 px-3 py-2"
                    aria-label="Số cột của bảng"
                  />
                  <div className="ml-2 flex">
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setTableColumns(Math.max(1, tableColumns - 1))
                      }
                      className="px-2"
                    >
                      -
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setTableColumns(Math.min(10, tableColumns + 1))
                      }
                      className="ml-1 px-2"
                    >
                      +
                    </Button>
                  </div>
                </div>
              </div>

              <div>
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={tableWithHeaderRow}
                    onChange={(e) => setTableWithHeaderRow(e.target.checked)}
                    className="rounded"
                  />
                  <span>Sử dụng hàng đầu làm tiêu đề</span>
                </label>
              </div>

              <div className="mt-2 rounded border bg-gray-50 p-2 text-xs">
                <p className="text-gray-600">
                  Bảng xem trước: {tableRows} hàng x {tableColumns} cột
                </p>
                <div className="mt-2 max-h-32 overflow-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <tbody>
                      {Array.from({ length: Math.min(tableRows, 5) }).map(
                        (_, rowIndex) => (
                          <tr
                            key={rowIndex}
                            className={
                              rowIndex === 0 && tableWithHeaderRow
                                ? "bg-gray-100"
                                : ""
                            }
                          >
                            {Array.from({
                              length: Math.min(tableColumns, 5),
                            }).map((_, colIndex) =>
                              rowIndex === 0 && tableWithHeaderRow ? (
                                <th
                                  key={colIndex}
                                  className="border border-gray-300 p-1 text-center text-xs"
                                >
                                  Tiêu đề {colIndex + 1}
                                </th>
                              ) : (
                                <td
                                  key={colIndex}
                                  className="border border-gray-300 p-1 text-center text-xs"
                                >
                                  {rowIndex + 1}x{colIndex + 1}
                                </td>
                              ),
                            )}
                            {tableColumns > 5 && (
                              <td className="border px-1 text-center">...</td>
                            )}
                          </tr>
                        ),
                      )}
                      {tableRows > 5 && (
                        <tr>
                          {Array.from({
                            length: Math.min(tableColumns, 5),
                          }).map((_, colIndex) => (
                            <td
                              key={colIndex}
                              className="border border-gray-300 p-1 text-center text-xs"
                            >
                              ...
                            </td>
                          ))}
                          {tableColumns > 5 && (
                            <td className="border px-1 text-center">...</td>
                          )}
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => setShowTableDialog(false)}
              >
                Hủy
              </Button>
              <Button
                onClick={confirmTableInsert}
                className="text-shade-1-100% bg-secondary"
              >
                Tạo Bảng
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const content1 = `
<h2>
  Hi there,
</h2>
<p>
  this is a <em>basic</em> example of <strong>tiptap</strong>. Sure, there are all kind of basic text styles you'd probably expect from a text editor. But wait until you see the lists:
</p>
<ul>
  <li>
    That's a bullet list with one …
  </li>
  <li>
    … or two list items.
  </li>
</ul>
<p>
  Isn't that great? And all of that is editable. But wait, there's more. Let's try a code block:
</p>
<pre><code class="language-css">body {
display: none;
}</code></pre>
<p>
  I know, I know, this is impressive. It's only the tip of the iceberg though. Give it a try and click a little bit around. Don't forget to check the other examples too.
</p>
<blockquote>
  Wow, that's amazing. Good work, boy! 👏
  <br />
  — Mom
</blockquote>
`;

interface EditBlogTiptapProps {
  content: string;
  handleUpdate: (html: string) => void;
  handleTOCUpdate?: (
    toc: { id: string; text: string; level: number; link: string }[],
  ) => void;
  fileRoute?: string;
  className?: string;
}

export default function EditBlogTiptap({
  content,
  handleUpdate,
  handleTOCUpdate,
  fileRoute = "tiptap/",
  className = "",
}: EditBlogTiptapProps) {
  // Initialize with empty string if content is undefined or null
  const [editorContent, setEditorContent] = useState<string>(content || "");

  // For debugging
  useEffect(() => {
    console.log(
      "EditBlogTiptap received content:",
      content ? content.substring(0, 50) + "..." : "empty content",
    );
  }, [content]);

  // Make sure content is updated if it changes externally
  useEffect(() => {
    console.log("Content changed in EditBlogTiptap, updating editor");
    // Update even if content is empty string, but not undefined/null
    setEditorContent(content || "");
  }, [content]);

  return (
    <div className={`tiptap-editor flex flex-col ${className}`}>
      <EditorProvider
        slotBefore={<>{<MenuBar fileRoute={fileRoute} />}</>}
        extensions={extensions}
        content={editorContent}
        editable={true}
        immediatelyRender={false}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          setEditorContent(html); // Update local state

          // Process table of contents
          if (handleTOCUpdate) {
            // Extract table of contents from HTML content
            const toc = extractTableOfContents(html);

            // Add the IDs to the HTML content
            const processedHtml = addHeadingIds(html, toc);

            // Update content with ID-enhanced HTML
            setEditorContent(processedHtml);

            // Provide TOC to parent component
            handleTOCUpdate(toc);

            // Pass the processed HTML with heading IDs back
            handleUpdate(processedHtml);
          } else {
            // Standard update without TOC processing
            handleUpdate(html);
          }
        }}
        editorProps={{
          attributes: {
            class:
              "prose max-w-none p-4 outline-none focus:outline-none min-h-[300px]",
          },
        }}
      >
        {null}
      </EditorProvider>
    </div>
  );
}
