import path from "path";
import fs from "fs";
import dotenv, { config } from "dotenv";

dotenv.config();

export const qrimage = async (req, res) => {
  const sentfile = process.env.QR_HOME;

  var id = req.params.id;
  console.log(id);
  try {
    var dir = path.join(sentfile + "/" + id + ".png");
    // var dir = path.join(__dirname + "/image.jpg");

    var mime = {
      html: "text/html",
      txt: "text/plain",
      css: "text/css",
      gif: "image/gif",
      jpg: "image/jpeg",
      png: "image/png",
      svg: "image/svg+xml",
      js: "application/javascript",
    };

    res.writeHead(200, { "Content-type": "image/jpeg" });
    fs.createReadStream(dir).pipe(res);
  } catch (error) {
    console.log(error);
    res.json(error);
  }
  //   res.send(dir);
};
