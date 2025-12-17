import { body } from "express-validator";

export const CreateBaggageValidator = [
  body("name").notEmpty().withMessage("Name is required").trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
];
export const UpdateBaggageValidator = [
  body("name").optional().notEmpty().withMessage("Name is required").trim(),
  body("completed")
    .optional()
    .isBoolean()
    .withMessage("Completed must be a boolean"),
];
