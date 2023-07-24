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
  logger.info("Fabric and appSeacrt");
  logger.info(fabricAppId);
  logger.info(appSecret);
  return new Promise((resolve, reject) => {
    var options = {
      method: "POST",
      url: config.baseUrl + "/payment/v1/token",
      headers: {
        "Content-Type": "application/json",
        "X-APP-Key": fabricAppId,
      },
      rejectUnauthorized: false, //add when working with https sites
      requestCert: false, //add when working with https sites
      agent: false, //add when working with https sites
      body: JSON.stringify({
        appSecret: appSecret,
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
