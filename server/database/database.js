import { createPool } from "mysql2/promise";

const pool = createPool({
  host: "localhost",
  user: "root",
  port: "3306",
  password: "nacional1111",
  database: "app-jwt",
});

export async function query(sql) {
  try {
    const result = await pool.query(sql);
    return result;
  } catch (err) {
    console.error('Error executing query: ', err);
    return err.message;
  }
}
 