import { Router } from "express";
import { logOutMentor, loginMentor,  registerMentor, updateMentorAvatar, updateMentorProfile,getMentorById, getMentorAllSlots, createPrice, deletePricing, getPricing } from "../controllers/mentor.controller.js";
import { uploadImage } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware2.js";

const mentorRouter = Router();


mentorRouter.route('/signup').post(registerMentor);
mentorRouter.route('/login').post(loginMentor);
mentorRouter.route('/logout').get(verifyJwt , logOutMentor);
mentorRouter.route('/editProfile').post(verifyJwt  , updateMentorProfile);
mentorRouter.route('/updateMentorAvatar').post(verifyJwt , uploadImage.single("avatar") , updateMentorAvatar);
mentorRouter.route('/getAllSlots').get(verifyJwt  , getMentorAllSlots);

mentorRouter.route('/pricing/new').post(verifyJwt  , createPrice);

mentorRouter.route('/pricing/:priceId').delete(verifyJwt  , deletePricing);

mentorRouter.route('/pricing/:mentorId').get(getPricing);

mentorRouter.route("/getMentorById").post(getMentorById)
 
export default mentorRouter;
 