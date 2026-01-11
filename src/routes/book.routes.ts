import { Router } from "express";
import { BookController } from "../controllers/book.controller";
import multer from "multer";

const upload = multer();
const router = Router();

router.get("/", BookController.getAll);
router.get("/:id", BookController.getById);
router.post("/", BookController.create);
router.put("/:id", BookController.update);
router.delete("/:id", BookController.delete);
router.post("/import", upload.single("file"), BookController.importCSV);

export default router;
