const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const nodemailer = require("nodemailer");
const generatePDF = require("./pdfGenerator");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require('dotenv').config();
const queue = require('queue');

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_KEY,
      },
    })
  );


module.exports = function(orderObject) {
    
    const filePath = `orderBills/bill${orderObject._id}.pdf`;
    new generatePDF(filePath,orderObject);
    
    const pathToAttachment = `orderBills/bill${orderObject._id}.pdf`;
    const attachment = fs.readFileSync(pathToAttachment).toString("base64");
    var mailOptions = {
        from: process.env.SENDGRID_SENDER_MAIL,
        to: orderObject.user.email,
        subject: "StrEAT-Order Accepted",
        html: `
            <p>Thank you for your order, Please find attached Order Details</p>`,
        attachments: [
        {
            name: `bill${orderObject._id}.pdf`,
            path: pathToAttachment
        }
        ]
    };
      transporter.sendMail(mailOptions,function(err) {
        if(err){
          console.log("Failed to send mail\n");
          return;
        }
        console.log("Mail send \n");
      });

}  


