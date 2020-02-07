const express = require('express');
const { sendJSONResponse } = require('../helpers');
const userRoutes = require('../modules/User/routes');
const accountRoutes = require('../modules/Account/routes');


const router = express.Router();

router.get('/', (req, res) => sendJSONResponse(res, 200, null, req.method, 'Api is live!'));

router.use('/user', userRoutes);
router.use('/account', accountRoutes);


module.exports = router;
