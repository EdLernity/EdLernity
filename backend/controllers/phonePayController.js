// const crypto = require("crypto");
// const axios = require("axios");
// require("dotenv").config();

// const payment = async (req, res) => {
//   try {
//     // const token = req.headers.authorization?.split(" ")[1];

//     let amount = req.body.amount; // in Rs.
//     if (!amount || isNaN(amount)) {
//       return res.status(400).send({ error: "Invalid Amount!" });
//     }

//     const merchantTransactionId = req.body.merchantTxnId;

//     if (!merchantTransactionId) {
//       return res
//         .status(401)
//         .json({ error: "Transaction Id Missing!" });
//     }

//     // if (!token) {
//     //   return res.status(401).json({ error: "No token provided" });
//     // }

//     // const decodedJwt = jwt.verify(token, JWT_SECRET);

//     // userId = decodedJwt.userId;
//     const data1 = {
//         "merchantId": "MG4JP7ZAM",
//         "merchantTransactionId": "MT7850590068188104",
//         "merchantUserId": "MUID123",
//         "amount": 10000,
//         "redirectUrl": "https://webhook.site/redirect-url",
//         "redirectMode": "REDIRECT",
//         "callbackUrl": "https://webhook.site/callback-url",
//         "mobileNumber": "9999999999",
//         "paymentInstrument": {
//           "type": "PAY_PAGE"
//         }
//       }
      

//     const data = {
//       "merchantId": process.env.merchant_id,
//       "merchantTransactionId": merchantTransactionId,
//       "merchantUserId": req.body.MUID,
//       "amount": req.body.amount * 100,
//       "redirectUrl": `https://localhost:3001/api/status/${merchantTransactionId}`,
//       "redirectMode": "POST",
//       "callbackUrl" : `https://localhost:3001/api/status/${merchantTransactionId}`,
//       "mobileNumber": req.body.mobileNumber,
//       "paymentInstrument": {
//         "type": "PAY_PAGE",
//       },
//     };

//     console.log(data)

//     const payload = JSON.stringify(data1);
//     const mainPayload = Buffer.from(payload).toString("base64");
//     console.log(`Main Payload is ${mainPayload}`);
//     const keyIndex = 1;
//     const string = mainPayload + "/pg/v1/pay" + process.env.salt_Key;

//     const sha256 = crypto
//       .createHash("sha256")
//       .update(string, "utf8")
//       .digest("hex");

//     console.log(`sha256 : ${sha256}`);

//     const checksum = sha256 + "###" + keyIndex;
//     console.log(checksum)

//     prod_Url_Payment = process.env.prod_Url_Payment

//     const headers ={
//         accept: "application/json",
//         "Content-Type": "application/json",
//         "X-VERIFY": '8996fb6a5d34d8f2e68c3bccbb85307b36f1cf4e372f4d42c64b7ec0a62126e0###1',
//     };

//     axios.post(`https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/pay`, mainPayload ,{
//         headers:headers,
//     }).then((response)=>{
//         console.log(response.data);
//         console.log(response.data.data.instrumentResponse.redirectInfo.url);
//         if (response.status == 200) {
//           return res.json({
//             Payment_URL: `${response.data.data.instrumentResponse.redirectInfo.url}`,
//             msg: "Payment initiated.",
//           });
//         }
//     }).catch((error)=> {
//         console.log(error)
//       return res.status(500).send({
//         msg: "Error Occured while making Pay U request! Please Try Again Later.",
//       });
//     });
//     } catch (err) {
//     console.log(err);
//     return res.status(500).send({
//       msg: "Error Occured while making Pay U request! Please Try Again Later. final catch",
//       error: err,
//     });
//   }
// };

// // This API will be called from the PayU Server after User has made the Payment.
// const paymentStatusResponse = async (req, res) => {

//   const merchantTransactionId = res.req.body.merchantTransactionId;
//   const merchantId = res.req.body.merchantId;

//   const keyIndex = 1;
//   const string =
//     `/pg/v1/status/${merchantId}/${merchantTransactionId}` + process.env.salt_Key;

//   const sha256 = crypto
//     .createHash("sha256")
//     .update(string, "utf8")
//     .digest("hex");

//   const checksum = sha256 + "###" + keyIndex;

//   prod_Url_Payment_Status = process.env.prod_Url_Payment_Status
//   const options = {
//     method: "GET",
//     url: `${prod_Url_Payment_Status}/${merchant_id}/${merchantTransactionId}`,
//     headers: {
//       accept: "application/json",
//       "Content-Type": "application/json",
//       "X-VERIFY": checksum,
//       "X-MERCHANT-ID": merchant_id,
//     },
//   };

//   try {
//     const res = await axios.request(options);
//     console.log(res);
//     if (res.data.success) {
//       const message = `Payment Successful with Transaction ID ${res.data.transaction.txnid}. Redirecting you to Home Page...`;
//       // Update user's account balance in database and send email to user about successful transaction.

//       // Construct the redirect URL with URL parameters
//       const redirectUrl = `http://localhost:3000/success?message=${encodeURIComponent(
//         message
//       )}&path=${encodeURIComponent(path)}&text=${encodeURIComponent(text)}`;
//       //   const url = `http://localhost:3000/success`;
//       return res.status(200).json({ url: redirectUrl, msg: "Payment initiated." });

//       // Update Transaction Status in Database
//       //   await updateTransactionStatusInDB(url, "Paid");
//     } else {
//       return res.send({ status: false, message: "Something went wrong!" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

// module.exports = { payment, paymentStatusResponse };

const PaytmChecksum = require('paytmchecksum');
const express = require('express');
const router = express();

//production api details
var mid = "SPoFRE06752134943192"
var key = "4vnQO9l9aHZzM1X%"

const callback =  async (req, res) => {
    try {
        console.log(req.body)
        const {ORDERID, RESPMSG} = req.body

        var paytmChecksum = req.body.CHECKSUMHASH;
        delete req.body.CHECKSUMHASH;
    
        var isVerifySignature = PaytmChecksum.verifySignature(req.body, key, paytmChecksum);
        
        if (isVerifySignature) {
            console.log("Checksum Matched");
            if(req.body.STATUS === "TXN_SUCCESS"){
                return res.redirect(`http://localhost:3000/success?orderId=${ORDERID}&message=${RESPMSG}`);
            } else{
                return res.redirect(`http://localhost:3000/failure?orderId=${ORDERID}&message=${RESPMSG}`);
            }
        } else {
            console.log("Checksum Mismatched");
            return res.send("something went wrong")
        }
        
    } catch (error) {
        console.error(error);
        res.status(500).send("Internal Server Error");
    }
};

const payment = (req, res) => {
    const {amount, email} = req.body
    const totalAmount = JSON.stringify(amount);

    var orderId = `ORDERID_${Date.now()}`
    var custId = `CUST_${Date.now()}`
    var params = {};
  
    /* initialize an array */
    (params["MID"] = mid),
    (params["WEBSITE"] = "DEFAULT"),
    (params["CHANNEL_ID"] = "WEB"),
    (params["INDUSTRY_TYPE_ID"] = "Retail"),
    (params["ORDER_ID"] = orderId),
    (params["CUST_ID"] = custId),
    (params["TXN_AMOUNT"] = totalAmount),
    (params["CALLBACK_URL"] = "http://localhost:5000/api/callback"),
    (params["EMAIL"] = email),
    (params["MOBILE_NO"] = "7498608775");
  
    /**
     * Generate checksum by parameters we have
     * Find your Merchant Key in your Paytm Dashboard at https://dashboard.paytm.com/next/apikeys
     */
    var paytmChecksum = PaytmChecksum.generateSignature(
      params,
      key
    );
    paytmChecksum
      .then(function (checksum) {
        let paytmParams = {
          ...params,
          CHECKSUMHASH: checksum,
        };
        res.json(paytmParams);
      })
      .catch(function (error) {
        console.log(error);
      });
  };


  module.exports = {
    callback,
    payment
  };