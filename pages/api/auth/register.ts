import { celebrate, Joi, Segments } from "celebrate";
import nc from "next-connect";

import { errorHandler } from "../../../lib/handler";
import { generateToken } from "../../../lib/token";
import { hashPassword } from "../../../lib/hash";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc({
  onError: errorHandler,
});

const postJoiSchema = Joi.object({
  username: Joi.string()
    .min(1)
    .max(16)
    .regex(/^[a-z]*$/),
  password: Joi.string().min(1).max(16),
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
    let user = await prisma.user.findFirst({
      where: { username: req.body.username },
    });

    if (user) {
      return res
        .status(409)
        .end("a user with the same username already exists");
    }

    user = await prisma.user.create({
      data: {
        username: req.body.username,
        password: await hashPassword(req.body.password),
      },
    });

    const token = generateToken(
      {
        id: user.id,
        type: "user",
      },
      "1 day"
    );

    return res.status(200).json({ token });
  }
);

export default handler;
