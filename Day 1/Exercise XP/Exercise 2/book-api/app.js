const express = require('express');
const app = express();
app.use(express.json());

let books = [
    { id: 1, title: "Book 1", author: "Author 1", publishedYear: 2001 },
    { id: 2, title: "Book 2", author: "Author 2", publishedYear: 2002 },
    { id: 3, title: "Book 3", author: "Author 3", publishedYear: 2003 },
];

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.get('/api/books', (req, res) => {
    res.json(books);
});

app.get('/api/books/:bookId', (req, res) => {
    const bookId = parseInt(req.params.bookId, 10);
    const book = books.find(b => b.id === bookId);

    if (book) {
        res.status(200).json(book);
    } else {
        res.status(404).send('Book not found');
    }
});


app.post('/api/books', (req, res) => {
    const newBook = {
        id: books.length + 1,  
        title: req.body.title,
        author: req.body.author,
        publishedYear: req.body.publishedYear
    };

    books.push(newBook);
    res.status(201).json(newBook);
});
