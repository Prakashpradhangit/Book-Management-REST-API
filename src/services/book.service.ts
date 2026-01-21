import { Book } from "../models/book.model";

let currentId = 1;

const books: Book[] = [];

export const BookService = {
  getAll: () => books,

  getById: (id: string) => books.find(b => b.id === id),

  create: (data: Omit<Book, "id">): Book => {
    const book: Book = {
      id: (currentId++).toString(),
      ...data
    };
    books.push(book);
    return book;
  },

  update: (id: string, data: Partial<Book>) => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return null;
    books[index] = { ...books[index], ...data };
    return books[index];
  },

  delete: (id: string) => {
    const index = books.findIndex(b => b.id === id);
    if (index === -1) return false;
    books.splice(index, 1);
    return true;
  }
};

