export interface StudySet {
  id: number;
  keyword: string;
  name: string;
  isPublic: boolean;
  imgUrl?: string | null;
  aiGeneratedId?: number | null;
  sourceType?: number;
  totalCard: number;
  learnedCards: number;
  isCloned?: boolean;
  dateCreated?: string;
  cards?: StudyCard[];
}

export interface StudyCard {
  id: number;
  word: string;
  pronounce?: string;
  ranking?: number;
  sinoVietnamese?: string;
  type?: string;
  meaningDescription?: string;
  example?: string;
  exampleMeaning?: string;
  meaning?: string;
  order?: number;
  imgUrl?: string | null;
  cardSounds?: StudyCardSound[];
}

export interface StudyCardSound {
  id: number;
  type: "word" | "meaning_description" | "example" | string;
  slowAudioUrl?: string | null;
  normalAudioUrl?: string | null;
  fastAudioUrl?: string | null;
}
