const urlModel = require("../models/urlModels");
const shortid = require('shortid');
const Validator = require('../Validator/valid');
const validUrl = require('valid-url');
const urlModels = require("../models/urlModels");



const createUrl = async function (req, res) {
    try {
        let data = req.body
        const longUrl = data.url;
        const base = "http://localhost:3000"
        const urlCode = shortid.generate();

        if (!Validator.isValidReqBody(data)) { return res.status(400).send({ status: false, msg: "Please provide data" }) }

        if (!Validator.isValid(longUrl)) return res.status(400).send({ status: false, msg: "Please provide Url Link" })
        if (validUrl.isUri(longUrl)) {
            const saveUrl = await urlModel.findOne({ longUrl: longUrl })
            if (saveUrl) {
                return res.status(200).send({ status: true, data: { longUrl: saveUrl.longUrl, shortUrl: saveUrl.shortUrl, urlCode: saveUrl.urlCode } })
            }
            else {
                const shortUrl = `${base}/${urlCode}`;
                const url = {
                    longUrl,
                    shortUrl,
                    urlCode
                };
                const saveData = await urlModels.create(url);
                return res.status(201).send({ status: true, data: { longUrl: saveData.longUrl, shortUrl: saveData.shortUrl, urlCode: saveData.urlCode } })
            }
        }
        else {
            return res.status(400).send({ status: false, msg: "Invalid Url" });
        }
    }
    catch (err) {
        return res.status(500).send({ status: false, msg: err.message })
    }
}

module.exports = { createUrl }