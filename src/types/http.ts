export type Headers = Record<string, string>;

export type MobileBuilder = {
  path: string;
  body: string;
};

export type MultipartBuilder = {
  path: string;
  body: Record<string, string>;
};
