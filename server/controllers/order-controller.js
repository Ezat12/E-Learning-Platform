const { asyncErrorHandler } = require("express-error-catcher");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KRY);
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError");
const Course = require("../models/courseModel");
const Order = require("../models/orderModel");
const jsend = require("jsend");

const getCheckoutSession = asyncErrorHandler(async (req, res, next) => {
  const idCourse = req.params.courseId;

  const course = await Course.findById(idCourse);
  if (!course) {
    return next(new ApiError(`not fond course by id => ${idCourse}`));
  }

  const session = await stripe.checkout.sessions.create({
    line_items: [
      {
        price_data: {
          currency: "egp",
          unit_amount: course.price * 100,
          product_data: {
            name: req.user.userName,
          },
        },
        quantity: 1,
      },
    ],
    mode: "payment",
    success_url: `${process.env.SERVER_URL}/api/v1/course`,
    cancel_url: `${process.env.SERVER_URL}/api/v1/course/${req.params.courseId}`,
    customer_email: req.user.userEmail,
    client_reference_id: req.params.courseId,
  });

  res.status(200).json({ status: "success", data: session });
});

const webhookCheckout = asyncErrorHandler(async (req, res, next) => {
  const sig = req.headers["stripe-signature"];

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_END_POINT_SECRET
    );
  } catch (err) {
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type == "checkout.session.completed") {
    createOrder(event.data.object);
    res.status(200).json({ status: "success" });
  } else {
    return res.status(400).json({ status: "something error in checkout" });
  }
});

const createOrder = (session) => {
  console.log(session);
};

module.exports = {
  getCheckoutSession,
  webhookCheckout,
};
