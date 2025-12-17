import Router from "express";
import {
  createBaggage,
  getAllBaggages,
  getBaggageById,
  updateBaggageById,
  deleteBaggageById,
} from "../services/baggage.js";

import {
  CreateBaggageValidator,
  UpdateBaggageValidator,
} from "../validators/baggageValidator.js";
import useValidator from "../middlewares/useValidator.js";

const BAGGAGE_ROUTER = Router();

BAGGAGE_ROUTER.post(
  "/",
  useValidator(CreateBaggageValidator),
  async (req, res, next) => {
    try {
      const baggage = await createBaggage({
        ...req.body,
        user: req.user.userId,
        trip: req.params.tripId,
      });
      res.status(201).json(baggage);
    } catch (error) {
      next(error);
    }
  }
);

BAGGAGE_ROUTER.get("/", async (req, res, next) => {
  try {
    const trips = await getAllBaggages(req.user.userId, req.params.tripId);
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
});

BAGGAGE_ROUTER.get("/:id", async (req, res, next) => {
  try {
    const trip = await getBaggageById(
      req.params.id,
      req.user.userId,
      req.params.tripId
    );
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});

BAGGAGE_ROUTER.patch(
  "/:id",
  useValidator(UpdateBaggageValidator),
  async (req, res, next) => {
    try {
      const trip = await updateBaggageById(
        req.params.id,
        req.body,
        req.user.userId,
        req.params.tripId
      );
      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  }
);

BAGGAGE_ROUTER.delete("/:id", async (req, res, next) => {
  try {
    const trip = await deleteBaggageById(
      req.params.id,
      req.user.userId,
      req.params.tripId
    );
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});

export default BAGGAGE_ROUTER;
