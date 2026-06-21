export interface Task {
  id: string;
  title: string;
  category: string;
  url: string;
  description: string;
  isCompleted: boolean;
  timeEstimate: string;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  timestamp: string;
}

export interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface TerminalLog {
  text: string;
  type: "input" | "system" | "success" | "error";
  timestamp: string;
}
