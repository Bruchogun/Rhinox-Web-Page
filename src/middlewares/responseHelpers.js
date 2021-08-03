import { sql } from "../db";

export default (req, res, next)=>{
    res.json = obj => {
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify(obj));
    }
    res.validateDescription = description => {
        if (description && description.length>512){
            return res.json({
                error: "La descripción supera los 512 carácteres"
            });
            return false;
        }
        return true;
    }
    res.sql = async (...params) => {
        try {
            return await sql(...params);
        } catch (error) {
            res.statusCode=500;
            res.json({
                error: error.message
            })
            throw error;
        }
    }
    next();
}