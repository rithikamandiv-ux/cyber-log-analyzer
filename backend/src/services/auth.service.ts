import pool from "../config/db";

// TODO (Intentionally deferred - Feature Complete): Implement user registration
export const registerUser = async (
  username: string,
  email: string,
  passwordHash: string
) => {
  const result = await pool.query(
    "INSERT INTO users (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id, username, email, role, created_at",
    [username, email, passwordHash]
  );
  return result.rows[0];
};

// TODO (Intentionally deferred - Feature Complete): Implement user lookup by email
export const findUserByEmail = async (email: string) => {
  const result = await pool.query("SELECT * FROM users WHERE email = $1", [
    email,
  ]);
  return result.rows[0] || null;
};

export const findUserByUsername = async (username: string) => {
  const result = await pool.query("SELECT * FROM users WHERE username = $1", [
    username,
  ]);
  return result.rows[0] || null;
};
