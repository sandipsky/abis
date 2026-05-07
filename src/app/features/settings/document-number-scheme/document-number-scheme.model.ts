export interface IDocumentNumberScheme {
  id: number;
  name: string;
  module?: string;
  start_date: string;
  end_date: string;
  numbering_style: string;
  prefix: string;
  body_length: string;
  total_length: string;
  start_no: string;
  end_no: string;
  current_no?: string;
  url?: string;
}
