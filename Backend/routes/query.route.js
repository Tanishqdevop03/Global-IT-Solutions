const router = require("express").Router();
const { sendQuery } = require("../controllers/query.controller");
const validate = require("../middlewares/validate");

router.post("/send-query", validate, sendQuery);

module.exports = router;

