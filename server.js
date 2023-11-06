const path = require("path");

const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");
// eslint-disable-next-line import/no-extraneous-dependencies
const cors = require("cors");
// eslint-disable-next-line import/no-extraneous-dependencies
// const rateLimit = require("express-rate-limit");
// eslint-disable-next-line import/no-extraneous-dependencies
const hpp = require("hpp");
// eslint-disable-next-line import/no-extraneous-dependencies
const mongoSanitize = require("express-mongo-sanitize");
// eslint-disable-next-line import/no-extraneous-dependencies
const xss = require("xss-clean");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const globalError = require("./middlewares/errorMiddleware");
const dbConnection = require("./config/database");
// Routes
const mountRoutes = require("./routes");

// Connect with db
dbConnection();

// express app
const app = express();

//Enable other domains to access your application
app.use(cors());
app.options("*", cors());

// Middlewares
app.use(express.json({ limit: "20kb" }));
app.use(express.static(path.join(__dirname, "uploads")));

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// To apply data saninization
app.use(mongoSanitize());
app.use(xss());

// Limit each IP to 100 requests per 'window' (here, per 15 minutes)
// const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message:
    "Too many accounts created from this IP, please try again after an hour.",
// });

// Apply the rate limiting middleware to all requests
app.use("/api", limiter);

// Middleware to protect against HTTP Parameter Pollution attacks
app.use(
  hpp({
    wishlist: [
      "price",
      "sold",
      "quantity",
      "ratingsAveraged",
      "ratingsQuantity",
    ],
  })
);

// Mount Routes
mountRoutes(app);

app.all("*", (req, res, next) => {
  // Before
  // Create error and send it to error handling middleware
  // const err = new Error(`Can't find this route ${req.originalUrl}`);
  // next(err.message);
  // After
  next(new ApiError(`Can't find this route ${req.originalUrl}`, 400));
});

// Global error handling middleware for express
app.use(globalError);

const PORT = process.env.PORT || 8000;
const server = app.listen(PORT, () => {
  console.log(`App running on port ${PORT}`);
});

// Handle rejection outside of express
process.on("unhandledRejection", (err) => {
  console.error(`UnhandledRejection Error: ${err.name} | ${err.message}`);
  server.close(() => {
    console.error(`Shutting down....`);
    process.exit(1);
  });
});
