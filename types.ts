export type Filters = {
  order: string;
  orientation: string;
  type: string;
  colors: string;
  category: string;
};

export type FetchImagesParams = {
  page: number;
  q?: string;
} & Partial<Filters>;
