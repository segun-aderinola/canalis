import Validator from "validatorjs";
import { ErrorResponse } from "../utils/response.util";
import { ObjectLiteral } from "../types/object-literal.type";
import { Request, Response } from "express";

type Error = {
  field: string;
  message: string;
};

const validate = (rules: ObjectLiteral, validationMessages?: ObjectLiteral) => {
  return (request: Request, reply: Response, done) => {
    const source = { ...request.body, ...request.query, ...request.params};
    const validation = new Validator(source, rules, validationMessages);
    const errors = validation.errors.all();

    if (validation.fails()) {
      return reply.status(400).send(ErrorResponse("Your data is invalid", createValidationError(errors)));
    }

    done();
  };
};

export const createValidationError = (validationError: []) => {
  const errors: Error[] = [];

  for (const [key, value] of Object.entries(validationError)) {
    errors.push({
      field: key,
      message: value[0],
    });
  }

  return errors;
};

export default validate;
