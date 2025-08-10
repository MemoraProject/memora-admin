General rules:
  - Ensure code is lean, resuable.
  - You can search the codebase, if you need more information or want clearer explaination then ask
  - Make sure to update the document to keep track of the task progress, implementaiton details and BUG.

Requirements:
- An Admin should be able to add new chapter to a course.
- When on course details screen, next to the chapter heading, should be a "Add chapter" buton.
- On press, it should open a create chapter modal which user can input title and description. When adding a chapter, it is default to be the last chapter.
- The modal should have basic validation for the name of the chapter. description can be empty.
- On success or failure of creating chapter, a toast should be displayed to notify user.
- If chapter added successfully then update the course detail data.

Prerequisite:
- you should setup Tanstack query for this project before moving on to implementing more features.

Progress:
- TanStack Query setup completed.

Implementation details:
- Added global provider `src/components/shared/QueryProvider.tsx` using `QueryClientProvider` and `HydrationBoundary` with sensible defaults.
- Wrapped app layouts with `QueryProvider` so React Query is available across routes:
  - `src/app/(admin)/layout.tsx`
  - `src/app/(auth)/layout.tsx`
  - `src/app/(info)/layout.tsx`
  - `src/app/(user)/layout.tsx`
- Linter check: no errors introduced.

Next steps:
- Implement "Add chapter" modal on course detail page per requirements.