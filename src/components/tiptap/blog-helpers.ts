/**
 * Helper function to generate a table of contents from HTML content
 *
 * @param content HTML content to parse
 * @returns Array of heading objects with id, text, level, and link
 */
export function extractTableOfContents(
  content: string,
): { id: string; text: string; level: number; link: string }[] {
  if (!content) return [];

  const headings: { id: string; text: string; level: number; link: string }[] =
    [];

  try {
    // Use DOMParser in browser environments
    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      // Find all heading elements
      const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

      headingElements.forEach((heading, index) => {
        const level = parseInt(heading.tagName.substring(1));
        const text = heading.textContent || "";
        const id = `heading-${index}`;
        const link = `#${id}`;

        headings.push({ id, text, level, link });
      });
    }
    // For SSR/server contexts, use regex parsing as a fallback
    else {
      // Match heading tags with their content
      const headingRegex = /<h([1-6])(?:[^>]*)>(.*?)<\/h\1>/g;
      let match: RegExpExecArray | null;
      let index = 0;

      while ((match = headingRegex.exec(content)) !== null) {
        const level = parseInt(match[1] ?? "1");
        // Remove any HTML tags within the heading text
        const text = (match[2] ?? "").replace(/<\/?[^>]+(>|$)/g, "");
        const id = `heading-${index}`;
        const link = `#${id}`;

        headings.push({ id, text, level, link });
        index++;
      }
    }
  } catch (error) {
    console.error("Error extracting table of contents:", error);
  }

  return headings;
}

/**
 * Adds ID attributes to heading elements in HTML content
 *
 * @param content Original HTML content
 * @param tableOfContents Table of contents with heading IDs
 * @returns HTML content with IDs added to heading elements
 */
export function addHeadingIds(
  content: string,
  tableOfContents: { id: string; text: string; level: number; link: string }[],
): string {
  if (!content || !tableOfContents.length) return content;

  let processedContent = content;

  try {
    // Use DOM manipulation in browser environments
    if (typeof window !== "undefined") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(content, "text/html");

      const headingElements = doc.querySelectorAll("h1, h2, h3, h4, h5, h6");

      // Track whether we made any changes
      let contentChanged = false;

      // Match headings from the document with our table of contents
      tableOfContents.forEach((heading, index) => {
        const headingEl = headingElements.item(index);
        if (headingEl) {
          const level = parseInt(headingEl.tagName.substring(1));
          const headingText = headingEl.textContent?.trim() || "";

          // Make sure we're matching the right heading
          if (
            level === heading.level &&
            (headingText === heading.text.trim() ||
              headingText.includes(heading.text.trim()) ||
              heading.text.trim().includes(headingText))
          ) {
            // Check if it already has an ID
            if (!headingEl.hasAttribute("id")) {
              // Original tag as string
              const originalTag = headingEl.outerHTML;
              // Tag name (h1, h2, etc.)
              const tagName = headingEl.tagName.toLowerCase();
              // Opening tag pattern
              const openingTag = `<${tagName}`;

              // Replace with ID attribute
              const newTag = originalTag.replace(
                openingTag,
                `${openingTag} id="${heading.id}"`,
              );
              processedContent = processedContent.replace(originalTag, newTag);
              contentChanged = true;
            }
          }
        }
      });

      // If we made changes through DOM manipulation
      if (contentChanged) {
        return processedContent;
      }

      // Fallback: If DOM manipulation didn't work, try regex approach
      tableOfContents.forEach((heading) => {
        const level = heading.level;
        const tagName = `h${level}`;
        const textEscaped = heading.text
          .trim()
          .replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special chars

        // Check if the heading already has this ID
        const hasIdPattern = new RegExp(
          `<${tagName}[^>]*id=["']${heading.id}["'][^>]*>`,
        );
        if (hasIdPattern.test(processedContent)) {
          return; // Already has the ID
        }

        // First try exact match without ID
        const exactPattern = new RegExp(
          `<${tagName}(?![^>]*id=)[^>]*>(${textEscaped})</${tagName}>`,
          "i",
        );
        if (exactPattern.test(processedContent)) {
          processedContent = processedContent.replace(
            exactPattern,
            `<${tagName} id="${heading.id}">${heading.text}</${tagName}>`,
          );
          return;
        }

        // If exact match fails, try fuzzy match
        const fuzzyPattern = new RegExp(
          `<${tagName}(?![^>]*id=)[^>]*>([^<]*${textEscaped.substring(
            0,
            Math.min(20, textEscaped.length),
          )}[^<]*)</${tagName}>`,
          "i",
        );
        if (fuzzyPattern.test(processedContent)) {
          const match = fuzzyPattern.exec(processedContent);
          if (match && match[1]) {
            processedContent = processedContent.replace(
              fuzzyPattern,
              `<${tagName} id="${heading.id}">${match[1]}</${tagName}>`,
            );
          }
        }
      });
    }
    // For SSR/server contexts, use regex replacement
    else {
      tableOfContents.forEach((heading) => {
        const level = heading.level;
        const tagName = `h${level}`;
        const textEscaped = heading.text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // Escape regex special chars

        // First check if it already has the ID
        const hasIdPattern = new RegExp(
          `<${tagName}[^>]*id=["']${heading.id}["'][^>]*>`,
        );
        if (hasIdPattern.test(processedContent)) {
          return; // Already has the ID
        }

        // Try different patterns in order of preference
        const patterns = [
          // Exact match without ID
          new RegExp(
            `<${tagName}(?![^>]*id=)[^>]*>(${textEscaped})</${tagName}>`,
            "i",
          ),
          // Match with some formatting inside
          new RegExp(
            `<${tagName}(?![^>]*id=)[^>]*>(.*?${textEscaped}.*?)</${tagName}>`,
            "i",
          ),
          // Very fuzzy match with beginning of text
          new RegExp(
            `<${tagName}(?![^>]*id=)[^>]*>([^<]*${textEscaped.substring(
              0,
              15,
            )}[^<]*)</${tagName}>`,
            "i",
          ),
        ];

        // Try each pattern until one works
        for (const pattern of patterns) {
          if (pattern.test(processedContent)) {
            const match = pattern.exec(processedContent);
            if (match && match[1]) {
              processedContent = processedContent.replace(
                pattern,
                `<${tagName} id="${heading.id}">${match[1]}</${tagName}>`,
              );
              break;
            }
          }
        }
      });
    }
  } catch (error) {
    console.error("Error adding heading IDs:", error);
  }

  return processedContent;
}
