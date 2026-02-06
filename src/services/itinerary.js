import ValidationError from "../errors/validation-error.js";
import Itinerary from "../models/itinerary.js";
import NotFoundError from "../errors/not-found-error.js";
import { getTripById } from "./trip.js";

export const createItinerary = async (itineraryData) => {
  const trip = await getTripById(itineraryData.trip, itineraryData.user);
  if (
    new Date(itineraryData.date) < new Date(trip.startDate) ||
    new Date(itineraryData.date) > new Date(trip.endDate)
  ) {
    throw new ValidationError("Itinerary date must be within the trip dates");
  }
  const itinerary = await Itinerary.create(itineraryData);
  return itinerary;
};

export const getAllItineraries = async (userId, tripId) => {
  await getTripById(tripId, userId);
  const itinerary = await Itinerary.find();
  if (!itinerary) {
    throw new NotFoundError("Itinerary now found");
  }
  return itinerary;
};

export const getItinerariesById = async (id, userId, tripId) => {
  await getTripById(tripId, userId);
  const itinerary = await Itinerary.findById(id);
  if (!itinerary) {
    throw new NotFoundError("Itinerary now found");
  }
  return itinerary;
};
export const updateItineraryById = async (
  id,
  userId,
  tripId,
  itineraryData,
) => {
  const trip = await getTripById(tripId, userId);

  if (
    new Date(itineraryData.date) < new Date(trip.startDate) ||
    new Date(itineraryData.date) > new Date(trip.endDate)
  ) {
    throw new ValidationError("Itinerary date must be within the trip date");
  }
  const itinerary = await Itinerary.findOneAndUpdate(
    {
      _id: id,
      trip: tripId,
    },
    itineraryData,
    {
      new: true,
    },
  );

  if (!itinerary) {
    throw new NotFoundError("Itinerary not found");
  }

  return itinerary;
};
export const deleteItineraryById = async (id, tripId, userId) => {
  await getTripById(tripId, userId);
  const itinerary = await itinerary.findOneAndDelete({
    _id: id,
    trip: tripId,
  });
  if (!itinerary) {
    throw new NotFoundError("Trip not found");
  }
  return { message: "Itinerary deleted successfully" };
};
