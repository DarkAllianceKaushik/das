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
  version?: string;
  changelog?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SiteSettings {
  discordUrl: string;
}

export interface ScriptsData {
  scripts: Script[];
  categories: string[];
  settings: SiteSettings;
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
  version?: string;
  changelog?: string;
}
