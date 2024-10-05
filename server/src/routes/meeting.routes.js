import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware2.js";

import { createMeeting, deleteMeeting, getAllMeetings, getMenteeMeetings } from "../controllers/meeting.controller.js";

const router = Router();

router.route("/allMenteeMeetings").get(verifyJwt,getMenteeMeetings);
router.route("/allMentorMeetings").get(verifyJwt ,getAllMeetings);
router.route("/delete/:meetingId").delete(verifyJwt ,deleteMeeting);
router.route("/create/new").post(verifyJwt ,createMeeting);


export default router;