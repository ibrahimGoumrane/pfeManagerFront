export interface SearchParams {
  keywords?: string;
  sector?: string;
  tags?: string[];
  fromDate?: string | null;
  toDate?: string | null;
  page?: number;
}
