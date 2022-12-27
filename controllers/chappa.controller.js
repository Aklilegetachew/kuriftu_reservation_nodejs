import { Chapa } from "chapa-nodejs";

export const recieveChappa = async (req, res) => {
  const chapa = new Chapa({
    secretKey: "CHASECK_TEST-k1OznKI6893xmPpX6hCSWLU9uhn050Yp",
  });

  const tx_ref = await chapa.generateTransactionReference({
    prefix: "TX", // defaults to `TX`
    size: 20, // defaults to `15`
  });
  try {
    const response = await chapa.initialize({
      first_name: "Jhon",
      last_name: "Doe",
      email: "john@gmail.com",
      currency: "ETB",
      amount: "200",
      tx_ref: tx_ref,
      callback_url: "https://chapa.co",
      return_url: "https://chapa.co",
      customization: {
        title: "Test Title",
        description: "This is a Test Description",
      },
    });

    console.log(response);
  } catch (error) {
    console.log(error);
  }
};
