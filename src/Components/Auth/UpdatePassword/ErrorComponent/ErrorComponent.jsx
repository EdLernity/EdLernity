import React from 'react'
import { Link } from 'react-router-dom'

function ErrorComponent() {
  return (
    <>
      <div className='font-bold md:text-2xl font-bold  '>
       Your token has been expired or used!
       <br/>
        <Link to= "/ForgotPassword" className='text-[#1539cf]' >Click here </Link>to reset password again
         
      </div>
    </>
  )
}

export default ErrorComponent