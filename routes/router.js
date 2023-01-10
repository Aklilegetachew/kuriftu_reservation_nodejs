import express from "express";
import {
  add_activity_price,
  view_activity_price,
  view_activity_reservation,
} from "../controllers/Activity.controller";
import { auth } from "../controllers/authentication.controller";
import { verifyChapa } from "../controllers/chappa.controller";
import { main } from "../controllers/index.controller";
import { qrimage } from "../controllers/qrimages.controllers";
import { acceptRequest } from "../controllers/request.controller";
import { test } from "../controllers/test.controller";
import { verify } from "../controllers/verification.controller";

const router = express.Router();

router.get("/", main);
router.get('/index', main);
router.post("/request", acceptRequest);
router.get("/test", test);
router.get("/qrimage/:id", qrimage);
router.get("/verify/:id", verify);
router.get("/auth/:id", auth);

// Activity
router.get("/view_activity_price", view_activity_price);
router.post("/add_activity_price", add_activity_price);
router.get("/view_activity_reservation", view_activity_reservation);
// Chappa Payment
router.post('/verifyChapa', verifyChapa);
// router.post('/verifyWebhook',);

export default router;
