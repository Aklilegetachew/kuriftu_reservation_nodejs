import ActivityReserv from "../models/ActivityReservation.model";
import path from "path";
import qr from "qrcode";

export const test = async (req, res) => {
  const sentfile = 'assets/images';
  console.log(sentfile);

  // qr.toDataURL("strData", function (err, code) {
  //   if (err) return console.log("error occurred");

  //   console.log(code);
  //   // image = code;
  // });

  // qr.toString("strData", { type: "terminal" }, function (err, code) {
  //   if (err) return console.log("error occurred");

  //   console.log(code);
  // });

  qr.toFile(
    sentfile + "/natty.png",
    "https://nattyengeda.github.io",
    // {
    //   color: {
    //     dark: "#00F",
    //     light: "#0000",
    //   },
    // },
    function (err, code) {
      if (err) return console.log(err, "error occured");

      console.log(code);
      console.log(sentfile);
    }
  );

  res.send(sentfile);
};
