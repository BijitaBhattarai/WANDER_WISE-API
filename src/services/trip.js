import Trip from "../models/trips.js";
import NotFoundError from "../errors/not-found-error.js";
import ConflictError from "../errors/conflict-error.js";
import sendMail from "../utils/send-mail.js";
import jwt from "jsonwebtoken";

const createTrip = async (tripData) => {
  const trip = await Trip.create(tripData);
  return trip;
};

const getAllTrips = async () => {
  const trips = await Trip.find();
  return trips;
};

const getTripById = async (tripId) => {
  const trip = await Trip.findById(tripId)
    .populate("collaborators")
    .populate("user", "name");
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
const inviteCollaborator = async (id, userId, collaboratorEmails) => {
  const trip = await getTripById(id, userId);
  if (
    trip.collaborators?.some((collaborator) =>
      collaboratorEmails.includes(collaborator.email)
    )
  ) {
    throw new ConflictError("Collaborator already invited");
  }
  const token = jwt.sign({ tripId: id }, process.env.JWT_sECRET_KEY, {
    expiresIn: "1h",
  });
  const invitationLink = `${process.env.BASE_URL}/trips/${id}/invite/accept?token=${token}`;

  await sendMail(collaboratorEmails.join(","), "Invitation to join a trip", {
    link: `http://localhost:3000/trips/${id}`,
    title: trip.title,
    startDate: trip.startDate,
    endDate: trip.endDate,
    name: trip.user.name,
  });
  return { message: "Collaborators invited successfully" };
};

export {
  createTrip,
  getAllTrips,
  getTripById,
  updateTripById,
  deleteTripById,
  inviteCollaborator,
};
