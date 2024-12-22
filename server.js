const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const PaytmChecksum = require('./PaytmChecksum'); // Ensure you have the PaytmChecksum library

const app = express();
app.use(bodyParser.json());

app.post('/generate-paytm-url', (req, res) => {
    const { amount, customerId, customerEmail, customerPhone } = req.body;

    const paytmParams = {
        MID: 'YOUR_PAYTM_MID',
        WEBSITE: 'WEBSTAGING',
        INDUSTRY_TYPE_ID: 'Retail',
        CHANNEL_ID: 'WEB',
        ORDER_ID: 'ORDER' + new Date().getTime(),
        CUST_ID: customerId,
        TXN_AMOUNT: amount,
        CALLBACK_URL: 'http://localhost:3000/callback',
        EMAIL: customerEmail,
        MOBILE_NO: customerPhone
    };

    PaytmChecksum.generateSignature(paytmParams, 'YOUR_PAYTM_MERCHANT_KEY').then((checksum) => {
        paytmParams.CHECKSUMHASH = checksum;
        res.json({
            success: true,
            paymentUrl: `https://securegw-stage.paytm.in/order/process?${new URLSearchParams(paytmParams).toString()}`
        });
    }).catch((error) => {
        console.error('Error generating checksum:', error);
        res.json({ success: false });
    });
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
