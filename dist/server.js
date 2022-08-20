"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const db_1 = __importDefault(require("./db"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const path = require("path");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config({ path: __dirname + "/.env" });
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cors());
app.use(bodyParser.json());
app.use((0, express_fileupload_1.default)());
(0, db_1.default)();
const PORT = process.env.PORT;
app.use(express_1.default.static(path.join(__dirname, "/../client/public")));
app.use("/_next", express_1.default.static(path.join(__dirname, "/../client/.next")));
app.use("/api", require("./routes/user"));
app.listen(PORT);
