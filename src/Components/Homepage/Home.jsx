import React from "react";
import Herosection from "../Herosectionpage/Herosection";
import Herosection2 from "../Herosectionpage/Herosection2";
import Internship from "../Internship/Internship";
import Sucess from "../Sucesspage/Sucess";
import Offer from "../Offerpage.jsx/Offer";
import CoursesOffered from "../CoursesOffered/CoursesOffered";
import BaseLayout from "../../Layout/BaseLayout";
import { Helmet } from "react-helmet";

function Home() {
  return (
    <>
      <BaseLayout>
        <Helmet>
          <meta charSet="utf-8" />
          <title>EdLernity | Home </title>
          <link rel="canonical" href="http://mysite.com/example" />
        </Helmet>
        <div>
          <Herosection />
        </div>
        <div>
          <Herosection2 />
        </div>
        <div>
          <Internship />
        </div>
        <div>
          <Sucess />
        </div>
        <div>
          <Offer />
        </div>
        <div className="bg-[#F1F0F0]">
          <CoursesOffered />
        </div>
      </BaseLayout>
    </>
  );
}

export default Home;
