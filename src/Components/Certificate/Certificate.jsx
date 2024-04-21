import moment from 'moment';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import React, { useRef, useState } from "react";
import { apiInstancePrivate } from '../../Utils/AxiosInstance';
function Certificate({ courseName, courseId }) {
  const [userName, setUserName] = useState("");
  const [showInput, setShowInput] = useState(false);

  const canvasRef = useRef(null);

  const handleDownload = () => {
    if (!userName) {
      setShowInput(true); // Show the input box if the user name is not entered
      return;
    }

    apiInstancePrivate
      .get("/api/v1/enroll/getCertificationCoursesList/" + courseId)
      .then(async (res) => {
        
        const urls = "https://edlernity.s3.ap-south-1.amazonaws.com/Copy+of+Copy+of+Certificate+of+Completion+(EdLernity)_20240420_100208_0000%5B1%5D.pdf";
        const existingPdfBytes = await fetch(urls).then((res) => res.arrayBuffer());
        
    
        const pdfDoc = await PDFDocument.load(existingPdfBytes);
        const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
        const pages = pdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();
        const today = moment().format('DD/MM/YYYY');
        firstPage.drawText(userName, {
          x: 147, // Adjust x-coordinate as needed
          y: height -  263, // Adjust y-coordinate as needed
          size: 50, // Adjust font size as needed
          font: helveticaFont,
          color: rgb(0.0392156862745098, 0.18823529411764706, 0.3843137254901961), // Adjust color as needed
          bold:true
        });
        firstPage.drawText(courseName, {
          x: 148, // Adjust x-coordinate as needed
          y: height -  328, // Adjust y-coordinate as needed
          size: 25, // Adjust font size as needed
          font: helveticaFont,
          color: rgb(0.0392156862745098, 0.18823529411764706, 0.3843137254901961), // Adjust color as needed
          bold:true
        });
        firstPage.drawText(today, {
          x: 196, // Adjust x-coordinate as needed
          y: height -  508, // Adjust y-coordinate as needed
          size: 15, // Adjust font size as needed
          font: helveticaFont,
          color: rgb(0.0392156862745098, 0.18823529411764706, 0.3843137254901961), // Adjust color as needed
          bold:true
        });
        firstPage.drawText(res.data.uuid, {
          x: 190, // Adjust x-coordinate as needed
          y: height -  536, // Adjust y-coordinate as needed
          size: 15, // Adjust font size as needed
          font: helveticaFont,
          color: rgb(0.0392156862745098, 0.18823529411764706, 0.3843137254901961), // Adjust color as needed
          bold:true
        });
    
        const modifiedPdfBytes = await pdfDoc.save();
    
        // Create a Blob from the PDF data
        const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
        // Create a download URL for the Blob
        const url = URL.createObjectURL(blob);
        // Create a link element
        const link = document.createElement('a');
        // Set the href attribute to the download URL
        link.href = url;
        // Set the download attribute to specify the filename
        link.download = `${userName}_${courseName}_certificate.pdf`;
        // Append the link to the body
        document.body.appendChild(link);
        // Trigger the click event on the link
        link.click();
        // Remove the link from the body
        document.body.removeChild(link);
      })
      .catch((err) => {
        // Handle error
      })
      .finally(() => {});

     
   
  };
  
  const isMobile = () => {
    const userAgent =
      typeof window.navigator === "undefined" ? "" : navigator.userAgent;
    return /Mobi/.test(userAgent);
  };
  return (
    <div>
      <section class="sm:mt-6 lg:mt-8 mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="my-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28 flex gap-3 lg:flex-justify lg:flex flex-col lg:flex-row">
          <div class="sm:text-center lg:text-left">
            <h1 class="text-4xl tracking-tight font-extrabold text-gray-800 sm:text-5xl md:text-6xl">
              <span class="block xl:inline"> To earn a </span>
              <span class="block text-indigo-600 xl:inline"> online certificate </span>
            </h1>
            <p class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
              Add this credential to your LinkedIn profile, resume, or CV. Share it on social media and in your performance review.
            </p>

            <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
              <canvas ref={canvasRef} width={800} height={600} style={{ display: "none" }} crossOrigin="anonymous" />
              <div class="mt-3 sm:mt-0 sm:ml-3">
                <div
                  onClick={handleDownload}
                  class=" cursor-pointer curflex items-center text-center justify-center px-3 py-3 border border-transparent text-base font-medium rounded-md text-gray-800 bg-indigo-100 hover:bg-indigo-200 md:py-2 md:text-lg md:px-4"
                >
                  Download Certificate
                </div>
                
              </div>
            </div>
          </div>

          <div class="lg:inset-y-0 lg:right-0 lg:w-1/2 my-4">
            <img
              class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
              src="https://edlernity.s3.ap-south-1.amazonaws.com/Copy+of+Certificate+of+Completion+(EdLernity)_20240328_030736_0000.png"
              alt="cerificate"
            />
          </div>
        </div>
      </section>

      {showInput && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg">
            <input
              type="text"
              value={userName}
              onChange={(e) => setUserName(e.target.value)}
              placeholder="Enter Your Name"
              className="border border-gray-300 px-4 py-2 rounded-md w-full mb-4"
            />
            <button
              onClick={() => {
                setShowInput(false);
                handleDownload();
              }}
              className="bg-indigo-500 text-white px-4 py-2 rounded-md"
            >
              Confirm
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Certificate;
