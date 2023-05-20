export interface TranslationGroup {
  id: string;
  name: string;
  createdAt: number;
  updatedAt: number;
  translations: Translation[];
}

export interface Language {
  code: string;
  name: string;
  nativeName: string;
  _id: string;
}

export interface Translation extends Record<string, string> {
  key: string;
}

export interface Namespace {
  _id: string;
  name: string;
  createdAt: string;
  translations: Translation[];
  updatedAt: string;
}