General rules:
  - Ensure code is lean, resuable.
  - You can search the codebase, if you need more information or want clearer explaination then ask
  - Make sure to update the document to keep track of the task progress, implementaiton details and BUG.

Requirements:
- An Admin should be able to see list of course in the current system along with some details of its in the list page.
- You can view the basic structure of the table I just reused form other table currently used in the system.
- Read the API specification in the course_api_specifications.md file.
- Scan my codebase to follow the convention.
- Update the copy pasted code of the /admin/course UI to reflect the list of course. Make the table display all information available from API GET /api/Course. you can ignore get own course and get mycourse for now.

Implementation notes (progress log):
- Added `src/models/course.ts` defining `Course` and `CourseListResponse` according to GET /api/Course.
- Added `src/api/course.ts` with `getAllCourses()` using shared axios instance.
- Updated `src/app/(admin)/admin/course/columns.tsx` to course-specific columns covering all fields from API response.
- Updated `src/app/(admin)/admin/course/page.tsx` to fetch courses and render the table; removed user-specific logic.
- Updated empty state message in `src/app/(admin)/admin/course/data-table.tsx` to "No Course Available".
- Navigation on row click is disabled per current scope (list-only); can be enabled later.

Additions (completed):
- Listing
  - Linked course title to detail page `/admin/course/[id]`.
  - Added top-right "Tạo khóa học" button to open create dialog.
  - Added back buttons to course and lesson detail screens.

- Course Detail (`/admin/course/[id]`)
  - Implemented detail UI similar to provided mock: header with level badge, title, description, chapter/lesson counts, price, and video placeholder.
  - Chapters are shown in accordion; lessons are clickable links to `/admin/lesson/[id]` and display type icons and duration/lock status.
  - Sidebar shows stats and visibility state.
  - Integrated "Chỉnh sửa khóa học" modal (see Edit below) and refreshes detail on save.

- Create Course
  - Created reusable dialog and form: `CreateCourseModal` + `CreateCourseForm`.
  - Fields: title, description, difficultLevel, isPublic, price, identitfier, video file input (no upload), and a chapter editor.
  - Create mode: can add/remove/reorder chapters; sends payload to POST `/api/Course`; success toast; redirects to new detail page.
  - Validation with zod; toasts for success/error.
  - Dialog content is scrollable (`max-h-[85vh] overflow-y-auto`).

- Edit Course
  - Reused the same form in edit mode via `EditCourseModal`.
  - Edit mode: can update course fields and edit existing chapters' title/description and order only (no add/remove in edit mode).
  - Preserves chapter `id` in PUT payload per spec; calls PUT `/api/Course/{id}`; button shows loading state "Đang lưu..."; success/error toasts; refreshes detail.

- Lesson Details
  - Implemented route `/admin/lesson/[id]` with `getLessonById`.
  - Detects type via `LessonResourceType` (0 Video, 1 StudySet, 2 Quiz, 3 Document).
  - StudySet lessons fetch study set via `getStudySetById` and render card layout (word, meaning, pronounce, meaning description, example + 3 speaker icons each; icons only, audio not wired).
  - Video shows URL and duration; Quiz/Document sections stubbed (placeholders).

Known considerations:
- Price formatting assumes VND; adjust currency if needed.
