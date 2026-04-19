import express from 'express';
import {Book} from '../model/bookModel.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();



//Route for Save new Book
router.post('/', protect, async (request,response) => {

    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
      
        ){
            return response.status(400).send({message : 'Send all required fields: title, author, publishYear'});
        }
        const newBook={
            title: request.body.title,
            author: request.body.author,
            publishYear: request.body.publishYear,
            created_by: request.user.id,
        };
        const book = await Book.create(newBook);
        return response.status(201).send({message : 'Book Created', book});

    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//Route for Get all Books from database
router.get('/',async (request,response) => {

    try{
        const books = await Book.find({});
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//Route for Get user's own books - accepts userId in payload
router.post('/get-books', protect, async (request,response) => {

    try{
        const { userId } = request.body;
        
        // Verify that userId is provided
        if (!userId) {
            return response.status(400).send({message : 'User ID is required'});
        }
        
        // Verify that the user can only access their own books (security check)
        if (userId !== request.user.id) {
            return response.status(403).send({message : 'You can only view your own books'});
        }
        
        const books = await Book.find({ created_by: userId });
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//Route for Get user's own books (must be BEFORE /:id route)
router.get('/user/books', protect, async (request,response) => {

    try{
        // Extract userId from JWT token (secure - not from user input)
        const userId = request.user.id;
        
        const books = await Book.find({ created_by: userId });
        return response.status(200).json({
            count: books.length,
            data: books
        });
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//Route for Get one book from database by id
router.get('/:id',async (request,response) => {

    try{

        const {id} = request.params;

        const book = await Book.findById(id);
        return response.status(200).json(book);
    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }
});

//Route for Update book 
router.put('/:id', protect, async (request,response) => {

    try{
        if(
            !request.body.title ||
            !request.body.author ||
            !request.body.publishYear
      
        ){
            return response.status(400).send(
                {message : 'Send all required fields: title, author, publishYear'});
        }

        const {id} = request.params;
        
        const book = await Book.findById(id);
        if(!book){
            return response.status(404).send({message : 'Book not found'});
        }
        
        if(!book.created_by || book.created_by.toString() !== request.user.id){
            return response.status(403).send({message : 'You can only edit your own books'});
        }

        const result = await Book.findByIdAndUpdate(id,request.body);
        return response.status(200).send({message : 'Book updated successfully'});


    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});
    }

       
});

//Route for Delete book
router.delete('/:id', protect, async (request,response) => {

    try{

      const{id} = request.params;
      
      const book = await Book.findById(id);
      if(!book){
        return response.status(404).send({message : 'Book not found'});
      }
      
      if(!book.created_by || book.created_by.toString() !== request.user.id){
        return response.status(403).send({message : 'You can only delete your own books'});
      }
      
      const result= await Book.findByIdAndDelete(id);
      return response.status(200).send({message : 'Book deleted successfully'});

    }catch(error){
        console.log(error.message);
        response.status(500).send({ message : error.message});

    }
});

export default router;