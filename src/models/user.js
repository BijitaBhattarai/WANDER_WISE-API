import { Schema, model } from "mongoose";
import { hash } from "bcrypt";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate: {
        validator: (email) => {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
        },
        message: "Invalid email address",
      },
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

UserSchema.pre("save", async function () {
  if (this.isModified("password")) {
    this.password = await hash(this.password, 10);
  }
});

UserSchema.pre("findOneAndUpdate", async function () {
  const update = this.getUpdate();
  const password =
    update?.password ?? (update?.$set ? update.$set.password : undefined);
  if (password) {
    const hashed = await hash(password, 10);
    if (update.password) {
      update.password = hashed;
    }
    if (update.$set && update.$set.password) {
      update.$set.password = hashed;
    }
  }
});
const User = model("User", UserSchema);
export default User;
