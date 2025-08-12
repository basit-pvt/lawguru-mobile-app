import {
  useQuery,
  useInfiniteQuery,
  UseQueryResult,
  UseInfiniteQueryResult,
  InfiniteData,
} from "@tanstack/react-query";
import { Article, ArticlesResponse } from "@/app/types/articles";
import apiClient from "@/app/lib/api-client";

export interface ArticlesParams {
  page?: number;
  limit?: number;
  category?: string;
  search?: string; // Add search parameter
}

export interface Category {
  id: string;
  name: string;
  description: string;
}

export interface CategoriesResponse {
  categories: Category[];
}

export const fetchArticles = async (
  params: ArticlesParams = {}
): Promise<ArticlesResponse> => {
  const { page = 0, limit = 10, category, search } = params;

  let url = `/articles?page=${page}&limit=${limit}&status=PUBLISHED`;
  if (category && category !== "All") {
    url += `&categories=${encodeURIComponent(category)}`;
  }
  if (search && search.trim() !== "") {
    url += `&title=${encodeURIComponent(search)}`;
  }
  console.log({ url });
  const response = await apiClient.get(url, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

const fetchArticleById = async (id: string) => {
  const response = await apiClient.get(`/articles/${id}`);
  return response.data;
};

// Fetch categories from the categories API
export const fetchCategories = async (): Promise<CategoriesResponse> => {
  const response = await apiClient.get(`/category`, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

export const useArticles = (
  params: ArticlesParams = {}
): UseQueryResult<ArticlesResponse, Error> => {
  return useQuery<ArticlesResponse, Error>({
    queryKey: ["articles", params],
    queryFn: () => fetchArticles(params),
  });
};

export const useArticlesById = (
  newsId: string
): UseQueryResult<Article, Error> => {
  return useQuery<Article, Error>({
    queryKey: ["article", newsId],
    queryFn: () => fetchArticleById(newsId),
    enabled: !!newsId,
  });
};

// Hook to fetch categories
export const useCategories = (): UseQueryResult<CategoriesResponse, Error> => {
  return useQuery<CategoriesResponse, Error>({
    queryKey: ["categories"],
    queryFn: fetchCategories,
  });
};

export const useInfiniteArticles = (
  params: Omit<ArticlesParams, "page"> = {}
): UseInfiniteQueryResult<InfiniteData<ArticlesResponse>, Error> => {
  return useInfiniteQuery<ArticlesResponse, Error>({
    queryKey: ["infinite-articles", params],
    queryFn: ({ pageParam }) =>
      fetchArticles({ ...params, page: pageParam as number }),
    getNextPageParam: (lastPage, allPages) => {
      // console.log({ lastPage, allPages });
      // lastPage.pageCount is the total number of pages
      // allPages.length is the current number of pages we've fetched
      const currentPage = allPages.length - 1; // Since we start from page 0
      const hasMorePages = currentPage < lastPage.pageCount - 1;

      if (hasMorePages) {
        return currentPage + 1; // Return the next page number
      }
      return undefined; // No more pages
    },
    initialPageParam: 0,
  });
};

// Get unique categories from articles (for backward compatibility)
export const getUniqueCategories = (articles: Article[]): string[] => {
  const categories = articles.flatMap((article) =>
    article.categories.map((cat) => cat.name)
  );
  return ["All", ...Array.from(new Set(categories))];
};
