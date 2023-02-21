import database from "../database/database"
import ActivityReserv from "../models/ActivityReservation.model"
import { QueryTypes } from "sequelize"

export const verify = async (req, res) => {
  const guest_token = req.body.guest_token
  const user_token = req.body.user_token

  console.log("guest code", guest_token)
  console.log("user token", user_token)

  try {
    const user = await database.query(
      `SELECT * FROM users WHERE ticket_token='${user_token}'`,
      { type: QueryTypes.SELECT }
    )
    console.log(user)

    if (user.length > 0) {
      const result = await ActivityReserv.findAll({
        where: {
          confirmation_code: guest_token,
        },
      })
      if (result.length > 0 ) {
        if (result[0].location === "waterpark") {
          // if (
          //   result[0].order_status == "reserved" &&
          //   result[0].payment_status == "paid" &&
          //   (result[0].adult > result[0].redeemed_adult_ticket ||
          //     result[0].kids > result[0].redeemed_kids_ticket)
          // ) {
          //   const ava_ad = result[0].adult - result[0].redeemed_adult_ticket
          //   const ava_kid = result[0].kids - result[0].redeemed_kids_ticket

          //   res.json({
          //     msg: "waterpark tickets",
          //     data: {
          //       ava_ad,
          //       ava_kid,
          //       result,
          //     },
          //   })
          // } else {
          //   console.log("Already Checked In")
          //   res.json({ msg: "already_checked_in", data: result })
          // }

          if (result[0].order_status === "reserved"){

            await ActivityReserv.update({
              order_status: "checked_in",
            }, {
              where: {
                confirmation_code: guest_token,
              }
            })
  
            res.json({ msg: "waterpark_checked_in", data: result })
          } else {
            res.json({ msg: "already_checked_in", data: result })
          }



        } else if (result[0].location === "entoto") {
          const amt = result[0].amt
          const redeemed_amt = result[0].redeemed_amt
          if (
            redeemed_amt[0].packages[0].quantity ===
              amt[0].packages[0].quantity &&
            redeemed_amt[0].packages[1].quantity ===
              amt[0].packages[1].quantity &&
            redeemed_amt[0].packages[2].quantity ===
              amt[0].packages[2].quantity &&
            redeemed_amt[0].packages[3].quantity ===
              amt[0].packages[3].quantity &&
            redeemed_amt[1].packages[0].quantity ===
              amt[1].packages[0].quantity &&
            redeemed_amt[1].packages[1].quantity ===
              amt[1].packages[1].quantity &&
            redeemed_amt[1].packages[2].quantity ===
              amt[1].packages[2].quantity &&
            redeemed_amt[2].packages[0].quantity ===
              amt[2].packages[0].quantity &&
            redeemed_amt[2].packages[1].quantity ===
              amt[2].packages[1].quantity &&
            redeemed_amt[2].packages[2].quantity ===
              amt[2].packages[2].quantity &&
            redeemed_amt[2].packages[3].quantity === amt[2].packages[3].quantity
          ) {
            console.log("Already Checked In")
            res.json({ msg: "already_checked_in", data: result })
          } else {
            const ava_amt = [
              {
                package_type: "For Kids",
                quantity: +amt[0].quantity - +redeemed_amt[0].quantity,
                packages: [
                  {
                    name: "Pedal Kart",
                    quantity:
                      +amt[0].packages[0].quantity -
                      +redeemed_amt[0].packages[0].quantity,
                  },
                  {
                    name: "Trampoline",
                    quantity:
                      +amt[0].packages[1].quantity -
                      +redeemed_amt[0].packages[1].quantity,
                  },
                  {
                    name: "Children playground",
                    quantity:
                      +amt[0].packages[2].quantity -
                      +redeemed_amt[0].packages[2].quantity,
                  },
                  {
                    name: "wall climbing",
                    quantity:
                      +amt[0].packages[3].quantity -
                      +redeemed_amt[0].packages[3].quantity,
                  },
                ],
              },
              {
                package_type: "Adrenaline",
                quantity: +amt[1].quantity - +redeemed_amt[1].quantity,
                packages: [
                  {
                    name: "Zip Line",
                    quantity:
                      +amt[1].packages[0].quantity -
                      +redeemed_amt[1].packages[0].quantity,
                  },
                  {
                    name: "Rope Course",
                    quantity:
                      +amt[1].packages[1].quantity -
                      +redeemed_amt[1].packages[1].quantity,
                  },
                  {
                    name: "Go Kart",
                    quantity:
                      +amt[1].packages[2].quantity -
                      +redeemed_amt[1].packages[2].quantity,
                  },
                ],
              },
              {
                package_type: "Entoto Adventure",
                quantity: +amt[2].quantity - +redeemed_amt[2].quantity,
                packages: [
                  {
                    name: "Horse Riding",
                    quantity:
                      +amt[2].packages[0].quantity -
                      +redeemed_amt[2].packages[0].quantity,
                  },
                  {
                    name: "Paintball",
                    quantity:
                      +amt[2].packages[1].quantity -
                      +redeemed_amt[2].packages[1].quantity,
                  },
                  {
                    name: "Archery",
                    quantity:
                      +amt[2].packages[2].quantity -
                      +redeemed_amt[2].packages[2].quantity,
                  },
                  {
                    name: "Zip Line",
                    quantity:
                      +amt[2].packages[3].quantity -
                      +redeemed_amt[2].packages[3].quantity,
                  },
                ],
              },
            ]
            res.json({
              msg: "entoto tickets",
              data: {
                amt,
                redeemed_amt,
                result,
                ava_amt,
              },
            })
          }
        } else if (result[0].location === "boston") {
          // const amt = result[0].amt
          // const redeemed_amt = result[0].redeemed_amt

          const amt = result[0].amt
          const redeemed_amt = result[0].redeemed_amt
          if (
            redeemed_amt[0].quantity === amt[0].quantity &&
            redeemed_amt[1].quantity === amt[1].quantity &&
            redeemed_amt[2].quantity === amt[2].quantity &&
            redeemed_amt[3].quantity === amt[3].quantity
          ) {
            console.log("Already Checked In")
            res.json({ msg: "already_checked_in", data: result })
          } else {
            const ava_amt = [
              {
                name: "Peedcure & deep manicure",
                quantity: +amt[0].quantity - +redeemed_amt[0].quantity,
              },
              {
                name: "Aroma massage",
                quantity: +amt[1].quantity - +redeemed_amt[1].quantity,
              },
              {
                name: "Spa",
                quantity: +amt[2].quantity - +redeemed_amt[2].quantity,
              },
              {
                name: "Hair",
                quantity: +amt[3].quantity - +redeemed_amt[3].quantity,
              },
            ]
            res.json({
              msg: "boston tickets",
              amt,
              redeemed_amt,
              ava_amt,
              result,
            })
          }
        }
      } else {
        res.json({ msg: "unkown_confirmation_code" })
      }
    } else {
      res.json({ msg: "admin_error" })
    }
  } catch (error) {
    console.log(error)
  }
}

export const checkGuest = async (req, res) => {
  const redeemed_ad = req.body.redeemed_ad
  const redeemed_kid = req.body.redeemed_kid

  const guest_token = req.body.guest_token

  try {
    const result = await ActivityReserv.findAll({
      where: {
        confirmation_code: guest_token,
      },
    })
    if (result.length > 0) {
      const ava_ad = result[0].adult - result[0].redeemed_adult_ticket
      const ava_kid = result[0].kids - result[0].redeemed_kids_ticket

      const new_ad = result[0].redeemed_adult_ticket + redeemed_ad
      const new_kid = result[0].redeemed_kids_ticket + redeemed_kid

      if (ava_ad >= redeemed_ad && ava_kid >= redeemed_kid) {
        await ActivityReserv.update(
          {
            redeemed_adult_ticket: new_ad,
            redeemed_kids_ticket: new_kid,
          },
          {
            where: {
              confirmation_code: guest_token,
            },
          }
        )
        res.json({ msg: "checked_in", data: result })
      } else {
        res.json({ msg: "already_checked_in" })
      }
    }
  } catch (error) {
    console.log(error)
    res.json({ msg: "error", error: error })
  }
}

export const checkEntotoGuest = async (req, res) => {
  const data = req.body.data
  const guest_token = req.body.guest_token

  console.log(guest_token)
  try {
    const result = await ActivityReserv.findAll({
      where: {
        confirmation_code: guest_token,
      },
    })
    if (result.length > 0) {
      const amt = result[0].amt
      const redeemed_amt = result[0].redeemed_amt

      // For kids redeemed
      const newPedalKart = redeemed_amt[0].packages[0].quantity + data.pedalKart
      const newTrampoline =
        redeemed_amt[0].packages[1].quantity + data.trampoline
      const newChildrenPlayground =
        redeemed_amt[0].packages[2].quantity + data.childrenPlayground
      const newWallClimbing =
        redeemed_amt[0].packages[3].quantity + data.wallClimbing

      // Adrenaline redeemed
      const newZipLine = redeemed_amt[1].packages[0].quantity + data.zipAdre
      const newRopeCourse =
        redeemed_amt[1].packages[1].quantity + data.ropeCourse
      const newGoKart = redeemed_amt[1].packages[2].quantity + data.goKart

      // Entoto Adventure redeemed
      const newHorseRiding =
        redeemed_amt[2].packages[0].quantity + data.horseRiding
      const newPaintball = redeemed_amt[2].packages[1].quantity + data.paintBall
      const newArchery = redeemed_amt[2].packages[2].quantity + data.archery
      const newZipLineEntoto =
        redeemed_amt[2].packages[3].quantity + data.zipAdv

      const newRedeemedAmt = [
        {
          package_type: "For Kids",
          quantity: +amt[0].quantity,
          packages: [
            {
              name: "Pedal Kart",
              quantity: +newPedalKart,
            },
            {
              name: "Trampoline",
              quantity: +newTrampoline,
            },
            {
              name: "Children playground",
              quantity: +newChildrenPlayground,
            },
            {
              name: "wall climbing",
              quantity: +newWallClimbing,
            },
          ],
        },
        {
          package_type: "Adrenaline",
          quantity: +amt[1].quantity,
          packages: [
            {
              name: "Zip Line",
              quantity: +newZipLine,
            },
            {
              name: "Rope Course",
              quantity: +newRopeCourse,
            },
            {
              name: "Go Kart",
              quantity: +newGoKart,
            },
          ],
        },
        {
          package_type: "Entoto Adventure",
          quantity: +amt[2].quantity,
          packages: [
            {
              name: "Horse Riding",
              quantity: +newHorseRiding,
            },
            {
              name: "Paintball",
              quantity: +newPaintball,
            },
            {
              name: "Archery",
              quantity: +newArchery,
            },
            {
              name: "Zip Line",
              quantity: +newZipLineEntoto,
            },
          ],
        },
      ]

      await ActivityReserv.update(
        {
          redeemed_amt: newRedeemedAmt,
        },
        {
          where: {
            confirmation_code: guest_token,
          },
        }
      )

      res.json({ msg: "checked_in" })
    } else {
      res.json({ msg: "already_checked_in" })
    }
  } catch (error) {
    console.log(error)
    res.json({ msg: "error", error: error })
  }
}

export const checkBostonGuest = async (req, res) => {
    const data = req.body.data
    const guest_token = req.body.guest_token

    try {
      const result = await ActivityReserv.findAll({
        where: {
          confirmation_code: guest_token,
        }
      })
      if (result.length > 0) {
        const amt = result[0].amt
        const redeemed_amt = result[0].redeemed_amt

        const newPediMani = redeemed_amt[0].quantity + data.pediMani
        const newAroma = redeemed_amt[1].quantity + data.aroma
        const newSpa = redeemed_amt[2].quantity + data.spa
        const newHair = redeemed_amt[3].quantity + data.hair

        const newRedeemedAmt = [
          {
            name: "Peedcure & deep manicure",
            quantity: +newPediMani,
          },
          {
            name: "Aroma massage",
            quantity: +newAroma
          },
          {
            name: "Spa",
            quantity: +newSpa
          },
          {
            name: "Hair",
            quantity: +newHair
          }
        ]

        await ActivityReserv.update({
          redeemed_amt: newRedeemedAmt
        },
        {
          where: {
            confirmation_code: guest_token,
          }
        })
        res.json({ msg: "checked_in" })
      }
    } catch (error) {
      console.log(error)
    res.json({ msg: "error", error: error })
    }
}
