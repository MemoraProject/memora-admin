"use client";

import React, { useRef, useState } from "react";
import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import "./tiptap.css";
import { Button } from "@/components/ui/button";
import { MenuBar } from "./EditBlog";
import { useUpload } from "@/hooks/useUpload";

type LessonDocumentEditorProps = {
  value: string;
  onChange: (html: string) => void;
  className?: string;
};

// Use the more feature-rich MenuBar from EditBlog
function Toolbar({ fileRoute }: { fileRoute?: string }) {
  return <MenuBar fileRoute={fileRoute} />;
}

export default function LessonDocumentEditor({
  value,
  onChange,
  className,
}: LessonDocumentEditorProps) {
  const [content, setContent] = useState<string>(value || "");
  const uploader = useUpload({
    prefix: "images/documents",
    allowedContentTypes: ["image/jpeg", "image/png", "image/webp", "image/gif"],
    maxBytes: 10 * 1024 * 1024,
  });

  // We need access to editor instance. Implement inner component to wire uploads.
  function InnerEditor() {
    const { editor } = useCurrentEditor();

    const onPickImage = async (files: FileList) => {
      if (!editor) return;
      const file = files[0];
      if (!file) return;
      try {
        const { publicUrl } = await uploader.upload(file);
        editor.chain().focus().setImage({ src: publicUrl }).run();
      } catch (err) {
        // noop; upstream toasts can inform user in parent form if needed
      }
    };

    // The shared MenuBar handles image selection internally via its own input; no need to pass handler
    return <Toolbar fileRoute="tiptap/" />;
  }

  return (
    <div className={`tiptap-editor flex flex-col ${className ?? ""}`}>
      <EditorProvider
        slotBefore={<InnerEditor />}
        extensions={extensions}
        content={content}
        editable
        immediatelyRender={false}
        onUpdate={({ editor }) => {
          const html = editor.getHTML();
          setContent(html);
          onChange(html);
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
