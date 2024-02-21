import React from 'react'
import Navbar from '../Headers/Navbar'
import BaseLayout from '../../Layout/BaseLayout'
import { Helmet } from "react-helmet";
function Blog() {
  return (
   <BaseLayout>
 <Helmet>
        <meta charSet="utf-8" />
        <title>EdLernity | Blog </title>
        <link rel="canonical" href="http://mysite.com/example" />
      </Helmet>
    <h1>Blog Page</h1>
   </BaseLayout>
  )
}

export default Blog
