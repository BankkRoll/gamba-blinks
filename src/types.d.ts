export interface ActionError {
  message: string; // non-fatal error message to be displayed to the user
}

export interface LinkedAction {
  href: string; // solana pay/actions get/post url
  label: string; // button text
  parameters?: ActionParameter[]; // optional parameters for the action
}

export interface ActionParameter {
  name: string; // parameter name in url
  label?: string; // input placeholder
  required?: boolean; // declare if this field is required (defaults to `false`)
}

export interface ActionsSpecGetResponse {
  icon: string; // URL of an image describing the action
  title: string; // Title of the action
  description: string; // Brief description of the action
  label: string; // Text to be rendered on the action button
  disabled?: boolean; // Optional state for disabling the action button(s)
  links?: {
    actions: LinkedAction[]; // Optional list of related actions
  };
  error?: ActionError; // Optional non-fatal error message
}

export interface ActionsSpecPostRequestBody {
  account: string;
  amount: string;
  side: "heads" | "tails";
}

export interface ActionsSpecPostResponse {
  transaction: string;
  message?: string;
}
