export interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

// API Response Type
export interface QuizResponse {
  success: boolean;
  topic: string;
  questions: Question[];
  error?: string;
}

// Quiz State Type
export interface QuizState {
  topic: string;
  numberOfQuestions: number;
  questions: Question[];
  currentQuestionIndex: number;
  userAnswers: { [questionId: number]: string };
  isLoading: boolean;
  error: string | null;
  isCompleted: boolean;
}

// User Answer Type
export interface UserAnswer {
  questionId: number;
  selectedAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
}