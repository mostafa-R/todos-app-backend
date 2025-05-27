import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    lastName: {
      type: String,
      required: true,
      minlength: 3,
      maxlength: 20,
      validate: {
        validator: function (v) {
          return /^[a-zA-Z]+$/.test(v);
        },
        message: (props) => `${props.value} is not a valid name!`,
      },
    },
    userName: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
    },
    role: {
      type: String,
      enum: ["admin", "user", "reporter"],
      default: "user",
    },
    dob: {
      type: Date,
    },
  },
  {
    toJSON: {
      transform: (doc, ret, options) => {
        delete ret.password;
        delete ret.__v;
        return ret;
      },
    },
  }
);

// userSchema.pre("save", function (next) {
//   if (!this.userName) {
//     this.userName = `${this.firstName} ${this.lastName}`;
//   }
//   next();
// });
export default mongoose.model("User", userSchema);
