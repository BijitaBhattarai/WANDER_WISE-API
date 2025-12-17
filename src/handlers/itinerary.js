import { Router } from "express";
import {
  createItinerary,
  getAllItineraries,
  getItinerariesById,
  updateItineraryById,
  deleteItineraryById,
} from "../services/itinerary";

const ITINERARY_ROUTER = Router();

ITINERARY_ROUTER.post(
  "/",
  useValidator(CreateItineraryValidator),
  async (req, res, next) => {
    try {
      const baggage = await createItinerary({
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

ITINERARY_ROUTER.get("/", async (req, res, next) => {
  try {
    const trips = await getAllItineraries(req.user.userId, req.params.tripId);
    res.status(200).json(trips);
  } catch (error) {
    next(error);
  }
});

ITINERARY_ROUTER.get("/:id", async (req, res, next) => {
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

ITINERARY_ROUTER.patch(
  "/:id",
  useValidator(UpdateItineraryValidator),
  async (req, res, next) => {
    try {
      const trip = await updateItineraryById(
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

ITINERARY_ROUTER.delete("/:id", async (req, res, next) => {
  try {
    const trip = await deleteItineraryById(
      req.params.id,
      req.user.userId,
      req.params.tripId
    );
    res.status(200).json(trip);
  } catch (error) {
    next(error);
  }
});

export default ITINERARY_ROUTER;
