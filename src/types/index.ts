export interface Option {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

export interface Question {
  id: string;
  topic: string;
  difficulty: 'easy' | 'medium' | 'hard';
  text: string;
  options: Option[];
  themeName?: string;
}

export interface ThemeData {
  filename?: string;
  theme: string;
  questions: Question[];
}

export interface Bookmark {
  id: string;
  questionText: string;
  themeName: string;
  topic: string;
  correctOptionText: string;
  explanation: string;
  timestamp: number;
}

export interface BlockedQuestion {
  id: string;
  questionText: string;
  themeName: string;
  topic: string;
  timestamp: number;
}
