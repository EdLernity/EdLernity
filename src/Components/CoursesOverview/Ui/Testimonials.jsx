import React from 'react';

function Testimonials({ testimonials }) {
     // Shuffle function to randomly reorder testimonials
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  // Shuffle testimonials array
  const shuffledTestimonials = shuffleArray(testimonials).slice(0, 5);
  return (

    <div id="testimonials" aria-label="Review from Learners" className=" py-20 sm:py-20">
      <div className="mx-auto  px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl md:text-center">
          <h2 className="font-display text-xl tracking-tight text-slate-900 text-center sm:text-4xl" style={{ color: "#181FC5" }}>Review from Learners</h2>
        </div>
       
        <div class="flex overflow-x-scroll pb-10 hide-scroll-bar pt-3">
          {shuffledTestimonials.map((testimonial, index) => (
          <div  key={index}  class="inline-block px-2">
              <div className="lg:ml-[5.5rem] md:ml-10 relative rounded-2xl bg-white p-6 shadow shadow-slate-900/10 w-[50rem] h-[19rem] max-w-xs cursor-pointer overflow-hidden  hover:shadow-xl transition-shadow duration-300 ease-in-out">
              <svg aria-hidden="true"
                width="105" height="78" class="absolute opacity-10">
                <path
                  d="M25.086 77.292c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622C1.054 58.534 0 53.411 0 47.686c0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C28.325 3.917 33.599 1.507 39.324 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Zm54.24 0c-4.821 0-9.115-1.205-12.882-3.616-3.767-2.561-6.78-6.102-9.04-10.622-2.11-4.52-3.164-9.643-3.164-15.368 0-5.273.904-10.396 2.712-15.368 1.959-4.972 4.746-9.567 8.362-13.786a59.042 59.042 0 0 1 12.43-11.3C82.565 3.917 87.839 1.507 93.564 0l11.074 13.786c-6.479 2.561-11.677 5.951-15.594 10.17-3.767 4.219-5.65 7.835-5.65 10.848 0 1.356.377 2.863 1.13 4.52.904 1.507 2.637 3.089 5.198 4.746 3.767 2.41 6.328 4.972 7.684 7.684 1.507 2.561 2.26 5.5 2.26 8.814 0 5.123-1.959 9.19-5.876 12.204-3.767 3.013-8.588 4.52-14.464 4.52Z">
                </path>
              </svg>
                <div className="relative">
                <p className="text-lg tracking-tight text-slate-900 overflow-auto h-[10rem]">
  { testimonial.comment}
</p>


                </div>
                <figcaption className="relative mt-6 flex items-center justify-between border-t border-slate-100 pt-6">
                  <div>
                    <div className="font-display text-base text-slate-900">{testimonial.name}</div>
                  </div>
                  <div className="overflow-hidden rounded-full bg-slate-50">
                    <img alt="" className="h-14 w-14 object-cover" src={`/Image/user-review-img/${testimonial?.image}`} />
                  </div>
                </figcaption>
              </div>
            </div>
          ))}
          </div>
        
        
      </div>
    </div>
  );
}

export default Testimonials;
