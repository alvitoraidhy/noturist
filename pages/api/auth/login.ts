import { celebrate, Joi, Segments } from "celebrate";
import nc from "next-connect";

import { errorHandler } from "../../../lib/handler";
import { generateToken } from "../../../lib/token";
import { compareHash } from "../../../lib/hash";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc({
  onError: errorHandler,
});

const postJoiSchema = Joi.object({
  username: Joi.string(),
  password: Joi.string(),
});

type PostReqSchema = Omit<NextApiRequest, "body"> & {
  body: {
    username: string;
    password: string;
  };
};

type PostResSchema = NextApiResponse<{
  token: string;
}>;

handler.post(
  celebrate({ [Segments.BODY]: postJoiSchema }),
  async (req: PostReqSchema, res: PostResSchema) => {
    const user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });

    if (!user || !(await compareHash(req.body.password, user.password))) {
      return res.status(400).end("wrong email or password");
    }

    const token = generateToken({ id: user.id, type: "user" }, "1 day");

    return res.status(200).json({ token });
  }
);

export default handler;
