const express = require("express");
const dotenv = require("dotenv");
const morgan = require("morgan");

dotenv.config({ path: "config.env" });
const ApiError = require("./utils/apiError");
const dbConnection = require("./config/database");
const categoryRoute = require("./routes/categoryRoute");
const subCategoryRoute = require("./routes/subCategoryRoute");
const globalError = require("./middlewares/errorMiddleware");

// Connect with db
dbConnection();

// express app
const app = express();
// Middlewares
app.use(express.json());

if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
  console.log(`mode: ${process.env.NODE_ENV}`);
}

// Mount Routes
app.use("/api/v1/categoeires", categoryRoute);
app.use("/api/v1/subcategoeires", subCategoryRoute);

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
