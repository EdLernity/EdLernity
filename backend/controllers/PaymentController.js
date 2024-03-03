const Razorpay = require('razorpay');
const instance = new Razorpay({
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_SECRET,
});

const CapturePayment = async (req, res) => { 
  try {
    const options = {
      amount: req.body.amount, // amount in the smallest currency unit
      currency: 'INR',
    };
    console.log(req.body.amount);
    const myOrder = await instance.orders.create(options);

    res.status(200).json({
      success: true,
      amount: req.body.amount,
      order: myOrder,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Internal Server Error',
    });
  }
};
  
module.exports ={CapturePayment};