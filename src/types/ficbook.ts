export type Config = {
  enableLogging?: boolean;
};

export type Credentials = {
  rme: string;
  phpSessionId: string;
};

export type PartialCredentials = Partial<Credentials>;

export type RegisterBuilder = {
  username: string;
  email: string;
  password: string;
};

export enum TopType {
  Weekly = 1,
  All = 2,
}

export type CreateFanficBuilder = {
  title: string;
  fandomId: string;
  pairing?: string;
  rating?: string;
  description: string;
  authorComment?: string;
  size?: string;
};

export type AddPartBuilder = {
  fanficId: string;
  title: string;
  content: string;
};
