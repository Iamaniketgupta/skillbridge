import Stripe from "stripe";
import { Mentee } from "../models/mentee.model.js";
import Mentor from "../models/mentor.model.js";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { Pricing } from "../models/pricing.model.js";



const getCheckoutSession = asyncHandler(async (req, res) => {
    const { mentorId } = req.params;
    // console.log("ceada",req)
    const { _id, email } = req.user;

    // Check if mentorId is provided
    if (!mentorId)
        throw new ApiError(400, "Mentor ID not found");

    // Fetch mentor details
    const mentor = await Mentor.findById(mentorId).select("-password -refreshToken");
    if (!mentor)
        throw new ApiError(400, "Mentor not found");

    // Fetch mentor pricing details
    const pricing = await Pricing.findOne({ mentor: mentorId });
    if (!pricing || !pricing.mentorshipPrice)
        throw new ApiError(400, "Pricing not found or invalid");

    // Fetch mentee details
    const mentee = await Mentee.findById(_id).select("-password -refreshToken");
    if (!mentee)
        throw new ApiError(402, "Please Login first");

    const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2022-11-15' });

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        mode: 'payment',
        success_url: `${process.env.CLIENT_URL}/checkout-success`,
        cancel_url: `${process.env.CLIENT_URL}/checkout-failed/${mentorId}`,
        customer_email: email,
        client_reference_id: mentorId,
        line_items: [{
            price_data: {
                currency: 'inr',
                unit_amount: pricing.mentorshipPrice * 100,
                product_data: {
                    name: mentor.fullName,
                    images: [mentor.avatar || 'default-image-url.jpg'],
                }
            },
            quantity: 1
        }]
    });


    if (!session ) {
        return res.status(500).json({ message: 'Something went wrong' })
    }
    const subscription = new Subscription({
        mentor: mentorId,
        mentee: _id,
        price: pricing.mentorshipPrice,
        session: session.id,
        status: "pending"
    });
    await subscription.save();
    res.status(201).json({
        success: true,
        message: 'Successfully initiated checkout',
        session: session
    });
});


export const verifyCheckoutSession = asyncHandler(async (req, res) => {
    const { sessionId } = req.body;
    const {_id}= req.user
    console.log('hereweaea', sessionId)

    // if (!sessionId) {
    //     return res.status(400).json({ success: false, message: 'Session ID is required' });
    // }

    try {
        // const stripe = new Stripe(process.env.STRIPE_SECRET, { apiVersion: '2022-11-15' });

        // // Retrieve the session from Stripe
        // const session = await stripe.checkout.sessions.retrieve(sessionId);

        // if (!session) {
        //     return res.status(400).json({ success: false, message: 'Session not found' });
        // }

        // Update the subscription status in the database
        const subscription = await Subscription.findOne({ mentee: _id });
        
        subscription.status = "success";
        await subscription.save();

        if (!subscription) {
            return res.status(404).json({ success: false, message: 'Subscription not found' });
        }

        return res.status(200).json({ success: true, message: 'Payment successful and status updated' });


    } catch (err) {
        console.error(err);
        res.status(500).json({ success: false, message: 'Server error' });
    }
});





const getUserSubscribers = asyncHandler(async (req, res) => {
    const mentorId = req.mentor?._id || req.body.mentorId;

    if (!mentorId) {
        return res.status(400).json(new ApiError(400, "Mentor id is required"));
    }

    const subscription = await Subscription.find({
        mentor: mentorId,
        status: "success",
    }).populate({
        path: "mentee",
    });
    // Check if no subscriptions were found
    if (!subscription || subscription.length === 0) {
        return res.status(404).json(new ApiError(404, "No subscriptions found for this mentor"));
    }

    const mentees = subscription.map(sub => ({
        _id: sub.mentee._id,
        fullName: sub.mentee.fullName,
        avatar: sub.mentee.avatar,
        state: sub.mentee.state,
        country: sub.mentee.country,
        interests: sub.mentee.interests,
    }));

    return res.status(200).json(
        new ApiResponse(200, mentees, "Subscribed mentees fetched successfully")
    );
});


const getMenteeSubscriptions = asyncHandler(async (req, res) => {

    const menteeId = req.user._id;

    if (!menteeId)
        throw new ApiError(401, "Please Login");

    const mentee = await Mentee.findById(menteeId);
    if (!mentee) {
        throw new ApiError(400, "user not found");
    }

    const subscriptions = await Subscription.find(
        {
            mentee: menteeId,
            status: "success",
        }
    ).populate(
        {
            path: "mentor",
            select: "avatar fullName"
        }
    );
    if (!subscriptions) {
        throw new ApiError(500, " Error while getting Subscriptions");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            subscriptions,
            "Mentor subscriptions fetched successfully"
        ))
})




export {

    getCheckoutSession,
    getUserSubscribers,
    getMenteeSubscriptions

}