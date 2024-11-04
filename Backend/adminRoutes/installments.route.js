import express from "express";

import {addInstallments, getInstallments} from '../adminControllers/installment.controller.js'

const router = express.Router();

router.post("/", addInstallments);
router.get("/", getInstallments);

export default router