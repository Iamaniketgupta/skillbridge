
import express from 'express';
const router = express.Router();
import { verifyJwt } from '../middlewares/auth.middleware2.js';
import { getCheckoutSession } from '../controllers/subscription.controller.js';


router.route("/checkout-session/:mentorId").post(getCheckoutSession);



export default router;
