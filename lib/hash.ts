import bcrypt from "bcryptjs";

const saltRounds = 10;

export const hashPassword = (password: string) =>
  bcrypt.hash(password, saltRounds);
export const compareHash = (password: string, hash: string) =>
  bcrypt.compare(password, hash);
