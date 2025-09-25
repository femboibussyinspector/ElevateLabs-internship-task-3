const express = require('express');
const app = express();

app.use(express.json());

let books = [
  { id: 1, title: 'The Lord of the Rings', author: 'J.R.R. Tolkien' },
  { id: 2, title: 'Pride and Prejudice', author: 'Jane Austen' },
];

let nextId = 3;

app.get('/books', (req, res) => {
  res.json(books);
});

app.post('/books', (req, res) => {
  const { title, author } = req.body;

  if (!title || !author) {
    return res.status(400).json({ message: 'Title and author are required' });
  }
 
  const existingBook = books.find(
    book => book.title.toLowerCase() === title.toLowerCase()&&
     book.author.toLowerCase() === author.toLowerCase()
  )

  if (existingBook){
    return res.status(409).json({
        message: "this book already exists"

    })
}
  const newBook = {
    id: nextId++,
    title: title,
    author: author,
  };

  books.push(newBook);
  res.status(201).json(newBook);
})


app.put('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const { title, author } = req.body;
  const bookToUpdate = books.find(book => book.id === bookId);

  if (!bookToUpdate) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (title) bookToUpdate.title = title;
  if (author) bookToUpdate.author = author;

  res.json(bookToUpdate);
});

app.delete('/books/:id', (req, res) => {
  const bookId = parseInt(req.params.id);
  const bookIndex = books.findIndex(book => book.id === bookId);

  if (bookIndex === -1) {
    return res.status(404).json({ message: 'Book not found' });
  }

  const [deletedBook] = books.splice(bookIndex, 1);
  res.json({ message: 'Book removed successfully', deletedBook: deletedBook });
});

module.exports = app;
