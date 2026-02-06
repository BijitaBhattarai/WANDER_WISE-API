import { Router } from "express";
import {
  createItinerary,
  getAllItineraries,
  getItinerariesById,
  updateItineraryById,
  deleteItineraryById,
} from "../services/itinerary.js";
import {
  createItineraryValidator,
  updateItineraryValidator,
} from "../validators/itineraryValidator.js";
import useValidator from "../middlewares/useValidator.js";

const ITINERARY_ROUTER = Router({ mergeParams: true });

ITINERARY_ROUTER.post(
  "/",
  useValidator(createItineraryValidator),
  async (req, res, next) => {
    try {
      const itinerary = await createItinerary({
        ...req.body,
        user: req.user.userId,
        trip: req.params.tripId,
      });
      res.status(201).json(itinerary);
    } catch (error) {
      next(error);
    }
  },
);

ITINERARY_ROUTER.get("/", async (req, res, next) => {
  try {
    const itineraries = await getAllItineraries(
      req.user.userId,
      req.params.tripId,
    );
    res.status(200).json(itineraries);
  } catch (error) {
    next(error);
  }
});

ITINERARY_ROUTER.get("/:id", async (req, res, next) => {
  try {
    const itinerary = await getItinerariesById(
      req.params.id,
      req.user.userId,
      req.params.tripId,
    );
    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
});

ITINERARY_ROUTER.patch(
  "/:id",
  useValidator(updateItineraryValidator),
  async (req, res, next) => {
    try {
      const itinerary = await updateItineraryById(
        req.params.id,

        req.user.userId,
        req.params.tripId,
        req.body,
      );
      res.status(200).json(itinerary);
    } catch (error) {
      next(error);
    }
  },
);

ITINERARY_ROUTER.delete("/:id", async (req, res, next) => {
  try {
    const itinerary = await deleteItineraryById(
      req.params.id,
      req.user.userId,
      req.params.tripId,
    );
    res.status(200).json(itinerary);
  } catch (error) {
    next(error);
  }
});

export default ITINERARY_ROUTER;
