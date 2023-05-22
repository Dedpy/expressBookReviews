const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  if (users.find((user) => user.username === username)) {
    return true;
  }
  return false;
};

const authenticatedUser = (username, password) => {
  //returns boolean
  if (
    users.find(
      (user) => user.username === username && user.password === password
    )
  ) {
    return true;
  }
  return false;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  if (authenticatedUser(req.body.username, req.body.password)) {
    const token = jwt.sign({ id: req.body.username }, "fingerprint_customer", {
      expiresIn: 300,
    });
    return res.status(200).json({ auth: true, token: token });
  }
  return res.status(401).json({ message: "Invalid credentials" });
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  let book = books.find((book) => book.isbn === req.params.isbn);
  if (book) {
    book.review = req.body.review;
    return res.status(200).json(book);
  }
  return res.status(404).json({ message: "Book not found" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
