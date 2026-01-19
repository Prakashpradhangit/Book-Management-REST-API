import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/book.service";
import { parseCSV } from "../utils/csvParser";

export const BookController = {
  getAll(req: Request, res: Response) {
    res.json(BookService.getAll());
  },

  getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const book = BookService.getById(id);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "sucess", book });
    res.json(book);
  },

  create(req: Request, res: Response) {
    const { title, author, publishedYear } = req.body;
    // Step 1: Validate input


    if (!Number.isInteger(publishedYear)) {
      return res.status(400).json({ msg: "publised year should be number" });
    }

    if (!title || !author || !publishedYear) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // Step 2: Check for duplicate
    const existingBook = BookService.getAll().find(
      (book) =>
        book.title === title &&
        book.author === author &&
        book.publishedYear === publishedYear,
    );

    if (existingBook) {
      return res.status(409).json({
        message: "Book already exists",
      });
    }

    // Step 3: Create book
    const book = BookService.create({ title, author, publishedYear });

    return res.status(201).json(book);
  },

  update(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const book = BookService.update(id, req.body);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json({ message: "Book updated successfully", book });
  },

  delete(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = BookService.delete(id);

    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(200).json({ message: "Book deleted successfully" });
  },

  importCSV(req: Request, res: Response, next: NextFunction) {
    if (!req.file)
      return res.status(400).json({ message: "CSV file required" });

    const result = parseCSV(req.file.buffer.toString());

    const addedBooks = [];
    result.validBooks.forEach((b) => {
      const existingBook = BookService.getAll().find(
        (book) =>
          book.title === b.title &&
          book.author === b.author &&
          book.publishedYear === b.publishedYear,
      );

      if (!existingBook) {
        addedBooks.push(BookService.create(b));
      }
    });

    res.json({
      added: addedBooks.length,
      errors: result.errors,
    });
  },
};
