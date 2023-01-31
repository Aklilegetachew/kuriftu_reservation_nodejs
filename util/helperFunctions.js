import Currency from "../models/Currency.model"
import fetch from "node-fetch"

export const convertToETB = async () => {
  var ETBPrice

  var checkETB = await Currency.findAll({
    limit: 1,
    order: [["updatedAt", "DESC"]],
  })

  if (checkETB.length === 0) {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain",
        apikey: "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD",
      },
    }

    await fetch(
      "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1",
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        // console.log(result);
        ETBPrice = JSON.parse(result).result
      })
      .catch(error => console.log("error", error))
    console.log("Price", ETBPrice)

    checkETB = await Currency.create({
      rate: ETBPrice,
    })
  }

  var todayDate = dateFunction(Date.now())
  var fetchDate = dateFunction(checkETB[0].updatedAt)

  console.log(todayDate, fetchDate)

  if (todayDate === fetchDate) {
    console.log("equal")
    ETBPrice = checkETB[0].rate
  } else {
    console.log("different")

    var requestOptions = {
      method: "GET",
      redirect: "follow",
      headers: {
        "Content-Type": "text/plain",
        apikey: "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD",
      },
    }

    await fetch(
      "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1",
      requestOptions
    )
      .then(response => response.text())
      .then(result => {
        // console.log(result);
        ETBPrice = JSON.parse(result).result
      })
      .catch(error => console.log("error", error))
    console.log("Price", ETBPrice)

    await Currency.create({
      rate: ETBPrice,
    })
  }

  return ETBPrice
}
