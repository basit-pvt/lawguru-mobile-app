import axios from "axios";
import {
  useQuery,
  UseQueryResult,
  useMutation,
  UseMutationResult,
  useInfiniteQuery,
} from "@tanstack/react-query";
import { Question, QuestionsResponse } from "@/app/types/questions";
import apiClient from "@/app/lib/api-client";

export interface QuestionsByUserParams {
  userId: string;
  page?: number;
  limit?: number;
}

export interface AskQuestionPayload {
  question: string;
  userId: string;
}

export const fetchQuestionsByUserId = async (
  params: QuestionsByUserParams
): Promise<QuestionsResponse> => {
  const { userId, page = 0, limit = 10 } = params;
  const url = `/questions?authorId=${userId}&page=${page}&limit=${limit}`;
  const response = await apiClient.get(url, {
    headers: {
      "Content-Type": "application/json",
      // Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const fetchQuestionsByUserIdInfinite = async ({
  userId,
  pageParam = 0,
  limit = 10,
}: {
  userId: string;
  pageParam?: number;
  limit?: number;
}): Promise<QuestionsResponse> => {
  const url = `/questions?authorId=${userId}&page=${pageParam}&limit=${limit}`;
  const response = await apiClient.get(url, {
    headers: {
      "Content-Type": "application/json",
    },
  });
  return response.data;
};

export const askQuestionApi = async (
  payload: AskQuestionPayload
): Promise<Question> => {
  const { question, userId } = payload;
  const response = await apiClient.post(
    `/questions`,
    { question, authorId: userId },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  return response.data;
};

export const useQuestionsByUserId = (
  params: QuestionsByUserParams
): UseQueryResult<QuestionsResponse, Error> => {
  return useQuery<QuestionsResponse, Error>({
    queryKey: ["questions", params],
    queryFn: () => fetchQuestionsByUserId(params),
    enabled: !!params.userId,
  });
};

export const useAskQuestion = (): UseMutationResult<
  Question,
  Error,
  AskQuestionPayload
> => {
  return useMutation<Question, Error, AskQuestionPayload>({
    mutationFn: askQuestionApi,
  });
};

export const useInfiniteQuestionsByUserId = ({
  userId,
  pageSize = 10,
}: {
  userId: string;
  pageSize?: number;
}) => {
  return useInfiniteQuery<QuestionsResponse, Error>({
    queryKey: ["questions", userId],
    queryFn: ({ pageParam = 0 }) =>
      fetchQuestionsByUserIdInfinite({
        pageParam: pageParam as number,
        userId,
        limit: pageSize,
      }),
    getNextPageParam: (lastPage, allPages) =>
      (lastPage?.questions?.length || 0) === pageSize
        ? allPages.length
        : undefined,
    initialPageParam: 0,
    enabled: !!userId,
  });
};
