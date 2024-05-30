import { Pool } from "generic-pool"
import { Connection } from "mysql2/promise"

async function transaction(pool: Pool<Connection>, callback: Function) {
  const connection = await pool.acquire()
  await connection.beginTransaction()

  try {
    await callback(connection)
    await connection.commit()
  } catch (err) {
    await connection.rollback()
    // Throw the error again so others can catch it.
    throw err
  } finally {
    await pool.release(connection)
  }
}

export default transaction