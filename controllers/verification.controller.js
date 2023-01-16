import database from "../database/database";
import ActivityReserv from "../models/ActivityReservation.model";
import { QueryTypes } from "sequelize";

export const verify = async (req, res) => {
    const user_code = req.query.guest_token;
    const admin = req.query.user_token;
    // console.log(id, token);

    try {
        const user = await database.query(`SELECT * FROM users WHERE ticket_token='${admin}'`, { type: QueryTypes.SELECT });
        console.log(user);

        if (user.length > 0) {
            const result = await ActivityReserv.findAll({
                where: {
                    confirmation_code: user_code,
                }
            });
            if(result.length > 0){
                if(result[0].order_status == 'reserved'){
                    await ActivityReserv.update({
                        order_status: 'checked_in',
                    },{
                        where:{
                            confirmation_code: user_code,
                        }
                    });
                    console.log("Reserved");
                    res.json({msg: 'reserved', data: result});

                }else{
                    console.log("Already Checked In");
                    res.json({msg: 'checked_in', data: result});
                }
            }else{
                res.json({msg: "unkown_confirmation_code"});
            }
        } else {
            res.json({ msg: 'admin_error' })
        }

    } catch (error) {
        console.log(error);
    }
}

