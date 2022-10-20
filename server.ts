import express, { Application } from 'express';
import { initializeApp, cert } from 'firebase-admin/app';
import connectDB from './db';
import fileUpload from 'express-fileupload';
const rateLimit = require('express-rate-limit');
const cors = require('cors');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
require('dotenv').config({ path: __dirname + '/.env' });

const app: Application = express();

app.use(express.urlencoded({ extended: false }));

app.use(cookieParser());

app.use(cors());

app.use(bodyParser.json());

app.use(fileUpload());

connectDB();

const PORT = process.env.PORT || 3000;

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
});

const serviceAccount = require('./blog-sansar-firebase-adminsdk-8snwe-96b9089a8c.json');

initializeApp({
  credential: cert(serviceAccount),
  storageBucket: 'gs://blog-sansar.appspot.com',
});

app.use(limiter);

app.use('/api', require('./routes/auth'));

app.use('/api', require('./routes/user'));

app.use('/api', require('./routes/security'));

app.use('/api', require('./routes/blog'));

app.listen(PORT);
