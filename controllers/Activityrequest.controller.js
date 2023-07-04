import generateUniqueId from "generate-unique-id";
import JoiPhoneNumber from "joi-phone-number";
import ActivityPrice from "../models/ActivityPrice.model";
import Joi from "joi";
import SuperAppActivityReserv from "../models/allActivityReservation.model";
const applyFabricToken = require("./applyFabricTokenService");
const requestCreateOrder = require("./requestCreateOrder");
const tools = require("../utils/tools");
const config = require("../config/config");
const logger = require("../utils/logger");

const customPhone = Joi.extend(JoiPhoneNumber);
const firstNameJoi = Joi.string().alphanum().min(3).max(30).required();
const lastNameJoi = Joi.string().alphanum().min(3).max(30).required();
const phoneNumberJoi = customPhone.string().phoneNumber().required();
const emailJoi = Joi.string().email({ minDomainSegments: 2 }).required();
const currencyJoi = Joi.string().required();
const locationJoi = Joi.string().required();
const reservationTypeJoi = Joi.string().optional();
const quantityJoi = Joi.number().optional();
const IDJoi = Joi.number().optional();

const dateFunction = (ts) => {
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  var final = year + "-" + month + "-" + date;
  return final;
};

function createRawRequest(prepayId) {
  let map = {
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    nonce_str: tools.createNonceStr(),
    prepay_id: prepayId,
    timestamp: tools.createTimeStamp(),
  };
  let sign = tools.signRequestObject(map);
  // order by ascii in array
  let rawRequest = [
    "appid=" + map.appid,
    "merch_code=" + map.merch_code,
    "nonce_str=" + map.nonce_str,
    "prepay_id=" + map.prepay_id,
    "timestamp=" + map.timestamp,
    "sign=" + sign,
    "sign_type=SHA256WithRSA",
  ].join("&");
  console.log("rawRequest = ", rawRequest);
  return rawRequest;
}

export const acceptActivityRequest = async (req, res) => {
  console.log(req.body);
  const fNameResult = firstNameJoi.validate(req.body.first_name);
  const lNameResult = lastNameJoi.validate(req.body.last_name);
  const phoneResult = phoneNumberJoi.validate(req.body.phone_number);
  const emailResult = emailJoi.validate(req.body.email);
  const currencyResult = currencyJoi.validate(req.body.currency);
  const locationResult = locationJoi.validate(req.body.location);
  const quantityResult = quantityJoi.validate(req.body.quantity);
  const reservationType = reservationTypeJoi.validate(req.body.reservationType);
  const ID = IDJoi.validate(req.body.ID);

  if (
    fNameResult.error ||
    lNameResult.error ||
    phoneResult.error ||
    emailResult.error ||
    currencyResult.error ||
    locationResult.error ||
    quantityResult.error ||
    reservationType.error ||
    ID.error
  ) {
    const error = {
      first_name: fNameResult.error ? fNameResult.error.message : null,
      last_name: lNameResult.error ? lNameResult.error.message : null,
      phone_number: phoneResult.error ? phoneResult.error.message : null,
      email: emailResult.error ? emailResult.error.message : null,
      currency: currencyResult.error ? currencyResult.error.message : null,
      location: locationResult.error ? locationResult.error.message : null,
      quantity: quantityResult.error ? quantityResult.error.message : null,
      reservation_Type: reservationType.error
        ? reservationType.error.message
        : null,
    };
    console.log(error);
    logger.info(error);

    return res.status(400).json({
      msg: "Invalid Request",
      error,
    });
  } else {
    try {
      var activityType = await ActivityPrice.findOne({
        where: {
          id: ID.value,
        },
      });

      if (activityType) {
        const activityPrice = activityType.price;
        const NumberOfGuest = req.body.quantity;
        var totalPrice = activityPrice * NumberOfGuest;
        var confirmation_code = generateUniqueId({
          length: 10,
          useLetters: true,
        });

        var txr_code = generateUniqueId({
          length: 12,
          useLetters: true,
        });

        var today = dateFunction(Date.now());
        try {
          await SuperAppActivityReserv.create({
            location: req.body.location,
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email,
            phone_number: req.body.phone_number,
            currency: req.body.currency,
            confirmation_code: confirmation_code,
            reservation_date: today,
            quantity: NumberOfGuest,
            price: totalPrice,
            tx_ref: txr_code,
            payment_method: "Super App",
            payment_status: "Unpaid",
            order_status: "Unconfirmed",
            package: activityType.name,
          });

          ///////// super App thingy /////////////////////////
          try {
            console.log("SUPER APP");
            logger.info("========= Super App ===========");
            let title = "Kuriftu " + req.body.reservationType;
            let amount = totalPrice;
            let applyFabricTokenResult = await applyFabricToken();
            let fabricToken = applyFabricTokenResult.token;
            let createOrderResult = await requestCreateOrder(
              fabricToken,
              title,
              amount,
              confirmation_code
            );
            console.log("PAYER ID ID", createOrderResult);
            logger.info(createOrderResult);

            let prepayId = createOrderResult.biz_content.prepay_id;
            // console.log("PAYER ID ID", createOrderResult);
            let rawRequest = createRawRequest(prepayId);
            console.log("RAW_REQ_Ebsa: ", rawRequest);
            logger.info("RAW_REQ");
            logger.info(rawRequest);
            res.send(rawRequest);
          } catch (err) {
            console.log(err);
            res.status(400).json({
              msg: "Error Telebirr Please try again",
            });
          }

          ///////////// IDK ///////////////////////////////
        } catch (err) {
          console.log(err);
          res.status(400).json({
            msg: "Error Signup User",
          });
        }
      } else {
        res.status(400).json({
          msg: "Multiple Activity Please Select One",
        });
      }
    } catch (err) {
      console.log(err);
      res.status(401).json({
        msg: "Uknown Activity",
        err,
      });
    }
  }
};
