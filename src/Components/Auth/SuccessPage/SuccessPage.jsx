import React, { useState } from 'react'
import { Link } from 'react-router-dom';

function SucessPage({ req = {} }) {
  const [isPath,setIsPath] = useState(false)
  if (req.path && !isPath) {
    setIsPath(true);
  }
  const urlParams = new URLSearchParams(window.location.search);
  console.log(req)
  if(Object.entries(req).length === 0){
    const message = urlParams.get('message');
    const path = urlParams.get('path');
    const text = urlParams.get('text');
    req = {
      message : message,
      path :path,
      text : text
    }
    return <SucessPage req={{message: message || "No Message Provided", path: path || "/", text: text || ""}}/>;
  }
  console.log(req)
  return (
    <div className='font-bold md:text-2xl'>
       {req.message}
       <br/>
        {isPath ? <div><Link to={req.path} className='text-[#1539cf]' >Click here </Link>{req.text}</div> : ""}
      </div>
  )
}

export default SucessPage;