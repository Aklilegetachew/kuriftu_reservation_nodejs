
import request from "request";
import { Chapa } from "chapa-nodejs";
import pug from "pug";
import path, { join } from "path";
import qr from "qrcode";
import fsPromises from 'fs/promises';
import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv, { config } from "dotenv";

import ActivityReserv from "../models/ActivityReservation.model";

dotenv.config();

export const verifyChapa = async (req, res) => {

  const API_KEY = process.env.MAILGUN_API;
  const DOMAIN = process.env.DOMAIN;

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "api", key: API_KEY });

  const dateFunction = (ts) => {
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    var final = date + "-" + month + "-" + year;
    return final;
  };

  const datas = req.query;
  const chapaInData = req.body.tx_ref;

  const chapadata = req.body;
  const sentfile = process.env.QR_HOME;

  console.log(chapaInData);

  var options = {
    'method': 'GET',
    'url': 'https://api.chapa.co/v1/transaction/verify/' + chapaInData,
    'headers': {
      'Authorization': 'Bearer ' + process.env.CHAPA_API,
    }
  };
  request(options, async function (error, response) {
    if (error) throw new Error(error);
    // console.log(response.body);
    var verChapa = JSON.parse(response.body);
    // console.log(verChapa);
    console.log("Verification Finished");
    if (verChapa.status === 'success') {

      var new_tx_ref = verChapa.data.tx_ref;
      var user = await ActivityReserv.findAll({
        where: {
          tx_ref: new_tx_ref,
        }
      });
      user = user[0];
      console.log("USER", user);

      if (user.email_sent == 0) {
        console.log("Fetch Finished");


        qr.toFile(
          sentfile + "/" + user.confirmation_code + ".png", user.confirmation_code,
          async function (err, code) {
            if (err) return res.json({ msg: "Error generating QR Code" });
            console.log("QR Code generated");

            var attachment;
            const filepath = sentfile + "/" + user.confirmation_code + ".png";
            const file = {
              filename: "confirmation.jpg",
              data: await fsPromises.readFile(filepath),
            };
            attachment = [file];

            console.log("After QR Creation");

            // var qr_image = process.env.URL + '/qrimage/' + event.confirmation_code;
            // Email that is to be sent
            // var reservation_date = dateFunction(user)
            var from, subject
            if (user.location == 'waterpark') {
              from = "Kuriftu Water Park"
              subject = "Kuriftu Water Park ticket Reservation"
            } else if (user.location == 'entoto') {
              from = "Kuriftu Resort and Spa Entoto"
              subject = "Kuriftu Resort and Spa Entoto ticket Reservation"
            }

            const emailSent = {
              from: from + "<no-reply@reservations.kurifturesorts.com>",
              to: user.email,
              subject: subject,
              attachment,
              template: "kuriftu_design",
              // template: "kuriftu_test",
              "v:fname": user.first_name + " " + user.last_name,
              // "v:location": location,
              "v:email": user.email,
              "v:quantity": user.quantity,
              "v:reservation": subject,
              "v:reservationDate": user.reservation_date,
              "V:expirationDate": "After 2 months from the purchase date",
              "v:confirmation": user.confirmation_code,
              "v:price": user.price + " " + user.currency,
              "v:payment": 'Chapa',
              // "v:image": qr_image,
              attachment
            };
            console.log("Expiration Date", dateFunction(user.reservation_date.setMonth(user.reservation_date.getMonth() + 2),),);

            // Function that sends the email
            client.messages
              .create(DOMAIN, emailSent)
              .then((res) => {
                console.log(res);
              })
              .catch((err) => {
                console.error(err);
              });
            console.log("Email Sent");
            await ActivityReserv.update({
              payment_status: 'paid',
              email_sent: true,
            }, {
              where: {
                confirmation_code: user.confirmation_code
              }
            });
            res.sendStatus(200);
          }
        );
      } else {
        console.log("Email Already Sent");
        res.sendStatus(200);
      }
    } else {
      console.log("Chapa Verification Failed");
    }

  });

};

export const returnChappa = async (req, res) => {

  console.log("Chappa Return URL");
  res.send("Chappa Return URL");

}
