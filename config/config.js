// Set your own secrates here!
import dotenv from "dotenv";
dotenv.config();

module.exports = {
  baseUrl: process.env.BASEURL,
  privateKey: process.env.PRIVATEKEY,
  publicKey: process.env.PUBLICKEY,
  fabricAppKey: process.env.FEBRICAPPKEY,
  fabricAppSecreat: process.env.FEBRICAPPSECRET,

  // entoto credentials
  en_merchantAppId: process.env.EN_MERCHANTAPPID,
  en_fabricAppSecreat: process.env.EN_FEBRICAPPSECRET,
  en_fabricAppId: process.env.EN_FEBRICAPPKEY,
  en_merchantCode: process.env.EN_MERCHANTCODE,
  en_privateKey: process.env.PRIVATEKEY,
  en_publicKey: process.env.PUBLICKEY,

  // bishoftu credentials
  bi_merchantAppId: process.env.BI_MERCHANTAPPID,
  bi_fabricAppSecreat: process.env.BI_FEBRICAPPSECRET,
  bi_fabricAppId: process.env.BI_FEBRICAPPKEY,
  bi_merchantCode: process.env.BI_MERCHANTCODE,
  bi_privateKey: process.env.PRIVATEKEY,
  bi_publicKey: process.env.PUBLICKEY,

  // Boston credentials
  bo_merchantAppId: process.env.BO_MERCHANTAPPID,
  bo_fabricAppSecreat: process.env.BO_FEBRICAPPSECRET,
  bo_fabricAppId: process.env.BO_FEBRICAPPKEY,
  bo_merchantCode: process.env.BO_MERCHANTCODE,
  bo_privateKey: process.env.PRIVATEKEY,
  bo_publicKey: process.env.PUBLICKEY,

  // WATER PARK credentials
  wa_merchantAppId: process.env.WA_MERCHANTAPPID,
  wa_fabricAppSecreat: process.env.WA_FEBRICAPPSECRET,
  wa_fabricAppId: process.env.WA_FEBRICAPPKEY,
  wa_merchantCode: process.env.WA_MERCHANTCODE,
  wa_privateKey: process.env.PRIVATEKEY,
  wa_publicKey: process.env.PUBLICKEY,
};


// fabric app id => merchant appId
// merchantAppId => FabricAppId 
// app secreat => WA_FEBRICAPPSECRET