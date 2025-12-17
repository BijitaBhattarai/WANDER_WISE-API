import Baggage from "../models/baggage.js";
import NotFoundError from "../errors/not-found-error.js";
import { getTripById } from "./trip.js";

const createBaggage = async (BaggageData) => {
  await getTripById(BaggageData.trip, BaggageData.user);
  const baggage = await Baggage.create(BaggageData);
  return baggage;
};

const getAllBaggages = async (tripId, userId) => {
  const baggages = await Baggage.find({ trip: tripId, user: userId });
  return baggages;
};

const getBaggageById = async (id, userId, tripId) => {
  const baggage = await Baggage.findOne({
    _id: id,
    trip: tripId,
    user: userId,
  });
  if (!baggage) {
    throw new NotFoundError("Baggage not found");
  }
  return baggage;
};

const updateBaggageById = async (id, userId, tripId, BaggageData) => {
  await getTripById(tripId, userId);
  const baggage = await baggage.findOneAndUpdate(
    {
      _id: id,
      trip: tripId,
      user: userId,
    },
    BaggageData,
    {
      new: true,
    }
  );

  if (!baggage) {
    throw new NotFoundError("Baggage not found");
  }

  return baggage;
};

const deleteBaggageById = async (id, tripId, userId) => {
  await getTripById(tripId, userId);
  const baggage = await Trip.findOneAndDelete({
    _id: id,
    trip: tripId,
    user: userId,
  });
  if (!baggage) {
    throw new NotFoundError("Trip not found");
  }
  return { message: "Baggage deleted successfully" };
};
export {
  createBaggage,
  getAllBaggages,
  getBaggageById,
  updateBaggageById,
  deleteBaggageById,
};
