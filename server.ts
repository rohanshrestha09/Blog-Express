import express, { Application } from "express";
import connectDB from "./db";
import fileUpload from "express-fileupload";
import { initializeApp } from "firebase/app";
const rateLimit = require("express-rate-limit");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });

const app: Application = express();

app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use(fileUpload());

connectDB();

const PORT = process.env.PORT;

const firebaseConfig = {
  apiKey: process.env.API_KEY,
  authDomain: "blog-sansar.firebaseapp.com",
  projectId: "blog-sansar",
  storageBucket: "blog-sansar.appspot.com",
  messagingSenderId: process.env.MESSAGING_SENDER_ID,
  appId: process.env.APP_ID,
  measurementId: process.env.MEASUREMENT_ID,
};

// Initialize Firebase
initializeApp(firebaseConfig);

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

app.use("/api", require("./routes/user"));

app.use("/api", require("./routes/blog"));

app.use("/api", require("./routes/userActivity"));

app.listen(PORT);
