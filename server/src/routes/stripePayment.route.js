
import express from 'express';
const router = express.Router();
import { verifyJwt } from '../middlewares/auth.middleware2.js';
import { getCheckoutSession, verifyCheckoutSession } from '../controllers/subscription.controller.js';


router.route("/checkout-session/:mentorId").post(verifyJwt,getCheckoutSession);
router.route("/getMenteeSubscriptions").post(verifyJwt,verifyCheckoutSession);



export default router;