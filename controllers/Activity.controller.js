// import ActivityLocation from "../models/ActivityLocation.model";
import ActivityPrice from "../models/ActivityPrice.model";
import ActivityReserv from "../models/ActivityReservation.model";
import superAppReservation from "../models/allActivityReservation.model";
const Sequelize = require("sequelize");
const config = require("../config/config");
const crypto = require("crypto");
const logger = require("../utils/logger");

// Function to verify the response body
function verifyResponseBody(responseBody, publicKey, signature) {
  const verifier = crypto.createVerify("SHA256");
  verifier.update(responseBody);

  const isVerified = verifier.verify(publicKey, signature, "base64");
  return isVerified;
}

// Function to convert parameters to camelCase format
function toCamelCase(parameter) {
  return parameter.replace(/_([a-z])/g, function (g) {
    return g[1].toUpperCase();
  });
}

export const view_activity_price = async (req, res) => {
  try {
    const result = await ActivityPrice.findAll();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const activity_confirmation = async (req, res) => {
  // const testnotifyResponse = {
  //   notify_url: "http://197.156.68.29:5050/v1/api/order/mini/payment",
  //   appid: "853694808089602",
  //   notify_time: "1677831397396",
  //   merch_code: "245431",
  //   merch_order_id: "1677831332772_yzdlephu",
  //   payment_order_id: "013011053311163600001002",
  //   total_amount: "1.00",
  //   trans_currency: "ETB",
  //   trade_status: "Completed",
  //   trans_end_time: "1677831397000",
  //   sign: "Z4jTlQ7edeWzZRDku2Xl/vVkguOsL5mDR6Guf2/tCaogx2j4CE3+iWSjsR+9kAn+5oZUH3Ta4c4w8QFonG3iKWyL++YTnOfLnA1zR7RD8/BXFNGVqLp5lZO1ss8z22PtKZa4x4dWPtJ2djVIe1q6WempUy2WS7tamCFLyvTDq/GERmycoaXyuWSfMpa9B3m3oNOieHZCLY6DizZrhIKQbDfqeX0wgVre3mAFy+nUhVHlWbgajxSaixadx/IqQUhbXs+ADRbKzG+uXHcEWM4luYN1SZNo4u8UmDU/yEdhFKy8HmSARYx8+bT3Q7jTsURpudIBXolC/gbC+H/0bBc6ZlvH0aSM3qzal5eBxEMHgyM/WPQZCCVAfyPAkFeP4yrfZ/q2YxMos1GnDGONvOGYthnU/rCmGIhtzU+wWeMMlHakrkPoA0NT++NWoaFvDbtasXRWYtC0KLQ2FvkoZtXJAS5wlTKf4wZRdrjf5YUi+uxwwjGd1W5BZUSJtTXSBU1Y",
  //   sign_type: "SHA256WithRSA",
  // };

  logger.info("========= Super App Confirmation ===========");

  const notifyResponse = req.body;
  // Format the response parameters
  const formattedResponse = {};
  for (let key in notifyResponse) {
    if (key !== "sign" && key !== "sign_type") {
      let formattedKey = key === "appid" ? key : toCamelCase(key);
      formattedResponse[formattedKey] = notifyResponse[key];
    }
  }

  // Sort the formatted response parameters alphabetically
  const sortedResponse = {};
  Object.keys(formattedResponse)
    .sort()
    .forEach((key) => {
      sortedResponse[key] = formattedResponse[key];
    });

  const publicKey = config.publicKey;
  const signature = notifyResponse.sign;
  // Function to verify the response body
  const responseBody = JSON.stringify(sortedResponse);
  const isVerified = verifyResponseBody(responseBody, publicKey, signature);
  console.log("Response body verification:", isVerified);

  logger.info(isVerified);

  // const orderIdParts = notifyResponse.merch_order_id.split("_");
  const merchOrderId = notifyResponse.merch_order_id;
  const transctionID = notifyResponse.transId;
  console.log("HERE is Notification from Telebir Super App", merchOrderId);
  try {
    const updatedPayment = await superAppReservation.update(
      { payment_status: "paid", tx_ref: transctionID }, // New values to update
      {
        where: {
          confirmation_code: merchOrderId, // Condition for the update
          payment_status: "Unpaid", // Additional condition to ensure the status is unpaid before updating
        },
      }
    );

    if (updatedPayment[0] > 0) {
      res.send({
        code: 0,
        msg: "success",
      });
    } else {
      res.send(
        `No payment found with trxId ${merchOrderId} or the payment status is already paid.`
      );

      logger.info(
        `No payment found with trxId ${merchOrderId} or the payment status is already paid.`
      );
    }
  } catch (error) {
    console.error("Error updating payment:", error);
    logger.info(`Error updating payment: ${error}`);
  }
};

export const view_activity_ById = async (req, res) => {
  console.log(req.body.ID);
  try {
    const result = await ActivityPrice.findAll({
      where: {
        id: req.body.ID,
      },
    });
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const add_activity_price = async (req, res) => {
  const datas = req.body;

  try {
    await ActivityPrice.create({
      name: datas.name,
      price: datas.price,
      location: datas.location,
    });

    res.json({ msg: true });
  } catch (error) {
    console.log(error);
  }
};

export const view_activity_reservation = async (req, res) => {
  const location = req.body.location;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll({
        where: {
          order_status: {
            [Sequelize.Op.not]: "checked_in",
          },
        },
      });
      // result.forEach((item) => {
      //   try {
      //     item.amt = JSON.parse(item.amt);
      //     item.redeemed_amt = JSON.parse(item.redeemed_amt);
      //   } catch (error) {
      //     console.error(`Error parsing JSON data: ${error.message}`);
      //   }
      // })

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          location: location,
          order_status: {
            [Sequelize.Op.not]: "checked_in",
          },
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const view_redemed_reservation = async (req, res) => {
  const location = req.body.location;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll({
        where: {
          order_status: "checked_in",
        },
      });

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          location: location,
          order_status: "checked_in",
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const view_redemed_location = async (req, res) => {
  const location = req.body.location;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll({
        where: {
          order_status: "checked_in",
        },
      });

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          location: location,
          order_status: "checked_in",
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const view_unpaid_activity = async (req, res) => {
  const status = req.body.paymentStatus;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll();
      // result.forEach((item) => {
      //   try {
      //     item.amt = JSON.parse(item.amt);
      //     item.redeemed_amt = JSON.parse(item.redeemed_amt);
      //   } catch (error) {
      //     console.error(`Error parsing JSON data: ${error.message}`);
      //   }
      // })

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          payment_status: status,
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};
