// import request from "request";
// import { Chapa } from "chapa-nodejs";

// export const test = async (req, res) => {
//   const chapa = new Chapa({
//     secretKey: process.env.CHAPPA_API,
//   });
//   //  var request = require('request');
//   const tx_ref = await chapa.generateTransactionReference({
//     prefix: "TX", // defaults to `TX`
//     size: 20, // defaults to `15`
//   });

//   var options = {
//     method: "POST",
//     url: "https://api.chapa.co/v1/transaction/initialize",
//     headers: {
//       Authorization: "Bearer CHASECK_TEST-2MBUcoLYAH4xPJZ8och3gYRLA4klhAg8",
//     },
//     formData: {
//       amount: "200",
//       currency: "ETB",
//       email: "nattynengeda@gmail.com",
//       first_name: "Natty",
//       last_name: "Engeda",
//       tx_ref: tx_ref,
//       callback_url: "http://localhost:8000/verifyChapa",

//     },
//   };

// axios.post('https://api.chapa.co/v1/transaction/initialize', {
//   headers: {
//     Authorization: "Bearer CHASECK_TEST-k1OznKI6893xmPpX6hCSWLU9uhn050Yp",
//   },
//   formData: {
//     amount: "100",
//     currency: "ETB",
//     email: "abebe@bikila.com",
//     first_name: "Abebe",
//     last_name: "Bikila",
//     tx_ref: tx_ref,
//     callback_url: "https://chapa.co",

//   },
// }).then(res => )

//   request(options, function async(error, response) {
//     if (error) throw new Error(error);
//     console.log(response.body);
//     var full_response = JSON.parse(response.body);
//     var check_out = full_response.data.checkout_url;
//     // res.json(check_out);
//     res.redirect(check_out);
//   });
// };

// import { Headers } from "request";
// import http from 'http';
// import fetch from "node-fetch";
// import Currency from "../models/Currency.model";
// const axios = require('axios');
// import axios, {isCancel, AxiosError} from 'axios';
// import
//  const fetch = require('node-fetch');
// const axios = require('axios');\
// const axios = require('axios')

// export const test = async (req, res) => {
//   const dateFunction = (datee) => {
//     let ts = Date.now();
//     let date_ob = new Date(datee);
//     let date = date_ob.getDate();
//     let month = date_ob.getMonth() + 1;
//     let year = date_ob.getFullYear();

//     var final = year + "-" + month + "-" + date;
//     return final;
//   };

//   const checkETB = await Currency.findAll({
//     limit: 1,
//     order: [["updatedAt", "DESC"]],
//   });
//   var outdate = dateFunction(Date.now());
//   var indate = dateFunction(checkETB[0].updatedAt);

//   if (outdate === indate) {
//     console.log("equal");
//   } else {
//     console.log("different");
//   }
// };

// import qr from "qrcode";

// const sentfile = "assets/images/qr_codes";


// export const test = async (req, res) => {

//   qr.toFile(
//     sentfile + "/1234as1d5.png",
//     "https://reservations.kurifturesorts.nfirmation_cocom/login/12345",
//     function (err, code) {
//       if (err) return res.json({ msg: "Error generating QR Code" });
//       console.log("QR Pass");
//     }
//   );

//   res.send("Hello");
// }

export const test = async(req, res) =>{
  var nowdate = new Date();
  nowdate.setMonth(nowdate.getMonth() + 2);

  res.send(nowdate);
}