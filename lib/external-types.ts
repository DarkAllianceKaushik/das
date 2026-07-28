export type ExternalSource = "scriptblox" | "rscripts";
export type ExternalSourceFilter = "all" | ExternalSource;

export type ExternalPricing = "free" | "paid" | "key";

export interface ExternalScript {
  id: string;
  source: ExternalSource;
  name: string;
  description: string;
  game: string;
  views: number;
  pricing: ExternalPricing;
  url: string;
  imageUrl?: string;
  verified?: boolean;
  patched?: boolean;
  universal?: boolean;
  rawScript?: string;
  likes?: number;
  dislikes?: number;
  mobileReady?: boolean;
  testedExecutors?: string[];
  gameImageUrl?: string;
  gameId?: string;
  author?: string;
  authorDiscord?: string;
}

export interface ExternalScriptsResult {
  scripts: ExternalScript[];
  page: number;
  totalPages: number;
  query: string;
  source: ExternalSourceFilter;
}

export interface GameSearchResult {
  id: string;
  name: string;
  imageUrl?: string;
  scriptCount?: number;
}