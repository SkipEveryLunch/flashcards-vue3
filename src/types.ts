export interface Question {
  id: number;
  front: string;
  back: string;
  section_id: string;
  created_at: string;
  updated_at: string;
}
export interface Section {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
}
