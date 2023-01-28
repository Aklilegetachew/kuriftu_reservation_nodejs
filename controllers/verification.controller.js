import database from "../database/database";
import ActivityReserv from "../models/ActivityReservation.model";
import { QueryTypes } from "sequelize";

export const verify = async (req, res) => {
    const guest_token = req.body.guest_token;
    const user_token = req.body.user_token;

    console.log("guest code", guest_token)
    console.log("user token", user_token)


    try {
        const user = await database.query(`SELECT * FROM users WHERE ticket_token='${user_token}'`, { type: QueryTypes.SELECT });
        console.log(user);

        if (user.length > 0) {
            const result = await ActivityReserv.findAll({
                where: {
                    confirmation_code: guest_token,
                }
            });
            if (result.length > 0) {

                if (result[0].location === 'waterpark') {
                    if (result[0].order_status == 'reserved' && result[0].payment_status == 'paid' && (result[0].adult > result[0].redeemed_adult_ticket || result[0].kids > result[0].redeemed_kids_ticket)) {

                        const ava_ad = result[0].adult - result[0].redeemed_adult_ticket;
                        const ava_kid = result[0].kids - result[0].redeemed_kids_ticket;

                        res.json({
                            msg: 'available tickets',
                            data: {
                                ava_ad, ava_kid, result
                            }
                        });

                    } else {
                        console.log("Already Checked In");
                        res.json({ msg: 'already_checked_in', data: result });
                    }

                } else if (result[0].location === 'entoto') {
                    const amt = result[0].amt;
                    res.json({ amt })
                }
            } else {
                res.json({ msg: "unkown_confirmation_code" });
            }
        } else {
            res.json({ msg: 'admin_error' })
        }

    } catch (error) {
        console.log(error);
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
            }
        })
        if (result.length > 0) {
            const ava_ad = result[0].adult - result[0].redeemed_adult_ticket;
            const ava_kid = result[0].kids - result[0].redeemed_kids_ticket;

            const new_ad = result[0].redeemed_adult_ticket + redeemed_ad;
            const new_kid = result[0].redeemed_kids_ticket + redeemed_kid;


            if (ava_ad >= redeemed_ad && ava_kid >= redeemed_kid) {
                await ActivityReserv.update({
                    redeemed_adult_ticket: new_ad,
                    redeemed_kids_ticket: new_kid,
                }, {
                    where: {
                        confirmation_code: guest_token,
                    }
                });
                res.json({ msg: 'checked_in', data: result });
            } else {
                res.json({ msg: 'already_checked_in' });
            }
        }
    } catch (error) {
        console.log(error)
        res.json({ msg: 'error', error: error })
    }
}
