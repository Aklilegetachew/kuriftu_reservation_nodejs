import generateUniqueId from "generate-unique-id";
import dotenv from "dotenv";
import JoiPhoneNumber from "joi-phone-number";
import ActivityReserv from "../models/ActivityReservation.model";
import ActivityPrice from "../models/ActivityPrice.model";
import request from "request";
import Currency from "../models/Currency.model";
import fetch from "node-fetch";
import { Chapa } from "chapa-nodejs";
import entotoPackage from "../models/entotoPrice.model";
import moment from "moment-timezone";
import { response } from "express";
import Joi from "joi";
import SuperAppActivityReserv from "../models/allActivityReservation.model";
// import { convertToETB } from "../util/helperFunctions"
// import template from '../templates/email.pug';

const customPhone = Joi.extend(JoiPhoneNumber);
const firstNameJoi = Joi.string().alphanum().min(3).max(30).required();
const lastNameJoi = Joi.string().alphanum().min(3).max(30).required();
const phoneNumberJoi = customPhone.string().phoneNumber().required();
const emailJoi = Joi.string().email({ minDomainSegments: 2 }).required();
const currencyJoi = Joi.string().required();
const locationJoi = Joi.string().required();
const reservationType = Joi.string().optional();
const quantityJoi = Joi.number().optional();

const dateFunction = (ts) => {
  let date_ob = new Date(ts);
  let date = date_ob.getDate();
  let month = date_ob.getMonth() + 1;
  let year = date_ob.getFullYear();

  var final = year + "-" + month + "-" + date;
  return final;
};

export const acceptActivityRequest = async (req, res) => {
  const fNameResult = firstNameJoi.validate(req.body.first_name);
  const lNameResult = lastNameJoi.validate(req.body.last_name);
  const phoneResult = phoneNumberJoi.validate(req.body.phone_number);
  const emailResult = emailJoi.validate(req.body.email);
  const currencyResult = currencyJoi.validate(req.body.currency);
  const locationResult = locationJoi.validate(req.body.location);
  const quantityResult = quantityJoi.validate(req.body.quantity);
  const reservationType = reservationType.validate(req.body.reservationType);

  if (
    fNameResult.error ||
    lNameResult.error ||
    phoneResult.error ||
    emailResult.error ||
    currencyResult.error ||
    locationResult.error ||
    quantityResult.error ||
    reservationType.error
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
    return res.status(400).json({
      msg: "Invalid Request",
      error,
    });
  } else {
    try {
      var activityType = ActivityPrice.findAll({
        where: {
          name: req.body.reservationType,
          location: req.body.location,
        },
      });

      if (activityType.length == 1) {
        const activityPrice = activityType.price;
        const NumberOfGuest = req.body.quantity;
        var totalPrice = activityPrice * NumberOfGuest;
        var confirmation_code = generateUniqueId({
          length: 8,
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
          });

          ///////// super App thingy /////////////////////////



          ///////////// IDK ///////////////////////////////
        } catch (err) {
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
      res.status(400).json({
        msg: "Uknown Activity",
        err,
      });
    }
  }
};
