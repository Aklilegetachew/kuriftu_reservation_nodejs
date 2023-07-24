import https from "http";
const config = require("../config/config");
import request from "request";
const logger = require("../utils/logger");

function applyFabricToken(location) {
  logger.info(location);
  var fabricAppId;
  var appSecret;
  var merchantAppId;
  var merchantCode;
  var privateKey;
  var publicKey;
  if (location == "waterpark") {
    merchantAppId = config.wa_merchantAppId;
    // appSecret = config.wa_fabricAppSecreat;
    // fabricAppId = config.wa_fabricAppId;
    merchantCode = config.wa_merchantCode;
    // privateKey = config.wa_privateKey;
    // publicKey = config.wa_publicKey;
  } else if (location == "entoto") {
    merchantAppId = config.en_merchantAppId;
    // appSecret = config.en_fabricAppSecreat;
    // merchantAppId = config.en_fabricAppId;
    merchantCode = config.en_merchantCode;
    // privateKey = config.en_privateKey;
    // publicKey = config.en_publicKey;
  } else if (location == "bishoftu") {
    merchantAppId = config.bi_merchantAppId;
    // appSecret = config.bi_fabricAppSecreat;
    // fabricAppId = config.bi_fabricAppId;
    merchantCode = config.bi_merchantCode;
    // privateKey = config.bi_privateKey;
    // publicKey = config.bi_publicKey;
  } else if (location == "boston") {
    merchantAppId = config.bo_merchantAppId;
    // appSecret = config.bo_fabricAppSecreat;
    // fabricAppId = config.bo_fabricAppId;
    merchantCode = config.bo_merchantCode;
    // privateKey = config.bo_privateKey;
    // publicKey = config.bo_publicKey;
  } else {
   return Promise.reject({ message: `Invalid location ${location}`});
  }
  logger.info("Fabric and appSeacrt");
  logger.info(fabricAppId);
  logger.info(appSecret);
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": config.fabricAppKey,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: config.fabricAppSecreat,
      }),
    };
    console.log(options);
    logger.info(options);
    try {
      request(options, function (error, response) {
        // console.log("***********");
        // console.log("BODY", response);
        // console.log(typeof response.body);
        let result = JSON.parse(response.body);
        logger.info("result");
        logger.info(result);
        // console.log(result);
        // console.log("*****************");
        resolve(result);
      });
    } catch (err) {
      console.log("==========================================================");
      logger.info("err");
      logger.info(err);
    }
  });
}

module.exports = applyFabricToken;
