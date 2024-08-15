import express from "express";
import cors from "cors";
import AppError from "@shared/error/app.error";
import Logger from "@shared/utils/logger";
// import loggerPlugin from "@shared/utils/logger/plugin";
import { ErrorResponse } from "@shared/utils/response.util";
import initializeDatabase from "./database";
// import multer from "multer";
import Validator from "validatorjs";
import "./shared/subscribers/audit-log.subscriber";

function bootstrapApp(express: express.Application) {
  registerThirdPartyModules(express);

  initializeDatabase();

  registerCustomValidationRules();

  setErrorHandler(express);

  registerFileHandler(express);
}

function registerThirdPartyModules(express: express.Application) {
  express.use(cors({ origin: true }));

  // Assuming loggerPlugin is an express middleware
  // loggerPlugin(express);
}

function registerCustomValidationRules() {
  // initialize custom validations for validatorjs
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  Validator.register(
    "password",
    (value: string) => {
      return /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@#$%^&+=!])(?!.*\s).{8,}$/.test(value);
    },
    "The :attribute field must be at least 8 characters and must contain at least one uppercase, one lowercase, one digit, and one special character"
  );

  Validator.register(
    "name",
    (value) => {
      return /^[a-zA-Z-]{2,50}$/.test(value);
    },
    "The :attribute field is not valid"
  );

  Validator.register(
    "cleanString",
    (value) => {
      return /^[a-zA-Z0-9_ -]{1,100}$/.test(value);
    },
    "The :attribute field is not valid. Please ensure it doesn't contain special characters and not more than 100 characters"
  );

  Validator.register(
    "username",
    (value) => {
      return /^[a-zA-Z-][a-zA-Z0-9_-]{1,20}$/.test(value);
    },
    "The :attribute field is not valid"
  );

  Validator.register(
    "uuid",
    (value) => {
      return uuidRegex.test(value);
    },
    ":attribute is not a valid UUID"
  );

  Validator.register(
    "phone",
    (value: any) => {
      return value.match(/^(?:(?:(?:\+?234(?:\h1)?|01)\h*)?(?:\(\d{3}\)|\d{3})|\d{4})(?:\W*\d{3})?\W*\d{4}$/);
    },
    "The :attribute field is not in the correct format. Example of allowed format is 2348888888888."
  );

  Validator.register(
    "amount",
    (value: any) => {
      return !Number.isSafeInteger(value);
    },
    "The :attribute field is invalid"
  );
}

function registerFileHandler(express: express.Application) {
  // express.use(multer.contentParser);
}

function setErrorHandler(express: express.Application) {
  express.use((err, req, res, next) => {
    const statusCode = err.statusCode || 503;
    const message = err instanceof AppError ? err.message : "We are unable to process this request. Please try again.";

    Logger.error({ err: err.cause || err });

    res.status(statusCode).json(ErrorResponse(message));
  });
}

export default bootstrapApp;
