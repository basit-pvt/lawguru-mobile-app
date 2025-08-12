type Category = {
  id: string;
  name: string;
  description: string;
};

type Author = {
  id: string;
  name: string;
  email: string;
};

export type Article = {
  id: string;
  title: string;
  slug: string;
  content: string;
  author: Author;
  imageUrl: string;
  updatedAt: string;
  publishedAt: string;
  categories: Category[];
};

export type ArticlesResponse = {
  articles: Article[];
  pageCount: number;
};
