export enum LessonResourceType {
  Video = 0,
  StudySet = 1,
  Quiz = 2,
  Document = 3,
}

export interface LessonDetail {
  id: number;
  title: string;
  order: number;
  description?: string | null;
  isLock: boolean;
  type: LessonResourceType;
  resourceId?: number;
  studySet?: StudySetSummary | null;
  quiz?: QuizSummary | null;
  video?: VideoSummary | null;
  document?: DocumentSummary | null;
  chapterId: number;
  dateCreated: string;
  dateModified: string;
  createdBy?: string | null;
  modifiedBy?: string | null;
}

export interface VideoSummary {
  id: number;
  url: string;
  duration?: number;
}

export interface DocumentSummary {
  title: string;
  content?: string;
  id?: number;
}

export interface StudySetSummary {
  id: number;
  keyword?: string;
  name: string;
  isPublic: boolean;
  imgUrl?: string | null;
  sourceType?: number;
  totalCard?: number;
  learnedCards?: number;
}

export interface QuizSummary {
  id?: number;
  keyword?: string;
  name?: string;
  isPublic?: boolean;
  totalQuestion?: number;
}
