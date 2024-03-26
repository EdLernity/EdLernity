import React, { useState } from 'react';
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
    
    <>
    <div class="relative flex min-h-screen flex-col items-center justify-center overflow-hidden py-6 sm:py-12 bg-white">
  <div class="max-w-xl px-5 text-center">
    <h2 class="mb-2 text-[42px] font-bold text-zinc-800">Check your inbox</h2>
    <p class="mb-2 text-lg text-zinc-500"><div dangerouslySetInnerHTML={{ __html: req.message }} /></p>
    <Link to="/auth/login" class="mt-3 inline-block w-96 rounded bg-indigo-600 px-5 py-3 font-medium text-white shadow-md shadow-indigo-500/20 hover:bg-indigo-700">Login to Edlernity →</Link>
  </div>
</div>
    </>
  )
}

export default SucessPage;