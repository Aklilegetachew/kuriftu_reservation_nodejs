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
import Currency from "../models/Currency.model";
import fetch from "node-fetch";

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
  var currency = req.body.currency;
  var payment_method = req.body.payment_method;
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
      location: "waterpark",
    },
  });

  const EntotoPrice = await ActivityPrice.findAll({
    where: {
      location: "entoto",
    },
  });

  var adultPrice = WaterParkPrice[0].price;
  var kidsPrice = WaterParkPrice[1].price;

  const sentfile = "assets/images/qr_codes";

  const dateFunction = (ts) => {
    let date_ob = new Date(ts);
    let date = date_ob.getDate();
    let month = date_ob.getMonth() + 1;
    let year = date_ob.getFullYear();

    var final = year + "-" + month + "-" + date;
    return final;
  };

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

        if (currency == "ETB") {
          const checkETB = await Currency.findAll({
            limit: 1,
            order: [["updatedAt", "DESC"]],
          });
          var ETBPrice;
          var todayDate = dateFunction(Date.now());
          var fetchDate = dateFunction(checkETB[0].updatedAt);
          console.log(todayDate, fetchDate);

          if (todayDate === fetchDate) {
            console.log("equal");
            ETBPrice = checkETB[0].rate;
          } else {
            console.log("different");

            var requestOptions = {
              method: "GET",
              redirect: "follow",
              headers: {
                "Content-Type": "text/plain",
                apikey: "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD",
              },
            };

            await fetch(
              "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1",
              requestOptions
            )
              .then((response) => response.text())
              .then((result) => {
                // console.log(result);
                ETBPrice = JSON.parse(result).result;
              })
              .catch((error) => console.log("error", error));
            console.log("Price", ETBPrice);

            await Currency.create({
              rate: ETBPrice,
            });
          }
          price = price * ETBPrice;
        }
        console.log(price);
        price = price.toFixed(2);

        const result = await ActivityReserv.create({
          fname: fname,
          location: location,
          email: email,
          phone_number: phone_number,
          confirmation_code: confirmation_code,
          reservation_date: reservationDate,
          currency: currency,
          payment_method: payment_method,
          payment_status: "unpaid",
          quantity: quantity,
          adult: adult,
          kids: kids,
          price: price,
          order_status: 'reserved',
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

        const template = `
          <div 
          style="width: 100%; background-color: grey; display: flex; flex-direction: column; justify-content: space-between;"
          >
              <div style="border:1px solid black; padding: 30px; background-color: white; box-shadow: 5, 5, 5, black;">
                  <h1>First Repo</h1>
              </div>
              <div style="border:1px solid black; padding: 30px; background-color: white; box-shadow: 5, 5, 5, black;">
                  <h1>Second Repo</h1>
              </div>
              <div style="border:1px solid black; padding: 30px; background-color: white; box-shadow: 5, 5, 5, black;">
                  <h1>Third Repo</h1>
              </div>
          </div>
          `;

        const emailSent = {
          from: "Kuriftu Water Park <postmaster@reservations.kurifturesorts.com>",
          to: email,
          subject: "Kuriftu Resort",
          template: "kuriftu_design",
          // html: template,
          // attachment: {data: file, filename: 'QRCODE'},
          "v:fname": fname,
          "v:location": location,
          "v:email": email,
          "v:quantity": quantity,
          "v:reservationDate": dateFunction(reservationDate),
          "v:confirmation": confirmation_code,
          "v:price": price + " " + currency,
          "v:payment": payment_method,
          "v:image": process.env.URL,
        };

        mg.messages().send(emailSent, function (error, body) {
          console.log(body);
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
