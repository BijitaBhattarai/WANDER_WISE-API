import Trip from "../models/trips.js";
import NotFoundError from "../errors/not-found-error.js";

const createTrip = async (tripData) => {
  const trip = await Trip.create(tripData);
  return trip;
};

const getAllTrips = async () => {
  const trips = await Trip.find();
  return trips;
};

const getTripById = async (tripId) => {
  const trip = await Trip.findById(tripId);
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }
  return trip;
};

const updateTripById = async (tripId, tripData) => {
  const trip = await Trip.findByIdAndUpdate(
    tripId,
    {
      ...(tripData.title && { title: tripData.title }),
      ...(tripData.description && { description: tripData.description }),
      ...(tripData.startDate && { startDate: tripData.startDate }),
      ...(tripData.endDate && { endDate: tripData.endDate }),
      ...(tripData.destinations && { destinations: tripData.destinations }),
      ...(tripData.budget && { budget: tripData.budget }),
    },
    { new: true, runValidators: true }
  );

  if (!trip) {
    throw new NotFoundError("Trip not found");
  }

  return trip;
};

const deleteTripById = async (tripId) => {
  const trip = await Trip.findByIdAndDelete(tripId);
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }
  return { message: "Trip deleted successfully" };
};

export { createTrip, getAllTrips, getTripById, updateTripById, deleteTripById };
