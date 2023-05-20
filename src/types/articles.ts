import type { Image } from "./common";

export interface ArticleMeta {
  description: string;
  title: string;
  keywords: string[];
}

export interface ArticleGeneral {
  title: string;
  description: string;
  markdown: string;
  slug: string;
  cover: Image;
}

export type ArticleStatus = 'published' | 'draft' | 'archived';
export type ArticleCategory = 'news' | 'games' | 'reviews';

export interface Article extends ArticleMeta, ArticleGeneral {
  _id: string;
  status: ArticleStatus;
  category: ArticleCategory;
  meta: ArticleMeta;
  createdAt: Date;
  updatedAt?: Date;
}

