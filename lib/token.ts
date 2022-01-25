import jwt from "jsonwebtoken";

const secret = process.env.SECRET_KEY as string;

export type Payload = {
  id: number;
  type: string;
};

export const generateToken = (payload: Payload, expires: string | number) => {
  const token = jwt.sign(payload, secret, { expiresIn: expires });

  return token;
};

export const validateToken = (token: string) => {
  const verified = jwt.verify(token, secret) as Payload;

  return verified;
};
