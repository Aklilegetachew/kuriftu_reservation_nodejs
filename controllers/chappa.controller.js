const filepath = sentfile + "/" + event.confirmation_code + ".png";
const file = {
  filename: "sample.jpg",
  data: await fsPromises.readFile(filepath),
};
const attachment = [file];
var qr_image = process.env.URL + "/qrimage/" + event.confirmation_code;
// Email that is to be sent
const emailSent = {
  from: "Kuriftu Water Park <postmaster@reservations.kurifturesorts.com>",
  to: event.email,
  subject: "Kuriftu Resort",
  attachment,
  template: "kuriftu_design",
  // template: "kuriftu_test",
  "v:fname": event.first_name + event.last_name,
  // "v:location": location,
  "v:email": event.email,
  "v:quantity": event.quantity,
  "v:reservation": "Kuriftu WaterPark Reservation",
  "v:reservationDate": dateFunction(event.reservationDate),
  "v:confirmation": event.confirmation_code,
  "v:price": event.amount + " " + event.currency,
  "v:payment": "Chapa",
  "v:image": qr_image,
  attachment,
};

// Function that sends the email
client.messages
  .create(DOMAIN, emailSent)
  .then((res) => {
    console.log(res);
  })
  .catch((err) => {
    console.error(err);
  });

res.json({ msg: "succes" });
