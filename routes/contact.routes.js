import express from "express";
import { renderContactPage, handleContactForm } from "../controllers/contact.controller.js";

const router = express.Router();

router.get("/", renderContactPage);
router.post("/", handleContactForm);

export default router;
