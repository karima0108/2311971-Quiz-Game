export interface AnswerSubmission {
  question_id: number
  selected_option: number
}

export interface AttemptSubmission {
  answers: AnswerSubmission[]
}

export interface AttemptResult {
  id: number
  quiz_id: number
  quiz_title: string
  score: number
  total_questions: number
  correct_answers: number
  submitted_at: string
}
