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
    console.log(mentorId)
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

    if(!session){
        return res.status(500).json({message:'Something went wrong'})
    }
    // Save the subscription details only after payment is successful
    const subscription = new Subscription({
        mentor: mentorId,
        mentee: _id,
        price: pricing.mentorshipPrice,
        session: session.id,
        status: "pending" 
    });

    await subscription.save();

    // Return the session information to the client
    res.status(201).json({
        success: true,
        message: 'Successfully initiated checkout',
        session: session
    });
});




const getUserSubscribers = asyncHandler(async(req,res)=>{
    const mentorId = req.mentor._id;
    // console.log(mentorId);
    if(!mentorId){
        throw new ApiError(400 , "Mentor id is required");
    }

    // console.log(mentorId)
    const subscription = await Subscription.find({ mentor: mentorId })
    .populate(
        {
            path:"mentee"
        }
    );

    if(!subscription){
        throw new ApiError(500 , "Subscription not found");
    }


    const mentees = subscription.map(sub => {
        return {
            _id: sub.mentee._id,
            fullName: sub.mentee.fullName,
            avatar: sub.mentee.avatar,
            state:sub.mentee.state,
            country:sub.mentee.country,
            interests:sub.mentee.interests
        };
    }); 

    if(!mentees){
        throw new ApiError(500 , "Some error happend");
    }

    return res.status(200).json(
        new ApiResponse(
            200,
            mentees,
            "Subscribed mentees fetched successfully"
        )
    )

});


const getMenteeSubscriptions = asyncHandler(async(req,res)=>{
    
    const menteeId = req.user._id;
   
    if(!menteeId)
    throw new ApiError(401 , "Please Login");

    const mentee = await Mentee.findById(menteeId);
    if(!mentee){
        throw new ApiError(400 , "user not found");
    }
    
    const subscriptions = await Subscription.find(
        {
            mentee:menteeId
        }
    ).populate(
        {
            path:"mentor",
            select:"avatar fullName"
        }
    );
    if(!subscriptions){
        throw new ApiError(500 , " Error while getting Subscriptions");
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
