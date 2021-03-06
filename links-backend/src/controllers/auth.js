const express = require('express');
const bcrypt = require('bcrypt');
const { Account } = require('../models');
const { accountSingUp, accountSingIn } = require('../validators/account');
const { getMessage } = require('../helpers/validator');
const { generateJwt, generateRefreshJwt } = require('../helpers/jwt');

const router = express.Router();

const saltRounds = 10;

router.post('/sign-in', accountSingIn, async (req, res)=>{
    const { email, password } = req.body;
    const account = await Account.findOne({where: {email}});

    // validar a senha
    const match = account ? bcrypt.compareSync(password, account.password): null;
    if (!match) return res.jsonBadRequest(null, getMessage('account.signin.invalid'));

    const token = generateJwt({id: Account.id});
    const refreshToken = generateRefreshJwt({id: Account.id});

    return res.jsonOk(account, getMessage('account.signin.success'), { token, refreshToken });
});

router.post('/sign-up', accountSingUp, async (req, res)=> {

    const { email, password } = req.body;

    const account = await Account.findOne({where: {email}});
    
    if(account) return res.jsonBadRequest(null, getMessage('account.signup.email_exists'));
    
    const hash = bcrypt.hashSync(password, saltRounds);
    const newAccount = await Account.create({email, password: hash});

    const token = generateJwt({id: newAccount.id});
    const refreshToken = generateRefreshJwt({id: newAccount.id});

    
    return res.jsonOk(newAccount, getMessage('account.signup.success'), { token, refreshToken });
});

module.exports = router;