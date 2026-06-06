import React from "react";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import {
  PAGE_SEO,
  organizationSchema,
  websiteSchema,
} from "../../Utils/seoConfig";
import CoursesOffered from "../CoursesOffered/CoursesOffered";
import Herosection from "../Herosectionpage/Herosection";
import Herosection2 from "../Herosectionpage/Herosection2";
import Internship from "../Internship/Internship";
import Offer from "../Offerpage.jsx/Offer";
import Sucess from "../Sucesspage/Sucess";

function Home() {
  return (
    <>
      <BaseLayout>
        <SeoHead
          title={PAGE_SEO.home.title}
          description={PAGE_SEO.home.description}
          path={PAGE_SEO.home.path}
          keywords={PAGE_SEO.home.keywords}
          jsonLd={[organizationSchema, websiteSchema]}
        />
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
