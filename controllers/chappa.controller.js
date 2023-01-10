
import request from "request";
import { Chapa } from "chapa-nodejs";

export const recieveChapa = async (req, res) => {
  const datas = req.body;
  const chapa = new Chapa({
    secretKey: process.env.CHAPPA_API,
  });

  const tx_ref = await chapa.generateTransactionReference({
    prefix: "TX", // defaults to `TX`
    size: 20, // defaults to `15`
  });
  try {
    const response = await chapa.initialize({
      first_name: datas.fname,
      last_name: datas.lname,
      email: datas.email,
      currency: datas.currency,
      amount: datas.amount,
      tx_ref: tx_ref,
      callback_url: "http://localhost:8000/verifyChapa",
      return_url: "https://chapa.co",
      customization: {
        title: "Test Title",
        description: "This is a Test Description",
      },
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};


import ActivityReserv from "../models/ActivityReservation.model";
>>>>>>> ae1fdd1891971b4bc6bee851801bc1753eefe1c7

dotenv.config();

export const verifyChapa = async (req, res) => {
  // console.log(req.query);
  const datas = req.query;
  var options = {
    method: "GET",
    url: "https://api.chapa.co/v1/transaction/verify/" + datas.trx_ref,
    headers: {
      Authorization: "Bearer CHASECK_TEST-2MBUcoLYAH4xPJZ8och3gYRLA4klhAg8",
    },
  };

  request(options, function (error, response) {
    if (error) throw new Error(error);
    console.log(JSON.parse(response.body));
  });
};
