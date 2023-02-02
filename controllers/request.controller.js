import generateUniqueId from "generate-unique-id"
import dotenv from "dotenv"

import ActivityReserv from "../models/ActivityReservation.model"
import ActivityPrice from "../models/ActivityPrice.model"
import request from "request"
import Currency from "../models/Currency.model"
import fetch from "node-fetch"
import { Chapa } from "chapa-nodejs"
import entotoPackage from "../models/entotoPrice.model"
import moment from "moment-timezone"
import { response } from "express"
// import { convertToETB } from "../util/helperFunctions"
// import template from '../templates/email.pug';

dotenv.config()

const dateFunction = ts => {
  let date_ob = new Date(ts)
  let date = date_ob.getDate()
  let month = date_ob.getMonth() + 1
  let year = date_ob.getFullYear()

  var final = year + "-" + month + "-" + date
  return final
}

export const acceptRequest = async (req, res) => {
  // console.log(req.body)
  const CHAPA_API = process.env.CHAPA_API

  // const mg = mailgun({ apiKey: API_KEY, domain: DOMAIN });

  const chapa = new Chapa({
    secretKey: CHAPA_API,
  })

  var location = req.body.location
  var first_name = req.body.first_name
  var last_name = req.body.last_name
  var email = req.body.email
  var phone_number = req.body.phone_number
  var currency = req.body.currency
  var payment_method = req.body.payment_method
  var confirmation_code = generateUniqueId({
    length: 8,
    useLetters: true,
  })
  var price

  if (currency == "ETB") {
    var checkETB = await Currency.findAll({
      limit: 1,
      order: [["updatedAt", "DESC"]],
    })
    // console.log(checkETB.length)

    if (checkETB.length === 0) {
      var requestOptions = {
        method: "GET",
        redirect: "follow",
        headers: {
          "Content-Type": "text/plain",
          apikey: "m8pYh6zWnmUXPvxwRTVbrtqNtOqvR2xD",
        },
      }
      var ETBPrice

      await fetch(
        "https://api.apilayer.com/currency_data/convert?to=ETB&from=USD&amount=1",
        requestOptions
      )
        .then(response => response.text())
        .then(result => {
          // console.log(JSON.parse(result).result)
          ETBPrice = JSON.parse(result).result
        })
        .catch(error => console.log("error", error))
      // console.log("Price", ETBPrice)

      checkETB = await Currency.create({
        rate: ETBPrice,
      })
    }

    var todayDate = dateFunction(Date.now())
    var fetchDate = dateFunction(checkETB[0].updatedAt)

    // console.log(todayDate, fetchDate)

    if (todayDate === fetchDate) {
      // console.log("equal")
      ETBPrice = checkETB[0].rate
    } else {
      // console.log("different")

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
      // console.log("Price", ETBPrice)

      const nowValue = await Currency.findAll()

      await Currency.update(
        {
          rate: ETBPrice,
        },
        {
          where: {
            id: nowValue[0].id,
          },
        }
      )
    }
    price = ETBPrice
  } else if (currency == "USD") {
    price = 1
  }
  console.log("Price", price)

  try {
    if (location == "waterpark") {
      const quantity = req.body.quantity
      const reservationDate = req.body.reservation_date
      const adult = req.body.adult
      const kids = req.body.kids
      const WaterParkPrice = await ActivityPrice.findAll({
        where: {
          location: "waterpark",
        },
      })

      var adultPrice = WaterParkPrice[0].price
      var kidsPrice = WaterParkPrice[1].price

      console.log("here")
      if (quantity > 10) {
        res.json({ msg: "quantity_greater_10" })
      } else {
        if (reservationDate == "weekdays") {
          adultPrice = adultPrice / 2
          kidsPrice = kidsPrice / 2
        } else if (reservationDate == "weekends") {
          adultPrice
          kidsPrice
        }

        var waterParkPrice = adultPrice * adult + kidsPrice * kids

        waterParkPrice = waterParkPrice * price

        waterParkPrice = waterParkPrice.toFixed(2)

        const tx_ref = await chapa.generateTransactionReference({
          prefix: "TX", // defaults to `TX`
          size: 20, // defaults to `15`
        })

        const result = await ActivityReserv.create({
          first_name: first_name,
          last_name: last_name,
          location: location,
          email: email,
          phone_number: phone_number,
          confirmation_code: confirmation_code,
          reservation_date: reservationDate,
          currency: currency,
          payment_method: payment_method,
          payment_status: "unpaid",
          quantity: quantity,
          adult: adult,
          kids: kids,
          price: waterParkPrice,
          tx_ref: tx_ref,
          order_status: "reserved",
        })

        var options = {
          method: "POST",
          url: "https://api.chapa.co/v1/transaction/initialize",
          headers: {
            Authorization: "Bearer " + CHAPA_API,
          },
          formData: {
            amount: waterParkPrice,
            currency: currency,
            email: email,
            first_name: first_name,
            last_name: last_name,
            tx_ref: tx_ref,
            "customization[title]": "ticket"
            // callback_url: process.env.CHAPA_CALLBACK_URL,
            // return_url: process.env.URL + '/returnchapa',
          },
        }

        request(options, function async(error, response) {
          if (error) throw new Error(error)
          var full_response = JSON.parse(response.body)
          var check_out = full_response.data.checkout_url
          console.log(check_out)

          res.json({ url: check_out })
        })
      }
    } else if (location == "entoto") {
      const amt = req.body.amt
      let sum = 0
      amt.forEach(item => {
        return (sum += item.quantity)
      })

      if (sum <= 15) {
        const EntotoPrice = await entotoPackage.findAll()
        var entotoPrice = 0

        console.log("form amt")
        const kids = amt[0].quantity
        const Adrenaline = amt[1].quantity
        const Adventure = amt[2].quantity

        entotoPrice =
          kids * EntotoPrice[0].price +
          Adrenaline * EntotoPrice[1].price +
          Adventure * EntotoPrice[2].price

        entotoPrice = entotoPrice * price

        entotoPrice = entotoPrice.toFixed(2)
      } else {
        res.status(200).json({ msg: "too many tickets" })
      }

      const tx_ref_entoto = await chapa.generateTransactionReference({
        prefix: "TX",
        size: 20,
      })

      var today = moment().format("YYYY-MM-DD hh:mm A")

      const result_entoto = await ActivityReserv.create({
        first_name: first_name,
        last_name: last_name,
        location: location,
        email: email,
        phone_number: phone_number,
        confirmation_code: confirmation_code,
        reservation_date: today,
        currency: currency,
        payment_method: payment_method,
        payment_status: "unpaid",
        quantity: sum,
        amt: amt,
        redeemed_amt: [
          {
            package_type: "For Kids",
            quantity: 0,
            packages: [
              {
                name: "Pedal Kart",
                quantity: 0,
              },
              {
                name: "Trampoline",
                quantity: 0,
              },
              {
                name: "Children playground",
                quantity: 0,
              },
              {
                name: "wall climbing",
                quantity: 0,
              },
            ],
          },
          {
            package_type: "Adrenaline",
            quantity: 0,
            packages: [
              {
                name: "Zip Line",
                quantity: 0,
              },
              {
                name: "Rope Course",
                quantity: 0,
              },
              {
                name: "Go Kart",
                quantity: 0,
              },
            ],
          },
          {
            package_type: "Entoto Adventure",
            quantity: 0,
            packages: [
              {
                name: "Horse Riding",
                quantity: 0,
              },
              {
                name: "Paintball",
                quantity: 0,
              },
              {
                name: "Archery",
                quantity: 0,
              },
              {
                name: "Zip Line",
                quantity: 0,
              },
            ],
          },
        ],
        price: entotoPrice,
        tx_ref: tx_ref_entoto,
        order_status: "reserved",
      })

      var options = {
        method: "POST",
        url: "https://api.chapa.co/v1/transaction/initialize",
        headers: {
          Authorization: "Bearer " + CHAPA_API,
        },
        formData: {
          amount: entotoPrice,
          currency: currency,
          email: email,
          first_name: first_name,
          last_name: last_name,
          tx_ref: tx_ref_entoto,
          // callback_url: process.env.CHAPA_CALLBACK_URL,
          // return_url: process.env.URL + '/returnchapa',
        },
      }

      request(options, function async(error, response) {
        if (error) throw new Error(error)
        var full_response = JSON.parse(response.body)
        var check_out = full_response.data.checkout_url
        console.log(check_out)

        res.json({ url: check_out })
      })

      // res.status(200).json({ msg: "success" })
    } else if (location == "boston") {
      const bostonQuantity = req.body.bostonQuantity
      const bostonAmt = req.body.amt
      if (bostonQuantity <= 5) {
        var bostonPrice = 60 * bostonQuantity
        bostonPrice = bostonPrice * price

        bostonPrice = bostonPrice.toFixed(2)

        const tx_ref_boston = await chapa.generateTransactionReference({
          prefix: "TX",
          size: 20,
        })

        const result_boston = await ActivityReserv.create({
          first_name: first_name,
          last_name: last_name,
          location: location,
          email: email,
          phone_number: phone_number,
          confirmation_code: confirmation_code,
          currency: currency,
          payment_method: payment_method,
          payment_status: "unpaid",
          quantity: bostonQuantity,
          amt: bostonAmt,
          redeemed_amt: [
            {
              name: "Peedcure & deep manicure",
              quantity: 0,
            },
            {
              name: "Aroma massage",
              quantity: 0,
            },
            {
              name: "Spa",
              quantity: 0,
            },
            {
              name: "Hair",
              quantity: 0,
            },
          ],
          price: bostonPrice,
          tx_ref: tx_ref_boston,
          order_status: "reserved",
        })

        var options = {
          method: "POST",
          url: "https://api.chapa.co/v1/transaction/initialize",
          headers: {
            Authorization: "Bearer " + CHAPA_API,
          },
          formData: {
            amount: bostonPrice,
            currency: currency,
            email: email,
            first_name: first_name,
            last_name: last_name,
            tx_ref: tx_ref_boston,
            // callback_url: process.env.CHAPA_CALLBACK_URL,
            // return_url: process.env.URL + '/returnchapa',
          },
        }

        request(options, function async(error, response) {
          if (error) throw new Error(error)
          var full_response = JSON.parse(response.body)
          var check_out = full_response.data.checkout_url
          console.log(check_out)

          res.json({ url: check_out })
        })
      } else {
        res.status(200).json({ msg: "too many tickets" })
      }
    }
  } catch (error) {
    console.log(error)
  }
}
