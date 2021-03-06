const express = require('express');
const { Link } = require('../models');
const { route } = require('./auth');

const router = express.Router();

router.get('/', async (req, res) => {
    const accountId = 1; ///req.id
    const links = await Link.findAll({where: {accountId: accountId}})

    return res.jsonOk(links);
});

router.get('/:id', async (req, res) =>{
    const accountId = 1; ///req.id
    const { id } = req.params;
    const link = await Link.findOne({where: {id, accountId: accountId}})
    if(!link) return res.jsonNotFound();

    return res.jsonOk(link);
});

router.post('/', async (req, res) => {
    const accountId = 2; ///req.id
    const { label, url, isSocial } = req.body;

    const image = 'https://google.com/image.jpg';

    const link = await Link.create({ label, url, isSocial, image, accountId })

    return res.jsonOk(link);
});

router.put('/:id', async (req, res) =>{
    const accountId = 1; ///req.id
    const { id } = req.params;
    const { body } = req;
    const fields = ['label', 'url', 'isSocial'];


    const link = await Link.findOne({where: {id, accountId: accountId}})
    if(!link) return res.jsonNotFound();
    fields.map(fieldName => {
        const newValue = req.body[fieldName];
        if(newValue && newValue != undefined) link[fieldName] = newValue;
    });

    await link.save();

    return res.jsonOk(link);

});

router.delete('/:id', async (req, res) =>{
    const accountId = 1; ///req.id
    const { id } = req.params;
    const link = await Link.findOne({where: {id, accountId: accountId}})
    if(!link) return res.jsonNotFound();
    await link.destroy();
    return res.jsonOk();
});

module.exports = router;