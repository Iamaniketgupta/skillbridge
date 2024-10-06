import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Mentee } from "../models/mentee.model.js";
import Mentor from "../models/mentor.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {

        const token = req.header("Authorization")?.split(" ")[1];
        console.log(token)
        if (!token) {
            res.status(402).json({
                data: null,
                message: "Please Login as Mentee"
            });
        }
        const {_id} = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
// console.log(_id)
        const user = await Mentee.findById(_id).select("-password -refreshToken");
        const user2 = await Mentor.findById(_id).select("-password -refreshToken");

        // console.log("MENTOR",user2)
        // console.log("MENTEE",user)
        if (user)
            req.user = user;
        if (user2)
            req.mentor = user2;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})