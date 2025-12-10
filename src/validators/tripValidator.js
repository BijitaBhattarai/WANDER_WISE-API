import { body } from "express-validator";

export const CreateTripValidator = [
  body("title").notEmpty().withMessage("Title is required"),
  body("description").optional(),
  body("startDate")
    .notEmpty()
    .withMessage("Start date is required")
    .isISO8601()
    .toDate()
    .withMessage("Start date must be a valid date"),
  body("endDate")
    .notEmpty()
    .withMessage("End date is required")
    .isISO8601()
    .toDate()
    .withMessage("End date must be a valid date"),
  body("destinations")
    .isArray({ min: 1 })
    .withMessage("At least one destination is required"),
  body("destinations.*")
    .notEmpty()
    .withMessage("Destination cannot be empty")
    .isString()
    .withMessage("Destination must be a string"),
  body("budget").optional().isObject().withMessage("Budget must be an object"),
  body("budget.total")
    .optional()
    .isNumeric()
    .withMessage("Budget total must be a number"),
  body("budget.spent")
    .optional()
    .isNumeric()
    .withMessage("Budget spent must be a number"),
  body("budget.expenses")
    .optional()
    .isArray()
    .withMessage("Expenses must be an array"),
  body("budget.expenses.*.name")
    .optional()
    .notEmpty()
    .withMessage("Expense name is required"),
  body("budget.expenses.*.amount")
    .optional()
    .isNumeric()
    .withMessage("Expense amount must be a number"),
  body("budget.expenses.*.date")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("Expense date must be a valid date"),
];

export const UpdateTripValidator = [
  body("title").optional().notEmpty().withMessage("Title cannot be empty"),
  body("description").optional(),
  body("startDate").optional().isISO8601().toDate(),
  body("endDate").optional().isISO8601().toDate(),
  body("destinations").optional().isArray(),
  body("destinations.*").optional().isString(),
  body("budget").optional().isObject(),
  body("budget.total").optional().isNumeric(),
  body("budget.spent").optional().isNumeric(),
  body("budget.expenses").optional().isArray(),
  body("budget.expenses.*.name").optional().notEmpty(),
  body("budget.expenses.*.amount").optional().isNumeric(),
  body("budget.expenses.*.date").optional().isISO8601().toDate(),
];
