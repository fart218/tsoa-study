import { User } from "./user"
import { read, write } from "../db"
import mapper from "mybatis-mapper"
import { UserModel } from "./userModel"
import { ResultSetHeader } from "mysql2/typings/mysql/lib/protocol/packets/ResultSetHeader"
import { provideSingleton } from "../common/provideSingleton"
import queue from "../db/queue"
import Result from "../common/result"
import { PagingParams, PagingResult } from "../common/paging"
import { RowDataPacket } from "mysql2"

// A post request should not contain an id.
export type UserCreationParams = Pick<User, "email" | "name" | "phoneNumbers">

@provideSingleton(UsersService)
export class UsersService {
  public async get(param: any): Promise<UserModel> {
    var query = mapper.getStatement('user', 'get', param)
    console.log(query)

    const [rows] = await read<UserModel[]>(query)
    console.log(rows[0])
    return rows[0]
  }

  public async getList(params: PagingParams, keyword: string): Promise<PagingResult<UserModel>> {
    var query = mapper.getStatement('user', 'getTotalPage', {...params, keyword: keyword});
    const [result] = await read<RowDataPacket[]>(query);

    query = mapper.getStatement('user', 'getList', {...params, keyword: keyword});
    const [rows] = await read<UserModel[]>(query);

    return {
      totalPage: result[0].totalPage,
      data: rows
    };
  }

  public async create(userCreationParams: UserCreationParams): Promise<User> {
    var query = mapper.getStatement('user', 'create', userCreationParams)
    console.log(query)

    const [result] = await write<ResultSetHeader>(query)
    console.log(result)
    
    return {
      id: result.insertId,
      status: "Happy",
      ...userCreationParams,
    }
  }

  public async createBulk(userCreationParams: UserCreationParams): Promise<Result> {
    queue.push({namespace: "user", sql: "createBulk", params: userCreationParams});
    return {
      code: 0,
      description: "successful insert push"
    }
  }

  public async uploadFile(param: any, file : Express.Multer.File): Promise<void> {
    console.log(file)

    const params = {
      Bucket: 'your_bucket_name',
      Key:  `${param.user_id}/${file.originalname}`,
      Body: file.buffer,
      ACL: 'public-read',
    };

    param.filePath = "s3_path"
    console.log(param)

  }
}