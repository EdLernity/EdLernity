// import React from 'react'
// import { Button } from "@material-tailwind/react";
// import { NavLink } from 'react-router-dom';
// function Payment() {
//     return (
//         <>
//             <div className=''>
//                 <div className='flex justify-center gap-3 p-3 bg-[#D4D4D4] items-center'>
//                     <img src='Image/Logo1.svg' className='w-8 h-8' />
//                     <h4 className='text-3xl font-bold' style={{ color: "#1539CF" }}>EdLernity</h4>
//                 </div>


//                 <div className='px-8'>
//                     <h2 className='text-2xl py-2' style={{ color: "#5B5B5B" }}>All Payment Methods</h2>
//                 </div>

//                 <hr className='border-gray-800 space-y-5'></hr>
//             </div>

//             <div className='flex flex-col space-y-5 px-12 mt-12'>
//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48'>Credit Cards</Button>
//                 </NavLink>

//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48 '>Debit Cards</Button>
//                 </NavLink>
//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48 '>UPI</Button>
//                 </NavLink>
//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48 '>Net Banking</Button>
//                 </NavLink>
//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48 '>Wallet</Button>
//                 </NavLink>
//                 <NavLink to="#buttons-with-link">
//                     <Button variant="outlined" className='bg-[#F2F2F2] w-48 '>EMI Options</Button>
//                 </NavLink>

//             </div>
//         </>
//     )
// }

// export default Payment




import React from 'react';
import { Button, Input, Checkbox } from "@material-tailwind/react";
import { NavLink } from 'react-router-dom';

function Payment() {
    return (

        <>
            <div className=''>
                <div className='flex justify-center gap-3 p-3 bg-[#D4D4D4] items-center'>
                    <img src='Image/Logo1.svg' className='w-8 h-8' />
                    <h4 className='text-3xl font-bold' style={{ color: "#1539CF" }}>EdLernity</h4>
                </div>


                <div className='px-8'>
                    <h2 className='text-2xl py-2' style={{ color: "#5B5B5B" }}>All Payment Methods</h2>
                </div>

                <hr className='border-gray-800 space-y-5'></hr>
            </div>

            <div className='flex mt-12 flex-wrap lg:px-12'>


                {/* Left Column - Navigation Buttons */}
                <div className='w-full  md:w-1/4 px-4'>
                    <div className='sticky top-0'>
                        {/* <h2 className='text-2xl py-2' style={{ color: "#5B5B5B" }}>All Payment Methods</h2> */}
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full font-thin text-md  text-start'>Credit Cards</Button>
                        </NavLink>
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full my-2 font-thin text-md  text-start '>Debit Cards</Button>
                        </NavLink>
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full my-2 font-thin text-md  text-start '>UPI</Button>
                        </NavLink>
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full my-2 font-thin text-md   text-start'>Net Banking</Button>
                        </NavLink>
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full my-2 font-thin text-md   text-start'>Wallet</Button>
                        </NavLink>
                        <NavLink to="#buttons-with-link">
                            <Button variant="outlined" className='bg-[#F2F2F2] w-full my-2 font-thin text-md  text-start '>EMI Options</Button>
                        </NavLink>
                    </div>
                </div>

                {/* Middle Column - Payment Details */}
                <div className='w-full space-y-4 md:w-1/2 px-4  '>
                    <div className='bg-[#F2F2F2] space-y-4 px-4 border border-gray-800'>
                        {/* <h2 className='text-2xl py-2' style={{ color: "#5B5B5B" }}>Payment Details</h2> */}
                        <div className='flex mt-4 gap-2'>
                            <h4>We Accept: </h4>
                            <img src='Image/american-express-icon.png' alt='Amex' className='w-8 h-8' />
                            <img src='Image/visa-icon.png' alt='Visa' className='w-8 h-8' />
                            <img src='Image/rupay-icon.png' alt='RuPay' className='w-8 h-8' />
                            {/* Add more icons as needed */}
                        </div>
                        <div>
                            <label>Card Number</label>
                            <Input type="text" placeholder="Card Number" fullWidth />
                        </div>

                        <div className='flex gap-4'>
                            <div>
                                <label>Expiry Date</label>
                                <Input type="text" placeholder="MM/YY" />
                            </div>
                            <div>
                                <label>CVV</label>
                                <Input type="text" placeholder="CVV" />
                            </div>

                        </div>
                        <div>
                            <label>Card Holder’s Name</label>
                            <Input type="text" placeholder="Card Holder’s Name" fullWidth />

                        </div>
                        <div className='flex justify-center items-center ' style={{marginBottom:"20px"}}>
                            <Checkbox color="lightBlue"  inputId="saveCard" label="Save card securely for future payments" />
                        </div>
                    </div>


                    <div className='mt-12 px-4  bg-[#F2F2F2] border border-gray-900'>
                        <div className='flex justify-center items-center space-x-2'>
                            <Checkbox color="lightBlue" inputId="privacyPolicy" />
                            <p>I agree with the Privacy Policy by proceeding with this payment.</p>
                        </div>
                        <p className='text-xl text-center'>INR 699.00 (Total Amount Payable)</p>
                        <div className='flex flex-col  justify-center items-center mt-2'>
                            {/* <Button color="red" ripple="light">Cancel</Button> */}
                            <button className='bg-[#181FC5] text-white p-2 px-12 rounded-md' style={{}}>Make Payment</button>
                              <button className='' style={{color:"#181FC5"}}>Cancel</button>
                        </div>
                    </div>

                </div>

                {/* Right Column - Order Details Card */}
                <div className='w-full  md:w-1/4 px-4'>
                    <div className='sticky  ' style={{marginTop:"20px"}}>
                        <div className='mx-2 space-y-2 p-4 border-gray-900 bg-[#F2F2F2]  border'>
                            <h2 className='text-xl text-center font-bold'>ORDER DETAILS</h2>
                            <p>Course Name: UI/UX</p>
                            <hr className='border-gray-800 py-1'></hr>
                            <p>Order id: #12345678</p>
                            <hr className='border-gray-800 py-1'></hr>
                            <p>Order Amount:  INR 699</p>
                            <hr className='border-gray-800 py-1'></hr>
                            <p>Total Amount: INR 699</p>
                            <hr className='border-gray-800 py-1'></hr>
                           

                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Payment;
