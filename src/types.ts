export interface Question {
  id: string;
  front: string;
  back: string;
  section_id: string;
  created_at: string;
  updated_at: string;
}
export interface Section {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
  questions: Question[];
}
