export type SendSymbol = "GM" | "GN";

export type SendRecipient = {
  address: string;
  name: string;
};

export type SendFormData = {
  coin?: SendSymbol;
  recipients: SendRecipient[];
};

export const DEFAULT_FORM_DATA: SendFormData = {
  recipients: [{ address: "", name: "" }],
};
