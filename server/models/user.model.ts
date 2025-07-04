import mongoose from "mongoose";

import { genSalt, hash, compare} from "bcrypt";
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    validate: {
      validator: (v: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(v);
      },
      message: (props: { value: string }) => `${props.value} is not a valid email!`,
    },
    unique: true,
    trim: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"],
   
  },
  firstName: {
    type: String,
    required: false,
    trim: true,
  },
  lastName: {
    type: String,
    required: false,
    trim: true,
  },
  image: {
    type: String,
    required: false,
    default: "https://www.gravatar.com/avatar/placeholder",
  },
  color: {
    type: Number,
    required: false,
    default: 0x000000,
  },
  profileSetup: {
    type: Boolean,
    default: false,
  }

});

userSchema.pre("save", async function hashPassword(next) {
try {
    const salt = await genSalt(10);
    this.password = await hash(this.password, salt);
    next();
} catch (error) {
    console.error(" ❌ Error hashing password:", error);
    next(error);
}
});


const User = mongoose.model("User", userSchema);

export default User;