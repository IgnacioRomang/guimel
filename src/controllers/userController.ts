import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Http } from "../utils/http";
import { UserToSave } from "../interface/user";
import Hash from "../utils/hash";
import db, { Database } from "../databases";
import logger from "../utils/logger";

class UserController {
  private static instance: UserController;

  private constructor() {}

  public static getInstance(): UserController {
    if (!UserController.instance) {
      UserController.instance = new UserController();
    }
    return UserController.instance;
  }

  // TODO: CAMBIAR BIEN LOS METODOS
  public async addUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      logger.error("Error", errors.array());
      res.status(Http.code.BAD_REQUEST).json({ errors: errors.array() });
      return;
    }
    const { name, email, password } = req.body;
    let userToSave: UserToSave = {
      name: name,
      password: await Hash.make(password),
    };
    let result = await db?.saveUser(userToSave);
    if (result?.message == Database.code.SUCCESS) {
      let user = result.user;
      logger.info("A user was added with id:", user?.ID);
      res.status(Http.code.CREATED).json({
        user: user,
      });
    } else {
      if (result?.message == Database.code.FAILED) {
        logger.error("Failed to add the user");
        res.status(Http.code.INTERNAL_SERVER_ERROR).json({
          message:
            "An unexpected error occurred while processing your request. Please try again later.",
        });
      } else {
        logger.error("Failed to add the user");
        res.status(Http.code.BAD_GATEWAY).json({
          message:
            "The user could not be added. Please check the input data and ensure all fields are correct.",
        });
      }
    }
    return;
  }

  public async getUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(Http.code.BAD_REQUEST).json({ errors: errors.array() });
      return;
    }
    const { userId } = req.body;
    let response = await db?.getUser(userId);
    if (response?.message == Database.code.SUCCESS) {
      let user = response.user;
      logger.info("User found with id", user?.ID);
      res.status(Http.code.SUCCESS).json({ user: user });
    } else {
      if (response?.message == Database.code.NOT_FOUND) {
        logger.info("User not found with id", userId);
        res.status(Http.code.NOT_FOUND).json({
          message: "User not found. Please check the user ID and try again.",
        });
      } else {
        logger.error("An error occurred while processing the request.");
        res.status(Http.code.INTERNAL_SERVER_ERROR).json({
          message:
            "An unexpected error occurred while processing your request. Please try again later.",
        });
      }
    }
    return;
  }

  public async removeUser(req: Request, res: Response): Promise<void> {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(Http.code.BAD_REQUEST).json({ errors: errors.array() });
      return;
    }
    const { userId } = req.body;
    let response = await db?.deleteUser(userId);
    if (response?.message == Database.code.SUCCESS) {
      logger.info("User removed with id", userId);
      res
        .status(Http.code.SUCCESS)
        .json({ messaage: "User successfully deleted." });
    } else {
      logger.error("An error occurred while processing the request.");
      res.status(Http.code.INTERNAL_SERVER_ERROR).json({
        message:
          "An unexpected error occurred while processing your request. Please try again later.",
      });
    }
    return;
  }
}

export default UserController;
