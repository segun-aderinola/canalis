import httpStatus from "http-status";
import jwt from "jsonwebtoken";
import { ErrorResponse } from "@shared/utils/response.util";
import { Request, Response } from "express";
import UserRepository from "../../v1/modules/userManagement/repositories/user.repository";

const agentAuthMiddleware = async (req: Request, res: Response, done) => {
  try {
    const authToken = getAuthTokenFromRequestHeader(req);
    if (!authToken) {
      throw new Error();
    }

    const payload = jwt.decode(authToken);
    const userRepository = new UserRepository;
    const user = await userRepository.findById(payload.userId);
    if(user.roleId != "agent"){
      return res.status(httpStatus.UNAUTHORIZED).send(ErrorResponse("You are unauthorized"));
    }
    (req as any).user = payload;

    done();
  } catch (err) {
    return res.status(httpStatus.UNAUTHORIZED).send(ErrorResponse("You are unauthorized"));
  }
};

const getAuthTokenFromRequestHeader = (req: Request): string | null => {
  const authTokenSegments = (req.headers.authorization || "").split(" ");

  return authTokenSegments.length === 2 ? authTokenSegments[1] : null;
};

export default agentAuthMiddleware;
