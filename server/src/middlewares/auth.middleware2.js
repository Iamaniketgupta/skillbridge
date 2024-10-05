import { ApiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { Mentee } from "../models/mentee.model.js";
import Mentor from "../models/mentor.model.js";

export const verifyJwt = asyncHandler(async (req, res, next) => {
    try {
        // console.log(req.cookies.accessToken);

        const token = req.header("Authorization")?.replace("Bearer ", "");

        if (!token) {
            res.status(402).json({
                data: null,
                message: "Please Login as Mentee"
            });
        }
        const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

        const user = await Mentee.findById(decodedToken).select("-password -refreshToken");
        const user2 = await Mentor.findById(decodedToken).select("-password -refreshToken");

        console.log("MENTOR",user2)
        console.log("MENTEE",user)
        if (user)
            req.user = user;
        if (user2)
            req.mentor = user2;
        next();
    } catch (error) {
        throw new ApiError(401, error?.message || "Invalid access token");
    }

})