import express from 'express';
import mongoose from 'mongoose';
import bookRoute from './routes/booksRoute.js';
import authRoute from './routes/authRoute.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT || 5000;
const mongoDBURL = process.env.MONGO_URL;

const app = express();

app.use(express.json());    

app.use(cors({
    origin: "*"
}));

app.use('/auth', authRoute);
app.use('/books', bookRoute);

if (!mongoDBURL) {
    console.error("MONGO_URL is missing");
    process.exit(1);
}

mongoose
 .connect(mongoDBURL)
 .then(() => {
    console.log('App is connected to MongoDB');

    app.listen(PORT, () => {
        console.log(`App is listening on port ${PORT}`);
    });
})
 .catch((error) => {
    console.log('MongoDB is not connected');
    console.log(error);
 });