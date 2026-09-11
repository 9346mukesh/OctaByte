import type {
  ErrorRequestHandler,
} from "express";

import { AppError } from "../utils/appError.js";

export const errorHandler: ErrorRequestHandler = (
  error,
  _request,
  response,
  next,
) => {
  void next;

  console.error(
    "Unhandled application error:",
    error,
  );

  if (error instanceof AppError) {
    response.status(error.statusCode).json({
      success: false,
      error: {
        message: error.message,
      },
    });

    return;
  }

  response.status(500).json({
    success: false,
    error: {
      message: "Internal server error",
    },
  });
};