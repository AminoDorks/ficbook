export type Headers = Record<string, string>;

export type HandleBuilder = {
  path: string;
  response: Response;
  html?: boolean;
};

export type GetBuilder = {
  path: string;
  html?: boolean;
};

export type PostBuilder = {
  path: string;
  body: string;
};

export type MapBuilder = {
  path: string;
  body: Record<string, string>;
};
