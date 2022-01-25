import { celebrate, Joi, Segments } from "celebrate";
import nc from "next-connect";

import type { NextApiRequest, NextApiResponse } from "next";

import { authzHandler, errorHandler } from "../../../lib/handler";
import { validateToken } from "../../../lib/token";
import prisma from "../../../lib/prisma";

const handler = nc({
  onError: errorHandler,
});

type GetReqSchema = NextApiRequest;

type GetResSchema = NextApiResponse<{
  username: string;
}>;

handler.get(
  ...authzHandler("read:user:self"),
  async (req: GetReqSchema, res: GetResSchema) => {
    const { id } = validateToken(req.headers.authorization!);

    const user = await prisma.user.findFirst({
      where: { id },
    });

    if (!user) {
      return res.status(404).end("user not found");
    }

    return res.status(200).json({ username: user.username });
  }
);

export default handler;
