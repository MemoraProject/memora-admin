export interface Course {
  id: number;
  title: string;
  description?: string | null;
  imgUrl?: string | null;
  videoUrl?: string | null;
  difficultLevel?: string | null;
  price: number;
  isPublic: boolean;
  identitfier?: string | null;
  totalChapter: number;
  totalLesson: number;
  processing: number;
  createdBy: string;
  dateCreated: string;
  dateModified: string;
  chapters?: Chapter[];
}

export interface CourseListResponse {
  data: Course[];
}

export interface Chapter {
  id: number;
  title: string;
  description?: string | null;
  order: number;
  courseId: number;
  totalCompleteLesson?: number;
  totalLesson: number;
  lessons: Lesson[];
  dateCreated: string;
  dateModified: string;
}

export interface Lesson {
  id: number;
  title: string;
  order: number;
  description?: string | null;
  isLock: boolean;
  type: number; // 0: video, 1: study set, 2: quiz, others possible
  resourceId?: number;
  video?: {
    url: string;
    duration?: number;
    id: number;
  } | null;
  // Additional fields from API not used in UI are omitted for brevity
}
