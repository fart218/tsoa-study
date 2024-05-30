import { Request, Response, NextFunction } from 'express'
import cache from 'memory-cache'

interface CustomResponse extends Response {
  sendResponse: any
}

export default async function reqCache(req: Request, res: CustomResponse, next: NextFunction) {
  const key = '__express__' + req.originalUrl || req.url
  const cachedBody = cache.get(key)

  if (cachedBody) {
    res.send(cachedBody)
    return
  } else {
    res.sendResponse = res.send
    res.send = (body) => {
      cache.put(key, body, 10 * 1000); // 10 seconds
      return res.sendResponse(body);
    }
    next()
  }
}