export interface PreResults {
  exact: DictionaryResult[]
  onOwn: DictionaryResult[]
  startsWith: DictionaryResult[]
  inParentheses: DictionaryResult[]
  partial: DictionaryResult[]
}

export interface DictionaryResult {
  word: string
  translate: string
}
