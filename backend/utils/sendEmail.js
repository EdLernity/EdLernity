var SDK = require('aws-sdk');
require('dotenv').config();

const SES_CONFIGURATION={
    accessKeyId:process.env.AWS_SES_CLIENT,
    secretAccessKey:process.env.AWS_SES_SECRET_ACCESS_KEY,
    region:"ap-south-1"
}

const AWS_SES=new SDK.SES(SES_CONFIGURATION);

const sendEmail=async(subject,to,htmlTemplate,textFormat)=>{
    var params = {
        Destination: {
          ToAddresses: [
            to
          ],
        },
        Message: {
          Body: {
            Html: {
              Charset: "UTF-8",
              Data: `${htmlTemplate}`,
            },
            Text: {
              Charset: "UTF-8",
              Data: textFormat,
            },
          },
          Subject: {
            Charset: "UTF-8",
            Data: subject
          },
        },
        Source: "no-reply@edlernity.com",
        ReplyToAddresses: [
        ],
      };
      try {
       await AWS_SES.sendEmail(params).promise();
       return { ok: true };
      } catch (error) {
        console.error("email error", error?.message || error);
        return {
          ok: false,
          error: error?.message || "Email service failed",
        };
      }
}
const sendOfferEmail = async (subject, to, htmlTemplate, textFormat, pdfData) => {
 

  const params = {
      Destinations: [to],
      RawMessage: {
          Data: `From: no-reply@edlernity.com
To: ${to}
Subject: ${subject}
MIME-Version: 1.0
Content-Type: multipart/mixed; boundary="NextPart"

--NextPart
Content-Type: text/html

${htmlTemplate}

--NextPart
Content-Type: application/pdf
Content-Disposition: attachment; filename="OfferLetter.pdf"
Content-Transfer-Encoding: base64

${pdfData.buffer.toString('base64')}

--NextPart--`
      }
  };

  try {
      await AWS_SES.sendRawEmail(params).promise();
      return { ok: true };
  } catch (error) {
      console.log("email error", error);
      return { ok: false, error: error?.message || "Email service failed" };
  }
}



module.exports = {
    sendEmail: sendEmail,
    sendOfferEmail:sendOfferEmail
};