export type Question = {
  id: string;
  status: "PENDING" | "ANSWERED";
  question: string;
  answer?: string;
  answeredAt: string;
};

export type QuestionsResponse = {
  questions: Question[];
  pageCount?: number;
};
