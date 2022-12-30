
import request from "request";
import { Chapa } from "chapa-nodejs";
import pug from "pug";
import path, { join } from "path";
import qr from "qrcode";
import fsPromises from 'fs/promises';
import Mailgun from "mailgun.js";
import formData from "form-data";
import dotenv, { config } from "dotenv";

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
  const event = req.body;

  console.log(event);
  if (event.status == 'success') {

    var qrdate = {
      fname: fname,
      email: email,
      confirmation_code: confirmation_code,
      order_status: order_status,
    };
    var strData = JSON.stringify(strData);

    qr.toFile(
      sentfile + "/" + confirmation_code + ".png",
      "https://reservations.kurifturesorts.com/login/" + confirmation_code,
      function (err, code) {
        if (err) return res.json({ msg: "Error generating QR Code" });
      }
    );


    const filepath = sentfile + "/" + confirmation_code + ".png";
    const file = {
      filename: "sample.jpg",
      data: await fsPromises.readFile(filepath),
    };
    const attachment = [file];
    var qr_image = process.env.URL + '/' + confirmation_code;
    // Email that is to be sent
    const emailSent = {
      from: "Kuriftu Water Park <postmaster@reservations.kurifturesorts.com>",
      to: email,
      subject: "Kuriftu Resort",
      attachment,
      template: "kuriftu_design",
      // template: "kuriftu_test",
      "v:fname": fname,
      "v:location": location,
      "v:email": email,
      "v:quantity": quantity,
      "v:reservation": 'Kuriftu WaterPark Reservation',
      "v:reservationDate": dateFunction(reservationDate),
      "v:confirmation": confirmation_code,
      "v:price": price + " " + currency,
      "v:payment": payment_method,
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
