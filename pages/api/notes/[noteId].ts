import { celebrate, Joi, Segments } from "celebrate";
import nc from "next-connect";

import { authzHandler, errorHandler } from "../../../lib/handler";
import { validateToken } from "../../../lib/token";
import prisma from "../../../lib/prisma";

import type { NextApiRequest, NextApiResponse } from "next";

const handler = nc({
  onError: errorHandler,
});

const queryJoiSchema = Joi.object({
  noteId: Joi.number().required()
});

type GetReqSchema = Omit<NextApiRequest, "headers" | "query"> & {
  headers: {
    authorization: string;
  };
  query: {
    noteId: number;
  };
};

type GetResSchema = NextApiResponse<{
  title: string;
  body: string;
}>;

handler.get(
  ...authzHandler("read:note:self"),
  celebrate({ 
    [Segments.QUERY]: queryJoiSchema,
  }),
  async (req: GetReqSchema, res: GetResSchema) => {
    const { id: userId } = validateToken(req.headers.authorization!);
    const { noteId } = req.query;

    const note = await prisma.note.findFirst({
      where: { id: Number(noteId), authorId: userId },
    });

    if (!note) {
      return res.status(404).end("note not found or inaccessible");
    }

    const response = { title: note.title, body: note.body };

    return res.status(200).json(response);
  }
);

const putJoiSchema = Joi.object({
  title: Joi.string().min(1).max(255).optional(),
  body: Joi.string().optional(),
});

type PutReqSchema = Omit<NextApiRequest, "headers" | "query" | "body"> & {
  headers: {
    authorization: string;
  };
  query: {
    noteId: number;
  };
  body: {
    title: string | undefined;
    body: string | undefined;
  };
};

type PutResSchema = NextApiResponse<{
  title: string;
  body: string;
}>;

handler.put(
  ...authzHandler("update:note:self"),
  celebrate({ 
    [Segments.QUERY]: queryJoiSchema,
    [Segments.BODY]: putJoiSchema,
  }),
  async (req: PutReqSchema, res: PutResSchema) => {
    const { id: userId } = validateToken(req.headers.authorization!);
    const { noteId } = req.query;

    const note = await prisma.note.findFirst({
      where: { id: Number(noteId), authorId: userId },
    });

    if (!note) {
      return res.status(404).end("note not found or inaccessible");
    }

    await prisma.note.update({
      where: { id: note.id },
      data: {
        title: req.body.title,
        body: req.body.body,
      },
    });

    const response = {
      title: req.body.title || note.title,
      body: req.body.body || note.body,
    };

    return res.status(200).json(response);
  }
);

type DeleteReqSchema = Omit<NextApiRequest, "headers" | "query"> & {
  headers: {
    authorization: string;
  };
  query: {
    noteId: number;
  };
};

type DeleteResSchema = NextApiResponse;

handler.delete(
  ...authzHandler("delete:note:self"),
  celebrate({ 
    [Segments.QUERY]: queryJoiSchema,
  }),
  async (req: DeleteReqSchema, res: DeleteResSchema) => {
    const { id: userId } = validateToken(req.headers.authorization!);
    const { noteId } = req.query;

    const note = await prisma.note.findFirst({
      where: { id: Number(noteId), authorId: userId },
    });

    if (!note) {
      return res.status(404).end("note not found or inaccessible");
    }

    await prisma.note.delete({
      where: { id: note.id },
    });

    return res.status(204).end();
  }
);

export default handler;
