import { Router } from "express";
import { logOutMentor, loginMentor,  registerMentor, updateMentorAvatar, updateMentorProfile,getMentorById, getMentorAllSlots, createPrice, deletePricing, getPricing } from "../controllers/mentor.controller.js";
import { verifyMentorJwt } from "../middlewares/mentorAuth.middleware.js";
import { uploadImage } from "../middlewares/multer.middleware.js";

const mentorRouter = Router();


mentorRouter.route('/signup').post(registerMentor);
mentorRouter.route('/login').post(loginMentor);
mentorRouter.route('/logout').get(verifyMentorJwt , logOutMentor);
mentorRouter.route('/editProfile').post(verifyMentorJwt , updateMentorProfile);
mentorRouter.route('/updateMentorAvatar').post(verifyMentorJwt, uploadImage.single("avatar") , updateMentorAvatar);
mentorRouter.route('/getAllSlots').get(verifyMentorJwt , getMentorAllSlots);

mentorRouter.route('/pricing/new').post(verifyMentorJwt , createPrice);

mentorRouter.route('/pricing/:priceId').delete(verifyMentorJwt , deletePricing);

mentorRouter.route('/pricing/:mentorId').get(getPricing);

mentorRouter.route("/getMentorById").post(getMentorById)
 
export default mentorRouter;
 