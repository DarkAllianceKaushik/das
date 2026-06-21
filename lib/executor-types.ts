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
}

export interface WEAOResponse {
  result?: Executor[];
  message?: string;
}
