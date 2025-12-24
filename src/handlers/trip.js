import Router from "express";
import {
  createTrip,
  getAllTrips,
  getTripById,
  updateTripById,
  deleteTripById,
  inviteCollaborator,
} from "../services/trip.js";
import {
  CreateTripValidator,
  UpdateTripValidator,
} from "../validators/tripValidator.js";
import useValidator from "../middlewares/useValidator.js";

const TRIP_ROUTER = Router();

TRIP_ROUTER.post(
  "/",
  useValidator(CreateTripValidator),
  async (req, res, next) => {
    try {
      const trip = await createTrip({ ...req.body, user: req.user.userId });
      res.status(201).json(trip);
    } catch (error) {
      next(error);
    }
  }
);

TRIP_ROUTER.get("/", async (req, res, next) => {
  try {
    const trips = await getAllTrips();
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
});

TRIP_ROUTER.get("/:id", async (req, res, next) => {
  try {
    const trip = await getTripById(req.params.id);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});

TRIP_ROUTER.patch(
  "/:id",
  useValidator(UpdateTripValidator),
  async (req, res, next) => {
    try {
      const trip = await updateTripById(req.params.id, req.body);
      res.status(200).json(trip);
    } catch (error) {
      next(error);
    }
  }
);

TRIP_ROUTER.delete("/:id", async (req, res, next) => {
  try {
    const trip = await deleteTripById(req.params.id);
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});
TRIP_ROUTER.post("/:id/invite", async (req, res, next) => {
  try {
    const result = await inviteCollaborator(
      req.params.id,
      req.user.userId,
      req.body.collaboratorEmails
    );

    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});

export default TRIP_ROUTER;
