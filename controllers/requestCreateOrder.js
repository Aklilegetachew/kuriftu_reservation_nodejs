const tools = require("../utils/tools");
const config = require("../config/config");
import https from "http";
import request from "request";
const logger = require("../utils/logger");

function createMerchantOrderId(codetrx) {
  logger.info("========= trxNum ===========");
  logger.info(codetrx);

  return new Date().getTime() + "_" + codetrx;
}
function createRequestObject(title, amount, trxID) {
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://tickets.kurifturesorts.com/activity_confirmation",
    trade_type: "InApp",
    appid: config.merchantAppId,
    merch_code: config.merchantCode,
    merch_order_id: createMerchantOrderId("aaaaa"),
    title: title,
    total_amount: "" + amount + "",
    trans_currency: "ETB",
    timeout_express: "120m",
    payee_identifier: config.merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: "https://kurifturesorts.com/thankYou",
  };
  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log("===================", req);
  return req;
}

function requestCreateOrder(fabricToken, title, amount) {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount);

    console.log("Request Body", reqObject);

    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppId,
        Authorization: fabricToken,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify(reqObject),
    };

    try {
      request(options, function (error, response) {
        let result = JSON.parse(response.body);
        resolve(result);
      });
    } catch (err) {
      console.log("ANOTHER ERROR ", err);
    }
  });
}
module.exports = requestCreateOrder;
