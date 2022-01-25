import { celebrate, Joi, Segments } from "celebrate";
import nc from "next-connect";

import { authzHandler, errorHandler } from "../../../lib/handler";
import { validateToken } from "../../../lib/token";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc({
  onError: errorHandler,
});

type GetReqSchema = Omit<NextApiRequest, "headers"> & {
  headers: {
    authorization: string;
  };
};

type GetResSchema = NextApiResponse<
  {
    id: number;
    title: string;
    body: string;
  }[]
>;

handler.get(
  ...authzHandler("read:note:self"),
  async (req: GetReqSchema, res: GetResSchema) => {
    const { id } = validateToken(req.headers.authorization);

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        notes: true,
      },
    });

    if (!user) {
      return res.status(404).end("user not found");
    }

    const notes = user.notes.map((note) => ({
      id: note.id,
      title: note.title,
      body: note.body,
    }));

    return res.status(200).json(notes);
  }
);

const postJoiSchema = Joi.object({
  title: Joi.string().min(1).max(255),
  body: Joi.string(),
});

type PostReqSchema = Omit<NextApiRequest, "body" | "headers"> & {
  headers: {
    authorization: string;
  };
  body: {
    title: string;
    body: string;
  };
};

type PostResSchema = NextApiResponse<{
  id: number;
  title: string;
  body: string;
}>;

handler.post(
  ...authzHandler("create:note:self"),
  celebrate({ [Segments.BODY]: postJoiSchema }),
  async (req: PostReqSchema, res: PostResSchema) => {
    const { id } = validateToken(req.headers.authorization);

    const user = await prisma.user.findFirst({
      where: { id },
      include: {
        notes: true,
      },
    });

    if (!user) {
      return res.status(404).end("user not found");
    }

    const note = await prisma.note.create({
      data: {
        title: req.body.title,
        body: req.body.body,
        authorId: user.id,
      },
    });

    const response = { id: note.id, title: note.title, body: note.body };

    return res.status(200).json(response);
  }
);

export default handler;
