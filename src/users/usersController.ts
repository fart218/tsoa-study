import {
  Body,
  Controller,
  FormField,
  Get,
  Path,
  Post,
  Query,
  Route,
  SuccessResponse,
  UploadedFile,
  Middlewares,
} from "tsoa"
import { User } from "./user"
import { UsersService, UserCreationParams } from "./usersService"
import { provideSingleton } from "../common/provideSingleton"
import { inject } from "inversify"
import reqCache from "../common/reqCache"
import Result from "../common/result"
import paging, { PagingResult } from "../common/paging"
  
@Route("users")
@provideSingleton(UsersController)
export class UsersController extends Controller {
  constructor(@inject(UsersService)private usersService: UsersService) {
    super()
  }

  /**
   * 유저정보 조회
   * - userId로 해당 정보 조회
   */
  @Get("{userId}")
  @Middlewares(reqCache)
  public async getUser(
    @Path() userId: number,
    @Query() name?: string
  ): Promise<User> {
    return this.usersService.get({id : userId, name : name ?? null})
  }

  /**
   * 유저정보 목록 조회
   * - page를 지정하여 해당 페이지 정보 취득
   */
  @Get()
  public async getList(
    @Query() page?: number,
    @Query() size?: number,
    @Query() keyword?: string
  ): Promise<PagingResult<User>> {
    return this.usersService.getList(paging(page, size), keyword ?? '');
  }

  /**
   * 유저등록
   */
  @SuccessResponse("201", "Created") // Custom success response
  @Post()
  public async createUser(
    @Body() requestBody: UserCreationParams
  ): Promise<User> {
    this.setStatus(201); // set return status 201
    return this.usersService.create(requestBody)
  }

  /**
   * 유저등록(queue)
   * - queue를 사용한 bulk 등록
   */
  @Post("createUserBulk")
  public async createUserBulk(
    @Body() requestBody: UserCreationParams
  ): Promise<Result> {
    return this.usersService.createBulk(requestBody)
  }

  /**
   * 파일업로드
   */
  @Post("uploadFile")
  public async uploadFile(
    @FormField() user_id: string,
    @FormField() title: string,
    @UploadedFile() file: Express.Multer.File,
    @FormField() description?: string
  ): Promise<void> {
    this.usersService.uploadFile({user_id : user_id, title : title, description : description ?? null}, file)
  }
}