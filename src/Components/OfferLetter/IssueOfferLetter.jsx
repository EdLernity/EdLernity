import moment from 'moment';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiInstancePrivate } from '../../Utils/AxiosInstance';
import { showSnackbar } from '../Utils/enQueSnackBar';
import MailBodyEditor from './MailBodyEditor';

async function modifyPdfAndDownload(pdfUrl, email, name, mailBody, subject) {
  const existingPdfBytes = await fetch(pdfUrl).then((res) => res.arrayBuffer());

  const pdfDoc = await PDFDocument.load(existingPdfBytes);
  const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const type = pdfUrl === "https://dd4maq26g014m.cloudfront.net/Blank+MARKETING+offer+letter_20240404_132204_0000.pdf" ? 1 : 2;

  const pages = pdfDoc.getPages();
  const firstPage = pages[0];
  const { width, height } = firstPage.getSize();
  const today = moment().format('DD/MM/YYYY');
  firstPage.drawText(today, {
    x: 84.2, // Adjust x-coordinate as needed
    y: height - (type === 1 ? 191 : 191), // Adjust y-coordinate as needed
    size: 14, // Adjust font size as needed
    font: helveticaFont,
    color: rgb(0, 0, 0), // Adjust color as needed
    bold:true
  });
  firstPage.drawText(name, {
    x: 82, // Adjust x-coordinate as needed
    y: height - (type === 1 ? 211 : 211), // Adjust y-coordinate as needed
    size: 14, // Adjust font size as needed
    font: helveticaFont,
    color: rgb(0, 0, 0), // Adjust color as needed
    bold:true
  });

  const modifiedPdfBytes = await pdfDoc.save();

  // Convert PDF bytes to Blob
  const pdfBlob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });

  // Create FormData object to send file and other data
  const formData = new FormData();
  formData.append('pdfData', pdfBlob);
  formData.append('email', email);
  formData.append('name', name);
  formData.append('mail', mailBody);
  formData.append('subject', subject);

  apiInstancePrivate.post("/api/v1/course/offer-letter", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  }).then((response) => {
    showSnackbar(response.data.message, "success", "top");
    // window.location.reload();
  }).catch((error) => {
    // Handle error
    console.error("Error:", error);
  }).finally((response) => {
    // setLoading(false);

  });

  
}

function IssueOfferLetter() {
  const [pdfUrl, setPdfUrl] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [mailBody, setMailBody] = useState('');
  const [subject, setSubject] = useState('');
  let navigation=useNavigate();
  const handleSendFile = () => {
    if (!pdfUrl || !name || !mailBody || !email || !subject) {
      showSnackbar('Please fill all required details', "error", "top");
      return;
    }

    // Call modifyPdfAndDownload function with pdfUrl, email, name, mailBody, and subject
    modifyPdfAndDownload(pdfUrl, email, name, mailBody, subject);

    // Reset form fields after sending
    setEmail('');
    setName('');
    setMailBody('');
    setSubject('');
  };


  useEffect(() => {
    const token = localStorage.getItem("_userAuth");
    if (!token) {
      navigation('/auth/login',{replace:true});
    }
  }, [navigation]);


  const handleDownloadFile = async () => {
    if (!pdfUrl || !name) {
      showSnackbar('Please fill all required details', "error", "top");
      return;
    }
    const urls = pdfUrl;
    const existingPdfBytes = await fetch(urls).then((res) => res.arrayBuffer());
    const type = pdfUrl === "https://dd4maq26g014m.cloudfront.net/Blank+MARKETING+offer+letter_20240404_132204_0000.pdf" ? 1 : 2;

    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    const helveticaFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);

    const pages = pdfDoc.getPages();
    const firstPage = pages[0];
    const { width, height } = firstPage.getSize();
    const today = moment().format('DD/MM/YYYY');
    firstPage.drawText(today, {
      x: 84.2, // Adjust x-coordinate as needed
      y: height - (type === 1 ? 191 : 191), // Adjust y-coordinate as needed
      size: 14, // Adjust font size as needed
      font: helveticaFont,
      color: rgb(0, 0, 0), // Adjust color as needed
      bold:true
    });
    firstPage.drawText(name, {
      x: 82, // Adjust x-coordinate as needed
      y: height - (type === 1 ? 211 : 211), // Adjust y-coordinate as needed
      size: 14, // Adjust font size as needed
      font: helveticaFont,
      color: rgb(0, 0, 0), // Adjust color as needed
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
    link.download = 'modified_document.pdf';
    // Append the link to the body
    document.body.appendChild(link);
    // Trigger the click event on the link
    link.click();
    // Remove the link from the body
    document.body.removeChild(link);
    // Trigger PDF download

  };

  return (
    <>
      <div className="flex items-center justify-center p-12">
        <div className="mx-auto w-full  bg-white">
          <form className="py-6 px-9">
            <div className="mb-5">
              <label htmlFor="pdfUrl" className="mb-3 block text-base font-medium text-[#07074D]">
                Select PDF *
              </label>
              <select
                id="pdfUrl"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={pdfUrl}
                onChange={(e) => setPdfUrl(e.target.value)}
              >
                <option value="">Select PDF</option>
                <option value="https://dd4maq26g014m.cloudfront.net/Blank+hrm_20240404_132021_0000.pdf">HR OfferLetter</option>
                <option value="https://dd4maq26g014m.cloudfront.net/Blank+MARKETING+offer+letter_20240404_132204_0000.pdf">Marketing OfferLetter</option>
              </select>
            </div>

            <div className="mb-5">
              <label htmlFor="email" className="mb-3 block text-base font-medium text-[#07074D]">
                Send Offer letter to this email*
              </label>
              <input
                type="email"
                id="email"
                placeholder="example@domain.com"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label htmlFor="name" className="mb-3 block text-base font-medium text-[#07074D]">
                Name*
              </label>
              <input
                type="text"
                id="name"
                placeholder="Name"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="mb-5">
              <label htmlFor="subject" className="mb-3 block text-base font-medium text-[#07074D]">
                Subject *
              </label>
              <input
                type="text"
                id="subject"
                placeholder="Subject"
                className="w-full rounded-md border border-[#e0e0e0] bg-white py-3 px-6 text-base font-medium text-[#6B7280] outline-none focus:border-[#6A64F1] focus:shadow-md"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="mailBody" className="mb-3 block text-base font-medium text-[#07074D]">
                Mail Body*
              </label>
              <MailBodyEditor value={mailBody} onChange={setMailBody} />
            </div>

            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={handleSendFile}
                className="w-[48%] rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none hover:shadow-form"
              >
                Send Letter
              </button>
              <button
                type="button"
                onClick={handleDownloadFile}
                className="w-[48%] rounded-md bg-[#6A64F1] py-3 px-8 text-center text-base font-semibold text-white outline-none hover:shadow-form"
              >
                Download PDF
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default IssueOfferLetter;
