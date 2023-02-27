import express from "express";
import {
  add_activity_price,
  view_activity_price,
  view_activity_reservation,
  view_unpaid_activity,
  view_redemed_reservation,
  view_redemed_location
} from "../controllers/Activity.controller";
import { auth } from "../controllers/authentication.controller";
import { verifyChapa } from "../controllers/chappa.controller";
import { main } from "../controllers/index.controller";
import { qrimage } from "../controllers/qrimages.controllers";
import { acceptRequest } from "../controllers/request.controller";
import { test } from "../controllers/test.controller";
import {
  checkGuest,
  verify,
  checkEntotoGuest,
  checkBostonGuest,
} from "../controllers/verification.controller";

const router = express.Router();

router.get("/", main);
router.get("/index", main);
router.post("/request", acceptRequest);
router.get("/test", test);
router.get("/qrimage/:id", qrimage);
router.post("/verify", verify);
router.post("/checkGuest", checkGuest);
router.get("/auth/:id", auth);

// Activity
router.get("/view_activity_price", view_activity_price);
router.post("/add_activity_price", add_activity_price);
router.post("/view_activity_reservation", view_activity_reservation);
router.post("/view_redemed_reservation", view_redemed_reservation);
router.post("/reddeem_activity_reservation", view_redemed_location);
router.post("/view_activity_unpaid", view_unpaid_activity);
// Chappa Payment
router.post("/verifyChapa", verifyChapa);
router.post("/checkEntotoGuest", checkEntotoGuest);
router.post("/checkBostonGuest", checkBostonGuest);

// router.post('/verifyWebhook',);

export default router;
