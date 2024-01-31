import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function SucessPage({req}) {
  console.log(req)
  const [isPath,setIsPath] = useState(false)
  if (req.path && !isPath) {
    setIsPath(true);
  }
  return (
    <div className='font-bold md:text-2xl'>
       {req.success}
       <br/>
        {isPath ? <div><Link to={req.path} className='text-[#1539cf]' >Click here </Link>{req.text}</div> : ""}
      </div>
  )
}

export default SucessPage;