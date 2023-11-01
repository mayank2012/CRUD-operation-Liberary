const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();
const PORT = process.env.PORT || 3000;

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/bookstore', {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const Book = mongoose.model('Book', {
  title: String,
  author: String,
  summary: String
});

app.use(bodyParser.json());

// Create a new bookf
app.post('/books', async (req, res) => {
  try {
    const { title, author, summary } = req.body;
    const book = new Book({ title, author, summary });
    await book.save();
    res.status(201).json(book);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create a new book.' });
  }
});

// View a list of all books
app.get('/books', async (req, res) => {
  const books = await Book.find();
  res.json(books);
});

// View details of a specific book by its ID
app.get('/books/:id', async (req, res) => {
  try {
    const book = await Book.findById(req.params.id);
    if (book) {
      res.json(book);
    } else {
      res.status(404).json({ error: 'Book not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve the book.' });
  }
});

// Update a book's details
app.put('/books/:id', async (req, res) => {
  try {
    const { title, author, summary } = req.body;
    const updatedBook = await Book.findByIdAndUpdate(req.params.id, { title, author, summary }, { new: true });
    res.json(updatedBook);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update the book.' });
  }
});

// Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    await Book.findByIdAndRemove(req.params.id);
    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete the book.' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
