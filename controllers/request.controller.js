import generateUniqueId from "generate-unique-id";
import Mailgun from "mailgun.js";
import mailgun from "mailgun-js";
import formData from "form-data";
import dotenv from "dotenv";
import pug from "pug";
import path, { join } from "path";
import qr from "qrcode";
import ActivityReserv from "../models/ActivityReservation.model";
import ActivityPrice from "../models/ActivityPrice.model";

// import template from '../templates/email.pug';

dotenv.config();

export const acceptRequest = async (req, res) => {
  const API_KEY = process.env.MAILGUN_API;
  const DOMAIN = process.env.DOMAIN;

  const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

  var location = req.body.location;
  var fname = req.body.fname;
  var reservationDate = new Date(req.body.reservationDate);
  var quantity = req.body.quantity;
  var email = req.body.email;
  var phone_number = req.body.phone_number;
  var confirmation_code = generateUniqueId({
    length: 8,
    useLetters: true,
  });
  var adult = req.body.adult;
  var kids = req.body.kids;
  var order_status = "reserved";
  var addons = req.body.addons;

  const WaterParkPrice = await ActivityPrice.findAll({
    where: {
      loation: "waterpark",
    },
  });

  // const

  var adultPrice = WaterParkPrice[0].price;
  var kidsPrice = WaterParkPrice[1].price;

  var image;
  const sentfile = "assets/images";

  try {
    if (location == "waterpark") {
      if (quantity > 10) {
        res.json({ msg: "quantity_greater_10" });
      } else {
        if (
          reservationDate.getDay() == 1 ||
          reservationDate.getDay() == 2 ||
          reservationDate.getDay() == 3 ||
          reservationDate.getDay() == 4 ||
          reservationDate.getDay() == 7
        ) {
          adultPrice;
          kidsPrice;
        } else if (
          reservationDate.getDay() == 5 ||
          reservationDate.getDay() == 6
        ) {
          adultPrice = adultPrice / 2;
          kidsPrice = kidsPrice / 2;
        }
        var price = adultPrice * adult + kidsPrice * kids;

        const result = await ActivityReserv.create({
          fname: fname,
          location: location,
          email: email,
          phone_number: phone_number,
          confirmation_code: confirmation_code,
          reservation_date: reservationDate,
          currency: currecnty,
          quantity: quantity,
          adult: adult,
          kids: kids,
          price: price,
          order_status: order_status,
          addons: addons,
        });

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

        const emailSent = {
          from: "Kuriftu Water Park <postmaster@reservations.kurifturesorts.com>",
          to: email,
          subject: "Kuriftu Resort",
          template: "kuriftu_design",
          // attachment: {data: sentfile},
          "v:fname": fname,
          "v:location": location,
          "v:email": email,
          "v:quantity": quantity,
          "v:reservationDate": reservationDate,
          "v:confirmation": confirmation_code,
          "v:price": price,
          "v:image": process.env.URL,
        };

        mg.messages().send(emailSent, function (error, body) {
          // console.log(body);
          console.log(sentfile);
          res.send("Email Sent");
        });
      }
    } else if (location == "entoto") {
    }
  } catch (error) {
    console.log(error);
  }
};
