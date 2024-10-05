import { Router } from "express";
import { verifyJwt } from "../middlewares/auth.middleware2.js";

import {  getMenteeSubscriptions, getUserSubscribers } from "../controllers/subscription.controller.js";

const router = Router();


router.route('/getUserSubscribers').post(verifyJwt, getUserSubscribers);
router.route('/getMenteeSubscriptions').get(verifyJwt , getMenteeSubscriptions);

export default router;
