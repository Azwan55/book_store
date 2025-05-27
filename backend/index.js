import express from 'express';
import {PORT, mongoDBURL} from './config.js';
import mongoose from 'mongoose';
import {Book} from './model/bookModel.js';
import bookRoute from './routes/booksRoute.js';
import cors from 'cors';

const app = express();

//Middleware for parsing request body
app.use(express.json());

//Middleware for CORS POLICY
app.use(cors());
// app.use(
//     cors(
//         {
//             origin: '*',
//             methods: ['GET', 'POST', 'PUT', 'DELETE'],
//             allowedHeaders: ['Content-Type', ],
//         }
//     )
// );

app.get('/',(request,response) => {

    console.log(request);
    return response.status(234).send('Hello World');

});

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