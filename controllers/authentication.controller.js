import { QueryTypes } from "sequelize";
import database from "../database/database";
import ActivityReserv from "../models/ActivityReservation.model";

export const auth = async (req, res) => {
    const userID = req.params.id;
    const agentID = req.params.id2;

    try {
        const user = await database.query(`SELECT * FROM users WHERE ticket_token='${agentID}'`, { type: QueryTypes.SELECT });
        // console.log(user);
        if (user) {
            console.log('true');
            const result = await ActivityReserv.findAll({
                where: {
                    confirmation_code: userID,
                    order_status: 'reserved'
                }
            });
            console.log(result.length);
            if (result.length > 0) {
                await ActivityReserv.update({
                    order_status: 'checked_in',
                }, {
                    where: {
                        confirmation_code: userID,
                    }
                });

                res.json({ msg: "user_legit" });
                res.redirect
            } else {
                res.json({ msg: "user_fraud" })
            }

            // console.log(result);

            // res.json({ msg: true });
        } else {
            console.log('false')
            res.json({ msg: false })
        }
    } catch (error) {
        console.log(error);
    }



}