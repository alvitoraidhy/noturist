import { isCelebrateError, errors, celebrate, Joi, Segments } from "celebrate";

import { validateToken } from "./token";
import { enforce } from "./enforcer";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ErrorHandler } from "next-connect";
import type { CelebrateError } from "celebrate";

const celebrateHandler = errors({ statusCode: 422 });

export const errorHandler: ErrorHandler<NextApiRequest, NextApiResponse> = (
  err: any | CelebrateError,
  req,
  res,
  next
) => {
  if (isCelebrateError(err)) {
    celebrateHandler(err, req, res, next);
  } else {
    console.error(err);
    res.status(500).end("Server-side error. Please try again later");
  }
};

export const authzHandler = (action: string) => {
  const celebrateMiddleware = celebrate({
    [Segments.HEADERS]: Joi.object({
      authorization: Joi.string().required(),
    }).unknown(),
  });

  const authzMiddleware = (req: any, res: any, next: any) => {
    const token = req.headers.authorization;

    let decoded;

    try {
      decoded = validateToken(token);
    } catch (err: any) {
      if (err.name) {
        switch (err.name) {
          case "TokenExpiredError":
            return res.status(401).end("token expired");

          case "JsonWebTokenError":
          case "NotBeforeError":
            return res.status(401).end("token invalid");
        }
      }

      return res.status(500).end("unknown error");
    }

    if (!enforce(decoded.type, action)) {
      return res.status(403).end("permission denied");
    }

    next();
  };

  return [celebrateMiddleware, authzMiddleware];
};
