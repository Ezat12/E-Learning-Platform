const { asyncErrorHandler } = require("express-error-catcher");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KRY);
// const stripe = Stripe(process.env.STRIPE_SECRET_KEY);
const ApiError = require("../utils/apiError");
// const Course = require("../models/courseModel");
// const Order = require("../models/orderModel");
const jsend = require("jsend");
const User = require("../models/userModel");
const Order = require("../models/orderModel");
const Course = require("../models/courseModel");
const StudentCourse = require("../models/studentCoursesModel");
// const { updateUser } = require("./user-controller");

const getCheckoutSession = asyncErrorHandler(async (req, res, next) => {
  const idCourse = req.params.courseId;

  const course = await Course.findById(idCourse);
  if (!course) {
    return next(new ApiError(`not fond course by id => ${idCourse}`));
  }

  const studentCoursesToUser = await StudentCourse.findOne({
    user: req.user._id,
  });

  const coursesStudent = studentCoursesToUser?.courses;

  const checkCourse = coursesStudent?.some(
    (c) => c.course._id.toString() === idCourse
  );

  if (checkCourse) {
    return next(new ApiError("you already have the course", 400));
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
    success_url: `${process.env.SERVER_URL}/my-courses`,
    cancel_url: `${process.env.SERVER_URL}/courses/${req.params.courseId}`,
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

const createOrder = async (session) => {
  const user = await User.findOne({ userEmail: session.customer_email });
  const courseId = session.client_reference_id;
  const price = session.amount_total / 100;

  /// Create Order ======
  const createOrder = await Order.create({
    user: user._id,
    course: courseId,
    coursePrice: price,
    orderData: Date.now(),
  });

  console.log("create order", createOrder);

  /// Update Course ===============

  const updateCourse = await Course.findByIdAndUpdate(
    courseId,
    {
      $push: { student: user._id },
    },
    { new: true }
  );

  // console.log(updateCourse);

  //// Create Or Update Student Course =========
  const findStudentCourse = await StudentCourse.findOne({ user: user._id });

  console.log("findStudentCourse", findStudentCourse);

  if (!findStudentCourse) {
    const createStudentCourse = await StudentCourse.create({
      user: user._id,
      courses: [{ course: courseId, dateOfPurchase: Date.now() }],
    });
    console.log("Create Student Course", createStudentCourse);
    return res
      .status(200)
      .json({ states: "success", data: createStudentCourse });
  } else {
    const studentCourse = await StudentCourse.updateOne(
      { user: user._id },
      {
        $push: { courses: { course: courseId, dateOfPurchase: Date.now() } },
      }
    );

    console.log("get Student Course", studentCourse);

    return res.status(200).json({ states: "success", data: studentCourse });
  }
};

module.exports = {
  getCheckoutSession,
  webhookCheckout,
};
