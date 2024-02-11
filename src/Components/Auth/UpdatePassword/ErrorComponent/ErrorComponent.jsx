import React, {useState} from 'react'
import { Link } from 'react-router-dom'

function ErrorComponent({req}) {
  const [isPath,setIsPath] = useState(false)
  if (req.path && !isPath) {
    setIsPath(true);
  }
  return (
    <>
      <div className='font-bold md:text-2xl'>
       {req.error}
       <br/>
        {isPath ? <div><Link to={req.path} className='text-[#1539cf]' >Click here </Link>{req.text}</div> : ""}
      </div>
    </>
  )
}

export default ErrorComponent