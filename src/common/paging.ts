export type PagingParams = {
  offset : number
  limit : number
}

export interface PagingResult<T> {
  totalPage: number
  data: T[]
}

function paging(page?: number, size?: number): PagingParams {
  const DEFAULT_PAGE = 1
  const DEFAULT_SIZE = 8
  
  if (!page || page <= 0) page = DEFAULT_PAGE
  if (!size || size <= 0) size = DEFAULT_SIZE
  
  return {
    offset: (page - 1) * size,
    limit: size
  }
}

export default paging