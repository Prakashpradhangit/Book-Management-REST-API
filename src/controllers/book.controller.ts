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
    res.json(book);
  },

  create(req: Request, res: Response) {
    const { title, author, publishedYear } = req.body;
    const book = BookService.create({ title, author, publishedYear });
    res.status(201).json(book);
  },

  update(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const book = BookService.update(id, req.body);
    if (!book) return res.status(404).json({ message: "Book not found" });
    res.json(book);
  },

  delete(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = BookService.delete(id);
    if (!deleted) return res.status(404).json({ message: "Book not found" });
    res.status(204).send();
  },

  importCSV(req: Request, res: Response, next: NextFunction) {
    if (!req.file) return res.status(400).json({ message: "CSV file required" });

    const result = parseCSV(req.file.buffer.toString());

    result.validBooks.forEach(b => BookService.create(b));

    res.json({
      added: result.validBooks.length,
      errors: result.errors
    });
  }
};
