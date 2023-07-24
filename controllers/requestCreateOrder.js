const tools = require("../utils/tools");
const config = require("../config/config");
import https from "http";
import request from "request";
const logger = require("../utils/logger");

function createMerchantOrderId(codx) {
  logger.info("========= trxNum 1 ===========");
  logger.info(codx);

  return new Date().getTime() + "$" + codx;
}
function createRequestObject(title, amount, trxID, location) {
  let fabricAppId;
  let appSecret;
  let merchantAppId;
  let merchantCode;
  let privateKey;
  let publicKey;
  if (location == "waterpark") {
    merchantAppId = config.wa_merchantAppId;
    appSecret = config.wa_fabricAppSecreat;
    fabricAppId = config.wa_fabricAppId;
    merchantCode = config.wa_merchantCode;
    privateKey = config.wa_privateKey;
    publicKey = config.wa_publicKey;
  } else if (location == "entoto") {
    fabricAppId = config.en_fabricAppId;
    appSecret = config.en_appSecret;
    merchantAppId = config.en_merchantAppId;
    merchantCode = config.en_merchantCode;
    privateKey = config.en_privateKey;
    publicKey = config.en_publicKey;
  } else if (location == "bishoftu") {
    fabricAppId = config.bi_fabricAppId;
    appSecret = config.bi_appSecret;
    merchantAppId = config.bi_merchantAppId;
    merchantCode = config.bi_merchantCode;
    privateKey = config.bi_privateKey;
    publicKey = config.bi_publicKey;
  } else if (location == "boston") {
    merchantAppId = config.bo_merchantAppId;
    appSecret = config.bo_fabricAppSecreat;
    fabricAppId = config.bo_fabricAppId;
    merchantCode = config.bo_merchantCode;
    privateKey = config.bo_privateKey;
    publicKey = config.bo_publicKey;
  } else {
    fabricAppId = config.old_fabricAppId;
    appSecret = config.old_appSecret;
    merchantAppId = config.old_merchantAppId;
    merchantCode = config.old_merchantCode;
    privateKey = config.old_privateKey;
    publicKey = config.old_publicKey;
  }
  let req = {
    timestamp: tools.createTimeStamp(),
    nonce_str: tools.createNonceStr(),
    method: "payment.preorder",
    version: "1.0",
  };
  let biz = {
    notify_url: "https://www.tickets.kurifturesorts.com/activity_confirmation",
    trade_type: "InApp",
    appid: merchantAppId,
    merch_code: merchantCode,
    merch_order_id: trxID,
    title: title,
    total_amount: "" + amount + "",
    trans_currency: "ETB",
    timeout_express: "120m",
    payee_identifier: merchantCode,
    payee_identifier_type: "04",
    payee_type: "5000",
    redirect_url: "https://kurifturesorts.com/Thankyou2",
  };

  req.biz_content = biz;
  req.sign = tools.signRequestObject(req);
  req.sign_type = "SHA256WithRSA";
  console.log("===================", req);
  return req;
}

function requestCreateOrder(fabricToken, title, amount, trxNo, location) {
  return new Promise((resolve) => {
    let reqObject = createRequestObject(title, amount, trxNo, location);
    let fabricAppId;
    let appSecret;
    let merchantAppId;
    let merchantCode;
    let privateKey;
    let publicKey;
    if (location == "waterpark") {
      merchantAppId = config.wa_merchantAppId;
      appSecret = config.wa_fabricAppSecreat;
      fabricAppId = config.wa_fabricAppId;
      merchantCode = config.wa_merchantCode;
      privateKey = config.wa_privateKey;
      publicKey = config.wa_publicKey;
    } else if (location == "entoto") {
      fabricAppId = config.en_fabricAppId;
      appSecret = config.en_appSecret;
      merchantAppId = config.en_merchantAppId;
      merchantCode = config.en_merchantCode;
      privateKey = config.en_privateKey;
      publicKey = config.en_publicKey;
    } else if (location == "bishoftu") {
      fabricAppId = config.bi_fabricAppId;
      appSecret = config.bi_appSecret;
      merchantAppId = config.bi_merchantAppId;
      merchantCode = config.bi_merchantCode;
      privateKey = config.bi_privateKey;
      publicKey = config.bi_publicKey;
    } else if (location == "boston") {
      merchantAppId = config.bo_merchantAppId;
    appSecret = config.bo_fabricAppSecreat;
    fabricAppId = config.bo_fabricAppId;
    merchantCode = config.bo_merchantCode;
    privateKey = config.bo_privateKey;
    publicKey = config.bo_publicKey;
    } else {
      fabricAppId = config.old_fabricAppId;
      appSecret = config.old_appSecret;
      merchantAppId = config.old_merchantAppId;
      merchantCode = config.old_merchantCode;
      privateKey = config.old_privateKey;
      publicKey = config.old_publicKey;
    }
    console.log("Request Body", reqObject);

    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/merchant/preOrder",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": fabricAppId,
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
