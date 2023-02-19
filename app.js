import cookieParser from "cookie-parser";
import express from "express";
import morgan from "morgan";
import authRoutes from "./Routes/authRoutes.js";

import cors from "cors";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// cors helps in controlling who requests to backend as a seccurity measure
app.use(cors());
app.use(cookieParser());

//Morgan logger gives info about api requests

app.use(morgan("tiny"));

app.use(authRoutes);

export default app;
