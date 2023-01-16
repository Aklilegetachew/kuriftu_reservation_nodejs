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
            if(result.length > 0){
                if(result[0].order_status == 'reserved'){
                    await ActivityReserv.update({
                        order_status: 'checked_in',
                    },{
                        where:{
                            confirmation_code: guest_token,
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

