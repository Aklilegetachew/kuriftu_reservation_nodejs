import path from "path";
import fs from "fs";

export const qrimage = async (req, res) => {
  var id = req.params.id;
//   console.log(id);
  try {
  var dir = path.join('assets/images' + "/" + id + ".png");

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
  }
  res.send(dir);
};
