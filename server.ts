import express, { Application } from "express";
import connectDB from "./db";
import fileUpload from "express-fileupload";
const path = require("path");
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

app.use(express.static(path.resolve(__dirname, "..", "client/.next")));

app.use("/api", require("./routes/user"));

app.listen(PORT);
