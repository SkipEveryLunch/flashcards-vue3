export interface Question {
  id: number;
  front: string;
  back: string;
  section_id: string;
  created_at: string;
  updated_at: string;
  next_period: string;
  learning_stage: number;
}
export interface Section {
  id: number;
  title: string;
  created_at: string;
  updated_at: string;
  complete_rate: number;
  questions: Question[];
}
