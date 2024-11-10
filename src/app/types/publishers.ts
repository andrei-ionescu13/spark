import type { Image } from './common';

export interface Publisher {
  _id: string;
  name: string;
  slug: string;
  logo: Image;
}
