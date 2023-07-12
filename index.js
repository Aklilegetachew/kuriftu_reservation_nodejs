import express from "express";
import dotenv from "dotenv";
// import config from "config";
import cors from "cors";
import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import router from "./routes/router";
import moment from "moment-timezone";
const helmet = require("helmet");
const { cidrSubnet, isV4Format, isLoopback } = require("ip");

moment.tz.setDefault("Africa/Addis_Ababa");

dotenv.config();
const env = process.env.NODE_ENV || "development";
const port = process.env.PORT || 8000;

const app = express();

app.use(cors());

// app.use(cors(corsOptionsDelegate));
app.use(bodyParser.json());
app.use(cookieParser());

const allowedIPs = [
  "109.70.148.58",
  "10.175.125.15",
  "10.175.125.16",
  "10.175.125.18",
  "10.175.125.17",
  "10.175.120.0/25", // IP block 1
  "10.175.125.0/25",
  "127.0.0.1", // IP block 2
];

// Custom middleware to block requests from all IPs except allowed IPs
const ipFilterMiddleware = (req, res, next) => {
  const clientIP = req.ip;
  console.log(clientIP);
  if (isIPAllowed(clientIP)) {
    // IP is allowed, proceed with the request
    next();
  } else {
    // IP is not allowed, block the request
    res.status(403).send("Access Denied");
  }
};

function isIPAllowed(ip) {
  if (allowedIPs.includes(ip)) {
    return true;
  }

  if (isLoopback(ip)) {
    return allowedIPs.includes("127.0.0.1") || allowedIPs.includes("::1");
  }

  for (const allowedIP of allowedIPs) {
    if (isIPInRange(ip, allowedIP)) {
      return true;
    }
  }

  return false;
}

function isIPInRange(ip, range) {
  if (isV4Format(range)) {
    return ip === range;
  }

  const subnet = cidrSubnet(range);
  return subnet.contains(ip);
}

app.use(ipFilterMiddleware);
app.use(router);

// app.use(router);

app.listen(port, () => {
  console.log(`Server Started on Port: ${port} - ${env}`);
});
