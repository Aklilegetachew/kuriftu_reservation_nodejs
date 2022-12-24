import ActivityReserv from "../models/ActivityReservation.model";

export const verify = async(req, res) =>{
    const id = req.params.id;
    try {
        const result = await ActivityReserv.findAll({
            where: {
                confirmation_code: id,
            }
        });
        
        const status = result[0].dataValues.order_status

        if(status == 'reserved'){
            console.log('Reserved');
            await ActivityReserv.update({
                order_status: 'checked_in'
            },{
                where: {
                    confirmation_code: id
                }
            });
            res.json({msg: 'reserved'});
        }else{
            console.log('Already Checked In');
            res.json({msg: 'checked_in'});
        }
        
        res.json(result);
    } catch (error) {
        console.log(error);
    }
}

