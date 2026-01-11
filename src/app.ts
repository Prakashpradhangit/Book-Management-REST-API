import express from "express";
import morgan from "morgan";
import bookRoutes from "./routes/book.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { notFound } from "./middlewares/notFound.middleware";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.use("/books", bookRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
