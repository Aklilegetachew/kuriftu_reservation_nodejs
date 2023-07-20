// Set your own secrates here!
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  baseUrl: process.env.BASEURL,
  old_fabricAppId: process.env.FABRICAPPID,
  old_appSecret: process.env.APPSECRET,
  old_merchantAppId: process.env.MERCHANTAPPID,
  old_merchantCode: process.env.MERCHANTCODE,
  old_privateKey: process.env.PRIVATEKEY,
  old_publicKey: process.env.PUBLICKEY,

  // entoto credentials
  en_fabricAppId: process.env.EN_FABRICAPPID,
  en_appSecret: process.env.EN_APPSECRET,
  en_merchantAppId: process.env.EN_MERCHANTAPPID,
  en_merchantCode: process.env.EN_MERCHANTCODE,
  en_privateKey: process.env.PRIVATEKEY,
  en_publicKey: process.env.PUBLICKEY,

  // bishoftu credentials
  bi_fabricAppId: process.env.BI_FABRICAPPID,
  bi_appSecret: process.env.BI_APPSECRET,
  bi_merchantAppId: process.env.BI_MERCHANTAPPID,
  bi_merchantCode: process.env.BI_MERCHANTCODE,
  bi_privateKey: process.env.PRIVATEKEY,
  bi_publicKey: process.env.PUBLICKEY,

  // Boston credentials
  bo_fabricAppId: process.env.BO_FABRICAPPID,
  bo_appSecret: process.env.BO_APPSECRET,
  bo_merchantAppId: process.env.BO_MERCHANTAPPID,
  bo_merchantCode: process.env.BO_MERCHANTCODE,
  bo_privateKey: process.env.PRIVATEKEY,
  bo_publicKey: process.env.PUBLICKEY,

  // WATER PARK credentials
  wa_fabricAppId: process.env.WA_FABRICAPPID,
  wa_appSecret: process.env.WA_APPSECRET,
  wa_merchantAppId: process.env.WA_MERCHANTAPPID,
  wa_merchantCode: process.env.WA_MERCHANTCODE,
  wa_privateKey: process.env.PRIVATEKEY,
  wa_publicKey: process.env.PUBLICKEY,
};
