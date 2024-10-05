import { Mentee } from "../models/mentee.model.js";
import Mentor from "../models/mentor.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const getAllMentors = asyncHandler(async (req, res) => {
  const allMentors = await Mentor.find({}).select(
    "-password -email -refreshToken"
  );
  if (!allMentors) {
    res.status(400).json({
      data: {},
      message: "Not Found",
    });
  }
  res.status(200).json({
    data: allMentors,
    message: "Fetched Success",
  });
});

const verifyMenteeId = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.accessToken ||
    req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    res.status(402).json({
      data: null,
      message: "Please Login as Mentee",
    });
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  console.log(decodedToken);

  let user = await Mentee.findById(decodedToken).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "Unauthorized / expired token");
  }
  req.user = user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User got successfully"));
});

const verifyMentorId = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies.menauthId || req.header("Authorization")?.replace("Bearer", "");

  if (!token) {
    res.status(402).json({
      data: null,
      message: "Please Login as Mentee",
    });
  }

  const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

  console.log(decodedToken);

  let user = await Mentor.findById(decodedToken).select(
    "-password -refreshToken"
  );
  if (!user) {
    throw new ApiError(400, "Expired session")
  }

  req.user = user;
  return res
    .status(200)
    .json(new ApiResponse(200, user, "User got successfully"));
});



export const verifyPersonById = asyncHandler(async( req , res, next)=>{
  try {

      const token =  req.header("Authorization")?.replace("Bearer " , "") ;
  
      if(!token){
          res.status(402).json({
              data:null,
              message:"Please Login as Mentee"
          });
      }
  
      const decodedToken = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET);

      console.log(decodedToken);
  
      const  user = await Mentee.findById(decodedToken._id).select("-password -refreshToken");

      console.log(user)
  
      if(!user){
        res.status(401).json({message:'Token Invalid'})
      }
  
     res.status(200).json(user)
  } catch (error) {
    res.status(500).json({message:error})

  }

})



export { getAllMentors, verifyMenteeId, verifyMentorId };
