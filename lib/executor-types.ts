export interface Executor {
  title: string;
  version: string;
  updatedDate: string;
  uncStatus: boolean;
  free: boolean;
  detected: boolean;
  updateStatus: boolean;
  websitelink: string;
  discordlink: string;
  purchaselink: string;
  platform: string;
  type: string;
  cost?: string;
  decompiler?: boolean;
  multiInject?: boolean;
  raknet?: boolean;
  suncStatus?: boolean;
  elementVerified?: boolean;
  extype?: string;
  suncPercentage?: number;
  uncPercentage?: number;
  clientmods?: boolean;
  keysystem?: boolean;
  elementCertified?: boolean;
  longestRunning?: boolean;
  beta?: boolean;
  hidden?: boolean;
  private?: boolean;
  hasIssues?: boolean;
  detectionReason?: string;
  rbxversion?: string;
  roleId?: string;
  index?: number;
  unknown?: boolean;
  possibleBanwave?: boolean;
  trackerId?: string;
  recommendedReason?: string;
  sunc?: {
    suncScrap?: number;
    suncKey?: number;
  };
  slug?: {
    fullDescription?: string;
    logo?: string;
    screenshots?: string[];
    owner?: string;
  };
}

export interface WEAOResponse {
  result?: Executor[];
  message?: string;
}