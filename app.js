var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const bodyParser = require("body-parser");
const passport = require("passport");
const cors = require("cors");
const http = require("http");

const { registerSocketServer } = require("./socket");

var usersRouter = require("./routes/users/router");
var jobsRouter = require("./routes/jobs/router");
var tasksRouter = require("./routes/tasks/router");
var jobApplicationsRouter = require("./routes/job-applications/router");
var BidsRouter = require("./routes/bids/router");
var NotesRouter = require("./routes/notes/router");
require("./db/connection");
require("./libs/passport/strategies");

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());

const corsOptions = {
  origin: "*",
};

app.use(cors(corsOptions));

app.use("/users", usersRouter);
app.use("/jobs", jobsRouter);
app.use("/tasks", tasksRouter);
app.use("/job-applications", jobApplicationsRouter);
app.use("/bids", BidsRouter);
app.use("/notes", NotesRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  console.log(err);
  res.render("error");
});

module.exports = app;
