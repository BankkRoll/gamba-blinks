// src/utils/types.ts

// blinks
//*****************************************************************************
export interface ActionGetResponse {
  // URL to the icon image
  icon: string;

  // Title of the action
  title: string;

  // Description of the action
  description: string;

  // Label for the action button
  label: string;

  // Indicates if the action is disabled
  disabled?: boolean;

  // Array of linked actions
  links?: {
    actions: LinkedAction[];
  };

  // Error object, if any
  error?: ActionError;
}

export interface ActionError {
  // Error message
  message: string;
}

export interface LinkedAction {
  // URL to the linked action
  href: string;

  // Label for the linked action
  label: string;

  // Parameters for the linked action
  parameters?: ActionParameter[];
}

export interface ActionParameter {
  // Name of the parameter
  name: string;

  // Label for the parameter
  label?: string;

  // Indicates if the parameter is required
  required?: boolean;
}

export interface ActionPostRequest {
  // Account ID
  account: string;

  // Amount to be wagered
  amount: string;
}

export interface ActionPostResponse {
  // Serialized transaction in base64
  transaction: string;

  // Optional message
  message?: string;
}

// events
//*****************************************************************************
export interface GambaEvent {
  signature: string;
  wager: number;
  payout: number;
  usd_wager: number;
  usd_profit: number;
  profit: number;
  user: string;
  creator: string;
  token: string;
  jackpot: number;
  multiplier: number;
  time: number;
}

export interface ApiResponse {
  results: GambaEvent[];
  total: number;
}
