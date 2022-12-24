// import ActivityLocation from "../models/ActivityLocation.model";
import ActivityPrice from "../models/ActivityPrice.model";

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
