import express from 'express';
import mongoose from 'mongoose';
import bookRoute from './routes/booksRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();
const PORT = process.env.PORT;
const mongoDBURL = process.env.MONGO_URL;
const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for CORS POLICY
app.use(cors());

app.use('/books', bookRoute);

mongoose
 .connect(mongoDBURL)
    .then(() => {

        console.log('App is connected to MongoDB');
        app.listen(PORT, () => {
            console.log(`App is listening to port ${PORT}`);
        });

    })
    .catch((error) => {
        console.log('MongoDB is not connected');
        console.log(error);
    });