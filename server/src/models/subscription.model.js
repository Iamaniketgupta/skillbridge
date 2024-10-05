import mongoose, { Mongoose, Schema } from "mongoose";


const subscriptionSchema = new mongoose.Schema(
    {
        mentor: {
            type: mongoose.Types.ObjectId,
            ref: "Mentor",
            required: true,
        },
        mentee: {
            type: mongoose.Types.ObjectId,
            ref: "Mentee",
            required: true,
        },

        price: {
            type: String,
            required: true
        },
      session: {
          type: String,
          required: true
      },
      status: {
          type: String,
          
      }

    },
    { timestamps: true }
);




export const Subscription = mongoose.model("Subscription", subscriptionSchema);
