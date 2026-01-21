import { Request, Response, NextFunction } from "express";
import { BookService } from "../services/book.service";
import { parseCSV } from "../utils/csvParser";
import { db } from "../Database/user_db"



export const BookController = {
  getAll(req: Request, res: Response) {
    const query = "select * from book_data"
    db.query(query, (err, data) => {
      if (err) {
        return res.json({ msg: "error while reading data" })
      }
      return res.json(data)
    })
  },

  getById(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    // const book = BookService.getById(id);
    const query = "select * from book_data where id = ?;"

    db.query(query, [id], (err, data) => {
      if (err) {
        return res.status(500).json({
          msg: "error in reading database"
        });
      }

      // Check if data is an array and has at least one item
      if (!Array.isArray(data) || data.length === 0) {
        return res.status(404).json({
          msg: `not found with ${id}`
        });
      }

      return res.status(200).json(data[0]);
    })
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

    const query = "insert into book_data (title, author, published_Year) values (?, ?, ?)"

    db.query(query, [title, author, publishedYear], (err, data) => {
      if (err) {
        return res.status(500).json({ msg: `${err}` })
      }
      return res.status(201).json({ msg: `book created sucessfully with ${title}` })
    })

  },

  update(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const { title, author, publishedYear } = req.body;

    const updateQuery = "UPDATE book_data SET author = ?, title = ?, published_year = ? WHERE id = ?";

    db.query(updateQuery, [author, title, publishedYear, id], (err, data) => {
      if (err) {
        return res.status(500).json(err)
      }

      let affectedRows = 0;
      if (data && typeof data === 'object') {
        if ('affectedRows' in data) {
          affectedRows = (data as any).affectedRows;
        } else if (Array.isArray(data) && data.length > 0 && 'affectedRows' in data[0]) {
          affectedRows = (data[0] as any).affectedRows;
        }
      }

      if (affectedRows === 0) {
        return res.status(404).json({
          msg: "Book not found"
        });
      }

      return res.json(data)
    })
  },

  delete(req: Request, res: Response) {
    const id = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
    const deleted = BookService.delete(id);

    const deleteQuerry = "delete from book_data where id = ?"

    db.query(deleteQuerry, [id], (err, data) => {
      if (err) {
        return res.status(500).json({ msg: "db error" })
      }

      // Handle affectedRows for different possible data shapes
      let affectedRows = 0;
      if (data && typeof data === 'object') {
        if ('affectedRows' in data) {
          affectedRows = (data as any).affectedRows;
        } else if (Array.isArray(data) && data.length > 0 && 'affectedRows' in data[0]) {
          affectedRows = (data[0] as any).affectedRows;
        }
      }

      if (affectedRows === 0) {
        return res.status(404).json({
          msg: "Book not found"
        });
      }

      console.log(data);
      return res.status(200).json({ msg: `book deleted sucessfully with ${id}` })
    })


  },

  async importCSV(req: Request, res: Response, next: NextFunction) {

    if (!req.file) {
      return res.status(400).json({ message: "CSV file required" });
    }

    const result = parseCSV(req.file.buffer.toString());

    const query =
      "INSERT INTO book_data (title, author, published_year) VALUES (?, ?, ?)";

    let insertedCount = 0;
    const duplicateErrors: any[] = [];

    const insertBook = (book: any) =>
      new Promise<void>((resolve) => {
        db.query(
          query,
          [book.title, book.author, book.publishedYear],
          (err) => {
            if (err) {
              // MySQL duplicate key error code
              if (err.code === "ER_DUP_ENTRY") {
                return res.status(404).json({message: "Duplicate book entry"})
              }
            } else {
              insertedCount++;
            }
            resolve();
          }
        );
      });

    for (const book of result.validBooks) {
      await insertBook(book);
    }

    return res.status(201).json({
      added: insertedCount,
      duplicates: duplicateErrors,
      csvErrors: result.errors,
    });

  },
};
