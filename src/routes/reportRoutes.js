import express from "express";
import { CustomerController } from "../controllers/customerController.js";

const router = express.Router();

router.get("/total", CustomerController.getTotalCount);

export default router;