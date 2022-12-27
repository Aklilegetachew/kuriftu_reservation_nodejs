// import request from "request";
// import { Chapa } from "chapa-nodejs";

// export const test = async (req, res) => {
//   const chapa = new Chapa({
//     secretKey: "CHASECK_TEST-k1OznKI6893xmPpX6hCSWLU9uhn050Yp",
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
//       Authorization: "Bearer CHASECK_TEST-k1OznKI6893xmPpX6hCSWLU9uhn050Yp",
//     },
//     formData: {
//       amount: "100",
//       currency: "ETB",
//       email: "nattynengeda@gmail.com",
//       first_name: "Natty",
//       last_name: "Engeda",
//       tx_ref: tx_ref,
//       callback_url: "http://localhost:8000/index",

//     },
//   };

//   // axios.post('https://api.chapa.co/v1/transaction/initialize', {
//   //   headers: {
//   //     Authorization: "Bearer CHASECK_TEST-k1OznKI6893xmPpX6hCSWLU9uhn050Yp",
//   //   },
//   //   formData: {
//   //     amount: "100",
//   //     currency: "ETB",
//   //     email: "abebe@bikila.com",
//   //     first_name: "Abebe",
//   //     last_name: "Bikila",
//   //     tx_ref: tx_ref,
//   //     callback_url: "https://chapa.co",

//   //   },
//   // }).then(res => )

//   request(options, function (error, response) {
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
import fetch from "node-fetch";
// const axios = require('axios');
// import axios, {isCancel, AxiosError} from 'axios';
// import 
//  const fetch = require('node-fetch');
// const axios = require('axios');\
// const axios = require('axios')

export const test = async (req, res) => {
  // var header = new Headers();
  var myHeaders = { 'apikey': "LTihJp3B4eDMs0JZQE1acsH4y4Iq15oh" };
  //  myHeaders.append("apikey", "LTihJp3B4eDMs0JZQE1acsH4y4Iq15oh");

  var requestOptions = {
    method: "GET",
    redirect: "follow",
    headers: {
      "Content-Type": "text/plain",
      "apikey": "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD"
    },
  };

  fetch(
    "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1",
    requestOptions
  )
    .then((response) => response.text())
    .then((result) => {
     var ETBPrice = JSON.parse(result).result;
     console.log(ETBPrice)
    })
    .catch((error) => console.log("error", error));
};
