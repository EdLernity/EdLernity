import React from 'react'
import { Link } from 'react-router-dom'

function ErrorComponent({error}) {
  return (
    <>
      <div className='font-bold md:text-2xl'>
       {error}
       <br/>
        <Link to= "/ForgotPassword" className='text-[#1539cf]' >Click here </Link>to reset password again
         
      </div>
    </>
  )
}

export default ErrorComponent