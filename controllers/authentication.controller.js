import { QueryTypes } from "sequelize";

export const auth = async(req, res) => {
    const id = req.params.id;
    try {
        const user = await sequelize.query("SELECT * FROM 'users' WHERER confirmation="+id,{type: QueryTypes.SELECT});
        if(user.lenght > 0){
            res.json({msg: true});
        }else{
            res.json({msg: false})
        }
    } catch (error) {
        console.log(error);
    }



}