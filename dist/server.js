"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = require("firebase-admin/app");
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const db_1 = __importDefault(require("./db"));
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: __dirname + '/.env' });
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true,
}));
app.use(bodyParser.json());
app.use((0, express_fileupload_1.default)());
(0, db_1.default)();
const PORT = process.env.PORT || 5000;
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    standardHeaders: true,
    legacyHeaders: false,
});
const serviceAccount = require('./blog-sansar-firebase-adminsdk-8snwe-96b9089a8c.js');
(0, app_1.initializeApp)({
    credential: (0, app_1.cert)(serviceAccount),
    storageBucket: 'gs://blog-sansar.appspot.com',
});
app.use(limiter);
app.use('/api', require('./routes/auth'));
app.use('/api', require('./routes/user'));
app.use('/api', require('./routes/security'));
app.use('/api', require('./routes/blog'));
app.listen(PORT);
