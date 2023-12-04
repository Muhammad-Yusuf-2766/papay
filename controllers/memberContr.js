const assert = require("assert");
const Member = require("../models/Member");
let memberController = module.exports;
const jwt = require('jsonwebtoken');
const Definer = require("../lib/mistake");


memberController.signup = async (req, res) =>{
    try{
        console.log("POST: contr/sign-up")
        const data = req.body;
        const member = new Member();
        const new_member = await member.singupData(data);

        // TODO AUTHENTICATE BASED ON JWT
        const token = memberController.createToken(new_member)
        console.log('token====', token);
        res.cookie("access_token", token, {
            maxAge: 6 * 3600 * 1000,
            httpOnly: true })

        res.json({state:"succed", data:new_member})
    }catch (err) {
        console.log(`ERROR: contr/sign-up`, err)
        res.json({state:"failed", message:err.message})
    }
};

memberController.login = async (req, res) =>{
    try{
        console.log("POST: contr/login")
        const data = req.body;
        const member = new Member();
        const result = await member.loginData(data);
        // TODO AUTHENTICATE BASED ON JWT
        const token = memberController.createToken(result)
        res.cookie('access_token', token, {
            maxAge: 6 * 3600 * 1000,
            httpOnly: true 
        })
        res.json({state:"succed", data:result})
    }catch (err) {
        console.log(`ERROR: contr/login`, err)
        res.json({state:"failed", message:err.message})
    }
};


memberController.logout = (req, res) =>{
    console.log("GET controller.logout")
    res.cookie('accsess_token', null, {maxAge: 0, httpOnly: true})
    console.log(`Succeed:  you loged out successfully!`)
    res.json(`Succeed: you loged out successfully!`)
};



memberController.createToken = (result) => {
    try{
        const upload_data = {
            _id: result._id,
            mb_nick: result.mb_nick,
            mb_type: result.mb_type
        }

        const token = jwt.sign (
            upload_data,
            process.env.SECRET_TOKEN,
            {expiresIn: "6h"}
        )
        assert.ok(token, Definer.auth_err2)
        return token;
    } catch (err) {
        throw err
    }
}


memberController.checkMyAuthentication = (req, res) => {
    try {
        console.log("GEt: contr/checkMyAuthentication")
        const token = req.cookies["access_token"];
        console.log('token:::', token);

        const member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;
        assert.ok(member, Definer.general_err2)

        res.json({state:"succed", data:member})
    } catch (err) {
        throw err
    }
} 


memberController.getChosenMember = async (req, res) => {
    try {
        console.log("GEt: contr/getChosenMember")
        const id = req.params.id;

        const member = new Member();
        const result = await member.getChosenMemberData(req.member, id)
        res.json({ state: "Succeed", data: result })
        
    } catch (error) {
        console.log(`ERROR: Contr/getChosenMember`, error)
        res.json({state:"failed", message:error.message})      
    }
}



memberController.retrieveAuthMember = (req, res, next) => {
    try {
        const token = req.cookies['access_token']
        req.member = token ? jwt.verify(token, process.env.SECRET_TOKEN) : null;

        next();
    } catch (error) {
        console.log(`ERROR: Contr/retrieveAuthMember`, error.message)
    }
}
