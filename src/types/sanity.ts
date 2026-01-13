import type { PortableTextBlock } from "astro-portabletext";

export interface SanitySlug {
  current: string;
  _type?: "slug";
}

export interface SanityImage {
  _type: "image";
  asset: {
    _ref: string;
    _type: "reference";
  };
}

export interface Trip {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  date: string;
  location: string;
  cover?: SanityImage;
  tags?: string[];
  body?: PortableTextBlock[];
}

export interface Note {
  _id: string;
  title: string;
  slug: SanitySlug;
  description?: string;
  date: string;
  cover?: SanityImage;
  tags?: string[];
  body?: PortableTextBlock[];
}

export interface Page {
  _id: string;
  title: string;
  description?: string;
  lastUpdated?: string;
  body?: PortableTextBlock[];
}
