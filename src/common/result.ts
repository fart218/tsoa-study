export default interface Result {
  code: number
  description: string
}

export interface ResultData<T> extends Result {
  data?: T
}