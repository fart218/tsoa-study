import { createPool } from "generic-pool"
import mysql, { Connection, ProcedureCallPacket, ResultSetHeader, RowDataPacket } from "mysql2/promise"

const db_env_read = {
  host: process.env.MYSQL_READ_HOST,
  port: +process.env.MYSQL_READ_PORT!,
  user: process.env.MYSQL_READ_USER,
  password: process.env.MYSQL_READ_PASSWORD,
  database: process.env.MYSQL_READ_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
}

const readFactory = {
  create: () => mysql.createConnection(db_env_read),
  destroy: (connection: Connection) => connection.end()
}

const readOpts = {
  max: 10, // maximum size of the pool
  min: 2 // minimum size of the pool
}

const db_env_write = {
  host: process.env.MYSQL_WRITE_HOST,
  port: +process.env.MYSQL_WRITE_PORT!,
  user: process.env.MYSQL_WRITE_USER,
  password: process.env.MYSQL_WRITE_PASSWORD,
  database: process.env.MYSQL_WRITE_DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  multipleStatements: true,
}

const writeFactory = {
  create: () => mysql.createConnection(db_env_write),
  destroy: (connection: Connection) => connection.end()
}

const writeOpts = {
  max: 10, // maximum size of the pool
  min: 2 // minimum size of the pool
}

export const readPool = createPool(readFactory, readOpts)

export async function read<T extends RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ProcedureCallPacket>(query: string, param?: any) {
  const client = await readPool.acquire()
  const result = await client.query<T>(query, param)
  await readPool.release(client)
  return result
}

export const writePool = createPool(writeFactory, writeOpts)

export async function write<T extends RowDataPacket[] | ResultSetHeader[] | RowDataPacket[][] | ProcedureCallPacket>(query: string, param?: any) {
  const client = await writePool.acquire()
  const result = await client.query<T>(query, param)
  await writePool.release(client)
  return result
}