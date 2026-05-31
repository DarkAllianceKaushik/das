export type PricingType = "free" | "paid";
export type LinkType = "pastebin" | "linkvertise" | "direct" | "other";

export interface Script {
  id: string;
  name: string;
  description: string;
  category: string;
  tags: string[];
  pricing: PricingType;
  downloadUrl: string;
  linkType: LinkType;
  featured?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface ScriptsData {
  scripts: Script[];
  categories: string[];
}

export interface ScriptInput {
  name: string;
  description: string;
  category: string;
  tags: string[];
  pricing: PricingType;
  downloadUrl: string;
  linkType: LinkType;
  featured?: boolean;
}
