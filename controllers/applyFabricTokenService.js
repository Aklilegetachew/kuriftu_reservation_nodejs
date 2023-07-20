import https from "http";
const config = require("../config/config");
import request from "request";
const logger = require("../utils/logger");

function applyFabricToken(location) {
  logger.info(location);
  if (location == "waterpark") {
    const fabricAppId = config.wa_fabricAppId;
    const appSecret = config.wa_appSecret;
    const merchantAppId = config.wa_merchantAppId;
    const merchantCode = config.wa_merchantCode;
    const privateKey = config.wa_privateKey;
    const publicKey = config.wa_publicKey;
  } else if (location == "entoto") {
    const fabricAppId = config.en_fabricAppId;
    const appSecret = config.en_appSecret;
    const merchantAppId = config.en_merchantAppId;
    const merchantCode = config.en_merchantCode;
    const privateKey = config.en_privateKey;
    const publicKey = config.en_publicKey;
  } else if (location == "bishoftu") {
    const fabricAppId = config.bi_fabricAppId;
    const appSecret = config.bi_appSecret;
    const merchantAppId = config.bi_merchantAppId;
    const merchantCode = config.bi_merchantCode;
    const privateKey = config.bi_privateKey;
    const publicKey = config.bi_publicKey;
  } else if (location == "boston") {
    const fabricAppId = config.bo_fabricAppId;
    const appSecret = config.bo_appSecret;
    const merchantAppId = config.bo_merchantAppId;
    const merchantCode = config.bo_merchantCode;
    const privateKey = config.bo_privateKey;
    const publicKey = config.bo_publicKey;
  } else {
    const fabricAppId = config.old_fabricAppId;
    const appSecret = config.old_appSecret;
    const merchantAppId = config.old_merchantAppId;
    const merchantCode = config.old_merchantCode;
    const privateKey = config.old_privateKey;
    const publicKey = config.old_publicKey;
  }
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
        // console.log(result);
        // console.log("*****************");
        resolve(result);
      });
    } catch (err) {
      console.log("==========================================================");
    }
  });
}

module.exports = applyFabricToken;
