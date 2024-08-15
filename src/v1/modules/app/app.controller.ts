import { Request, Response } from "express";
import { injectable } from "tsyringe";
import AppService from "./app.service";

@injectable()
class AppController {
  constructor(private appService: AppService) {}

  getHello = async (req: Request, res: Response) => {
    res.send(this.appService.getHello());
  };
}

export default AppController;
