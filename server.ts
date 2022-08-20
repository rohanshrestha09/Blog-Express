import express, { Application } from "express";
import connectDB from "./db";
import fileUpload from "express-fileupload";
import { initializeApp } from "firebase/app";
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

app.use("/api", require("./routes/user"));

app.listen(PORT);

export default app;
