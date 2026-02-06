import Trip from "../models/trips.js";
import NotFoundError from "../errors/not-found-error.js";
import ConflictError from "../errors/conflict-error.js";
import sendMail from "../utils/send-mail.js";
import jwt from "jsonwebtoken";

const createTrip = async (tripData) => {
  const trip = await Trip.create(tripData);
  return trip;
};

const getAllTrips = async (userId) => {
  const trips = await Trip.find({
    $or: [{ user: userId }, { collaborators: userId }],
  });
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
    { new: true, runValidators: true },
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
      collaboratorEmails.includes(collaborator.email),
    )
  ) {
    throw new ConflictError("Collaborator already invited");
  }
  const token = jwt.sign({ tripId: id }, process.env.JWT_sECRET_KEY, {
    expiresIn: "1h",
  });
  const invitationLink = `${process.env.BASE_URL}/trips/${id}/invite/accept?token=${token}`;

  await sendMail(collaboratorEmails.join(","), "Invitation to join a trip", {
    link: invitationLink,
    title: trip.title,
    startDate: trip.startDate.toDateString(),
    endDate: trip.endDate.toDateString(),
    name: trip.user.name,
  });
  return { message: "Collaborators invited successfully" };
};
export const acceptInvitation = async (token, userId) => {
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  const trip = await Trip.findOne({ _id: decoded.tripId }).populate(
    "collaborators",
  );
  if (!trip) {
    throw new NotFoundError("Trip not found");
  }
  if (
    trip.collaborators.some(
      (collaborator) => collaborator._id.toString() === userId.toString(),
    )
  ) {
    throw new ConflictError("User already a collaborator");
  }
  trip.collaborators.push(userId);
  await trip.save();
  return { success: true, message: "Invitation accepted successfully" };
};

const addExpenses = async (userId, tripId, expenseData) => {
  const trip = await Trip.findOne({
    _id: tripId,
    $or: [{ user: userId }, { collaborators: userId }],
  });

  if (!trip) {
    throw new Error("Trip not found");
  }

  const date = new Date();
  trip.budget.expenses.push({
    ...expenseData,
    date,
  });

  trip.budget.spent += expenseData.amount || 0;
  await trip.save();

  return { message: ` Expense: ${expenseData.name} added successfully` };
};
export {
  createTrip,
  getAllTrips,
  getTripById,
  updateTripById,
  deleteTripById,
  inviteCollaborator,
  addExpenses,
};
