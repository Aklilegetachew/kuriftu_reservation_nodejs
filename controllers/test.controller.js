import qr from "qrcode";

export const test = async (req, res) => {

 const sentfile = process.env.QR_HOME;
  qr.toFile(
    sentfile + "/Hello2.png",
    process.env.CHECK_URL + "1234",
    async function (err, code) {
      if (err) return res.json({ msg: "Error generating QR Code", err: err });
      console.log("QR Code generated");
      res.send("QR Generated");
    })
};
