import useValidator from "../middlewares/useValidator.js";
import { register, login } from "../services/auth.js";

import { Router } from "express";
import { loginValidator } from "../validators/auth.js";
import { CreateUserValidator } from "../validators/useValidator.js";

const AUTH_ROUTER = Router();
AUTH_ROUTER.post(
  "/register",
  useValidator(CreateUserValidator),
  async (req, res, next) => {
    try {
      const result = await register(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);
AUTH_ROUTER.post(
  "/login",
  useValidator(loginValidator),
  async (req, res, next) => {
    try {
      const result = await login(req.body);
      res.status(200).json(result);
    } catch (error) {
      next(error);
    }
  }
);

export default AUTH_ROUTER;
