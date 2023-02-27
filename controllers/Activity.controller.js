// import ActivityLocation from "../models/ActivityLocation.model";
import ActivityPrice from "../models/ActivityPrice.model";
import ActivityReserv from "../models/ActivityReservation.model";

export const view_activity_price = async (req, res) => {
  try {
    const result = await ActivityPrice.findAll();
    console.log(result);
    res.json(result);
  } catch (error) {
    console.log(error);
  }
};

export const add_activity_price = async (req, res) => {
  const datas = req.body;

  try {
    await ActivityPrice.create({
      name: datas.name,
      price: datas.price,
      location: datas.location,
    });

    res.json({ msg: true });
  } catch (error) {
    console.log(error);
  }
};

export const view_activity_reservation = async (req, res) => {
  const location = req.body.location;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll();
      // result.forEach((item) => {
      //   try {
      //     item.amt = JSON.parse(item.amt);
      //     item.redeemed_amt = JSON.parse(item.redeemed_amt);
      //   } catch (error) {
      //     console.error(`Error parsing JSON data: ${error.message}`);
      //   }
      // })

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          location: location,
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const view_redemed_reservation = async (req, res) => {
  const location = req.body.location;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll({
        where: {
          order_status: "checked_in",
        },
      });
     
      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          location: location,
          order_status: "checked_in",
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};

export const view_unpaid_activity = async (req, res) => {
  const status = req.body.paymentStatus;
  try {
    if (location == "all") {
      const result = await ActivityReserv.findAll();
      // result.forEach((item) => {
      //   try {
      //     item.amt = JSON.parse(item.amt);
      //     item.redeemed_amt = JSON.parse(item.redeemed_amt);
      //   } catch (error) {
      //     console.error(`Error parsing JSON data: ${error.message}`);
      //   }
      // })

      res.json(result);
    } else {
      const result = await ActivityReserv.findAll({
        where: {
          payment_status: status,
        },
      });
      result.forEach((item) => {
        try {
          item.amt = JSON.parse(item.amt);
          item.redeemed_amt = JSON.parse(item.redeemed_amt);
        } catch (error) {
          console.error(`Error parsing JSON data: ${error.message}`);
        }
      });
      console.log(result);
      res.json(result);
    }
  } catch (error) {
    console.log(error);
  }
};
