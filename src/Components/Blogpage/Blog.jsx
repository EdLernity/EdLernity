import React from "react";
import Navbar from "../Headers/Navbar";
import BaseLayout from "../../Layout/BaseLayout";
import SeoHead from "../SEO/SeoHead";
import { PAGE_SEO } from "../../Utils/seoConfig";
function Blog() {
  return (
    <BaseLayout>
      <SeoHead
        title={PAGE_SEO.blog.title}
        description={PAGE_SEO.blog.description}
        path={PAGE_SEO.blog.path}
        keywords={PAGE_SEO.blog.keywords}
        noindex={PAGE_SEO.blog.noindex}
      />
      <h1 className="mt-24 text-6xl text-center mb-48 font-bold">Coming Soon</h1>
    </BaseLayout>
  );
}

export default Blog;
