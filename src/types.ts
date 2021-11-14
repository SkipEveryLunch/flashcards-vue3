export interface Question {
  id: number;
  front: string;
  back: string;
  section_id: string;
  posted_by: number;
  commented_by: number[];
  created_at: string;
  updated_at: string;
  next_period: string;
  learning_stage: number;
}
export interface Section {
  id: number;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  complete_rate: number;
  count_questions: number;
  questions: Question[];
  posted_by: number;
}
export interface Comment {
  id: number;
  comment_type: string;
  comment_detail: string;
  user_id: number;
  question_id: number;
  created_at: string;
  updated_at: string;
}

export interface Message {
  id: number;
  title: string;
  body: string;
  user_id: number;
  created_at: string;
  updated_at: string;
  is_confirmed: number;
  link_type: string;
  link_data: string;
}
export interface Modal {
  type: 'notification' | 'caution' | 'error';
  message: string;
  cb: {
    name: string;
    cb: any;
  };
}
export interface User {
  id: number;
  first_name: string;
  last_name: string;
  email: string;
  unconfirmed_messages: number;
  created_at: string;
  updated_at: string;
}
