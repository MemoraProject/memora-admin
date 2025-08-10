"use client";

import { EditorProvider, useEditor } from "@tiptap/react";
import { extensions } from "./extensions";
import "./tiptap.css";
import { useEffect, useState } from "react";

// Default content for testing purposes
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

// Fix for YouTube embeds
function sanitizeHtml(content: string): string {
  // Make sure YouTube embeds are properly formatted
  let sanitized = content;

  // Find and fix YouTube embeds
  const youtubeEmbedRegex = /<iframe[^>]*youtube[^>]*><\/iframe>/g;
  if (youtubeEmbedRegex.test(sanitized)) {
    sanitized = sanitized.replace(
      youtubeEmbedRegex,
      (match) => `<div data-youtube-video>${match}</div>`,
    );
  }

  return sanitized;
}

export default function ViewBlogTipTap({
  content = content1,
  onHeadingsDetected,
}: {
  content?: string;
  onHeadingsDetected?: (
    headings: { id: string; text: string; level: number; link?: string }[],
  ) => void;
}) {
  const [safeContent, setSafeContent] = useState<string>(content);

  // Ensure content is properly handled
  useEffect(() => {
    // If content is undefined, empty string or not a string, use default content
    if (!content || typeof content !== "string") {
      setSafeContent(content1);
      return;
    }

    // Log the content structure to help debug headings
    console.log("Blog content structure:", {
      contentLength: content.length,
      hasHeadings: {
        h1: content.includes("<h1"),
        h2: content.includes("<h2"),
        h3: content.includes("<h3"),
        h4: content.includes("<h4"),
        h5: content.includes("<h5"),
        h6: content.includes("<h6"),
      },
      hasIds: content.includes("id="),
      firstFewChars: content.substring(0, 100),
    });

    // Create a local copy of the content we can modify
    let processedContent = content;

    // Parse headings from the content string
    if (onHeadingsDetected) {
      const headings: {
        id: string;
        text: string;
        level: number;
        link: string;
      }[] = [];

      // Parse the content using DOMParser
      const parser = new DOMParser();
      const doc = parser.parseFromString(processedContent, "text/html");

      // Find all heading elements in the parsed HTML
      const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");
      console.log(`Found ${headingElements.length} headings in HTML content`);

      // Check if we need to perform ID processing
      let needsIdProcessing = false;
      headingElements.forEach((heading) => {
        if (!heading.hasAttribute("id")) {
          needsIdProcessing = true;
        }
      });

      // Process headings and add IDs if needed
      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent || "";

        // Use existing ID if available, otherwise generate one
        const existingId = heading.getAttribute("id");
        const id = existingId || `heading-${index}`;
        const link = `#${id}`;

        // Add to our headings array
        headings.push({ id, text, level, link });

        // Only add ID if it doesn't already have one and we need processing
        if (!existingId && needsIdProcessing) {
          // Get the heading tag name (h1, h2, etc.)
          const tagName = heading.tagName.toLowerCase();

          // Try to find this heading in the original content
          const escapedText = text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

          // Pattern to find the heading tag
          const pattern = new RegExp(
            `<${tagName}(?![^>]*id=)([^>]*)>(${escapedText})</${tagName}>`,
            "i",
          );

          // Replace with ID attribute
          processedContent = processedContent.replace(
            pattern,
            `<${tagName} id="${id}"$1>${text}</${tagName}>`,
          );
        }
      });

      console.log(
        `Processed ${headings.length} headings from content:`,
        headings.map((h) => ({
          id: h.id,
          text: h.text.substring(0, 20),
          level: h.level,
        })),
      );

      // Notify parent component about the detected headings
      if (headings.length > 0) {
        onHeadingsDetected(headings);
      }
    }

    // Sanitize and use the processed content
    setSafeContent(sanitizeHtml(processedContent));
  }, [content, onHeadingsDetected]);

  return (
    <div className="tiptap">
      <EditorProvider
        slotBefore={null}
        extensions={extensions}
        content={safeContent}
        editable={false}
        immediatelyRender={false}
        editorProps={{
          attributes: {
            class: "prose max-w-none outline-none",
          },
        }}
      >
        {null}
      </EditorProvider>
    </div>
  );
}
