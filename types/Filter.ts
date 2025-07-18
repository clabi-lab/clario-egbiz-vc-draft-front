export interface Filter {
  id: number;
  publish_year: string;
  depth: number;
  parent_id: number | null;
  division: string;
  description: string;
}
