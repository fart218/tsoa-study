import { RowDataPacket } from 'mysql2'
import { User } from './user'

export interface UserModel extends User, RowDataPacket {
}