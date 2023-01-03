
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
  const datas = req.query;

  const API_KEY = process.env.MAILGUN_API;
  const DOMAIN = process.env.DOMAIN;

  const mailgun = new Mailgun(formData);
  const client = mailgun.client({ username: "api", key: API_KEY });


  const dateFunction = (ts) => {
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    var final = year + "-" + month + "-" + date;
    return final;
  };;

  // var options = {
  //   method: "GET",
  //   url: "https://api.chapa.co/v1/transaction/verify/" + datas.trx_ref,
  //   headers: {
  //     Authorization: "Bearer " + process.env.CHAPA_API,
  //   },
  // };

  // request(options, function (error, response) {
  //   if (error) throw new Error(error);
  //   console.log(JSON.parse(response.body));
  //   console.log(response.body);
  // });
  const chapadata = req.body;
  // const sentfile = "/home/sam/kuriftu_reservation_nodejs/assets/images/qr_codes";
  const sentfile = "";

  console.log(chapadata);



  if (chapadata.status == 'success') {

    var ts_ref = chapadata.tx_ref;
    var event1 = await ActivityReserv.findAll({
      where: {
        tx_ref: ts_ref,
      }
    });
    var event = event1[0];
    // console.log("event", event);
    console.log("Fetch Finished");

    var qrdate = {
      first_name: event.frist_name,
      last_name: event.last_name,
      email: event.email,
      confirmation_code: event.confirmation_code,
      order_status: event.order_status,
    };
    var strData = JSON.stringify(strData);
    // event.confirmation_code = '12345';

    qr.toFile(
      sentfile + "/" + event.confirmation_code + ".png",
      "https://reservations.kurifturesorts.confirmation_com/login/" + event.confirmation_code,
      function (err, code) {
        if (err) return res.json({ msg: "Error generating QR Code" });
        console.log("QR Code generated");
      }
    );


    const filepath = sentfile + "/" + event.confirmation_code + ".png";
    const file = {
      filename: "sample.jpg",
      data: await fsPromises.readFile(filepath),
    };
    const attachment = [file];
    var qr_image = process.env.URL + '/qrimage/' + event.confirmation_code;
    // Email that is to be sent
    const emailSent = {
      from: "Kuriftu Water Park <postmaster@reservations.kurifturesorts.com>",
      to: event.email,
      subject: "Kuriftu Resort",
      attachment,
      template: "kuriftu_design",
      // template: "kuriftu_test",
      "v:fname": event.first_name + event.last_name,
      // "v:location": location,
      "v:email": event.email,
      "v:quantity": event.quantity,
      "v:reservation": 'Kuriftu WaterPark Reservation',
      "v:reservationDate": dateFunction(event.reservationDate),
      "v:confirmation": event.confirmation_code,
      "v:price": event.amount + " " + event.currency,
      "v:payment": 'Chapa',
      "v:image": qr_image,
      attachment
    };

    // Function that sends the email
    client.messages
      .create(DOMAIN, emailSent)
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.error(err);
      });

    res.json({ msg: 'succes' });




  }

};
