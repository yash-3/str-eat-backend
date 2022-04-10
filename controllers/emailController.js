const PDFDocument = require('pdfkit-table');
const fs = require('fs');
const nodemailer = require("nodemailer");
const sendgridTransport = require("nodemailer-sendgrid-transport");
require('dotenv').config();
const queue = require('queue');
//import queue from 'queue';
//import fetch from "node-fetch";

const transporter = nodemailer.createTransport(
    sendgridTransport({
      auth: {
        api_key: process.env.SENDGRID_KEY,
      },
    })
  );


async function exists (path) {  
  try {
    await fs.access(path)
    return true
  } catch {
    return false
  }
}
module.exports = function(orderObject) {
    const doc = new PDFDocument;
    
    const filePath = `orderBills/bill${orderObject._id}.pdf`;
    var totalPrice=0;
    //doc.end();
    doc.pipe(fs.createWriteStream(filePath));
    var price = orderObject.items.forEach(element => {
        totalPrice += element.item.price*element.quantity;
    });
    doc
    const table0 = {
      title: "Order Details",
      headers: ["Order Id", "Total Price","Seller"],
      rows: [
        [`${orderObject._id}`,`${totalPrice}`,`${orderObject.seller.name}`],
      ],
    };
    doc.table( table0,{ 
      width: 500,
    }); 
    
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
            //content: attachment,
            name: `bill${orderObject._id}.pdf`,
            path: pathToAttachment
            //type: "application/pdf",
            //disposition: "attachment"
        }
        ]
    };
      transporter.sendMail(mailOptions,function(err) {
        if(err){
          console.log("Failed to send mail\n");
          return;
        }
        console.log("Mail send \n");
      },
      //transporter.close()
      );

      doc.end();
      //stream.end();
}  


