import ActivityPrice from "../models/ActivityPrice.model";

export const test = async (req, res) => {
  const WaterParkPrice = await ActivityPrice.findAll({
    where: {
      location: "waterpark",
    },
  });

  console.log(WaterParkPrice[0].price);
  res.json(WaterParkPrice[0].price)
};
