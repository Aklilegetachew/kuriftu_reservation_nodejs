import generateUniqueId from "generate-unique-id";
import dotenv from "dotenv";

import ActivityReserv from "../models/ActivityReservation.model";
import ActivityPrice from "../models/ActivityPrice.model";
import Currency from "../models/Currency.model";
import fetch from "node-fetch";
import request from "request";
import { Chapa } from "chapa-nodejs";



// import template from '../templates/email.pug';

dotenv.config();

export const acceptRequest = async (req, res) => {
  console.log(req.body);
  const CHAPA_API = process.env.CHAPA_API;


  // const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

  const chapa = new Chapa({
    secretKey: CHAPA_API,
  });


  var location = req.body.location;
  var first_name = req.body.first_name;
  var last_name = req.body.last_name;
  var reservationDate = new Date(req.body.date);
  var quantity = req.body.quantity;
  var email = req.body.email;
  var phone_number = req.body.phone_number;
  var currency = req.body.currency;
  var payment_method = 'chapa';
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

  // const EntotoPrice = await ActivityPrice.findAll({
  //   where: {
  //     location: "entoto",
  //   },
  // });

  var adultPrice = WaterParkPrice[0].price;
  var kidsPrice = WaterParkPrice[1].price;


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
      console.log("here")
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
          var checkETB = await Currency.findAll({
            limit: 1,
            order: [["updatedAt", "DESC"]],
          });

          if (checkETB.length === 0) {
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

            checkETB = await Currency.create({
              rate: ETBPrice,
            });
          }

          var ETBPrice;
          var todayDate = dateFunction(Date.now());
          var fetchDate = dateFunction(checkETB[0].updatedAt);

          console.log(todayDate, fetchDate);

          if (todayDate === fetchDate) {
            console.log("equal");
            ETBPrice = checkETB[0].rate;
          }
          else {
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

        const tx_ref = await chapa.generateTransactionReference({
          prefix: "TX", // defaults to `TX`
          size: 20, // defaults to `15`
        });

        const result = await ActivityReserv.create({
          first_name: first_name,
          last_name: last_name,
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
          tx_ref: tx_ref,
          order_status: "reserved",
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
      }
    } else if (location == "entoto") {
    }
  } catch (error) {
    console.log(error);
  }
};
