export interface Quiz {
  id: number
  title: string
  description: string | null
  is_published: boolean
  created_at: string
}

export interface Question {
  id: number
  question_text: string
  options: string[]
  correct_option: number
}

export interface StudentQuestion {
  id: number
  question_text: string
  options: string[]
}

export interface StudentQuiz extends Quiz {
  questions: StudentQuestion[]
}
