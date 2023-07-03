// Set your own secrates here!
import dotenv from "dotenv";
dotenv.config();

module.exports = {
    baseUrl: process.env.BASEURL,
    fabricAppId:process.env.FABRICAPPID,
    appSecret: process.env.APPSECRET,
    merchantAppId: process.env.MERCHANTAPPID,
    merchantCode: process.env.MERCHANTCODE,
    privateKey: process.env.PRIVATEKEY,
    publicKey: process.env.PUBLICKEY
  };
  

  