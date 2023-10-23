import createError from "http-errors";
import express, { Request, Response, Application, NextFunction } from "express";
import cookieParser from "cookie-parser";
import logger from "./middleware/logger";
import cors from "cors";
import errorMiddleware from "./middleware/error";
const app: Application = express();

// view engine setup
// app.set('views', path.join(__dirname, 'views'));
// app.set('view engine', 'jade');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());

app.get("/", logger, function (req: Request, res: Response) {
  res.send("Hello Boy!!");
});

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next) {
  next(createError(404));
});
app.use(errorMiddleware);
// error handler
app.use(function (err: any, req: Request, res: Response, next: NextFunction) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;
