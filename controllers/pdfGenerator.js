const pdfKit = require('pdfkit');
const fs = require('fs');

let fileName = './files/sample-invoice.pdf';
let fontNormal = 'Helvetica';
let fontBold = 'Helvetica-Bold';

let companyInfo = {
    "companyName": "StrEat",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380009",
    "country": "India",
    "contactNo": "+919100050600"
}

let sellerInfo = {
    "companyName": "StrEat",
    "address": "Ahmedabad",
    "city": "Ahmedabad",
    "state": "Gujarat",
    "pincode": "380009",
    "country": "India",
    "contactNo": "+919100050600"
}

let customerInfo = {
    "name": "Customer ABC",
    "address": "R783, Rose Apartments, Santacruz (E)",
    "city": "Mumbai",
    "state": "Maharashtra",
    "pincode": "400054",
    "country": "India",
    "contactNo": "+910000000787"
}

let orderInfo = {
    "items": [
        {
            "item.title": "Acer Aspire E573",
            "item.price": 39999,
            "quantity": 1
        }
    ]
}

module.exports = function(fileName,orderObject) {
    try {

        let pdfDoc = new pdfKit();
        let customerInfo = orderObject.user;
        let orderInfo = orderObject.items;
        let sellerInfo = orderObject.seller;
        let stream = fs.createWriteStream(fileName);
        const timeElapsed = Date.now();
        const todayDate = new Date(timeElapsed);
        let companyLogo = "./images/samosa.png";
        pdfDoc.pipe(stream);

        
        pdfDoc.font(fontNormal).fontSize(14).text('Order Invoice', 400, 30, { width: 200 });
        pdfDoc.fontSize(10).text(todayDate.toDateString(), 400, 46, { width: 200 });

        pdfDoc.image(companyLogo, 27, 20, { width: 60, height: 60 });
        pdfDoc.font(fontBold).fontSize(14).text('StrEat', 27, 85);
        pdfDoc.font(fontNormal).text("Ahmedabad", 27, 100, { width: 250 });
        pdfDoc.text(companyInfo.pincode, 27, 115, { width: 250 });
        pdfDoc.text(companyInfo.country, 27, 130, { width: 250 });

        pdfDoc.font(fontBold).text("Customer details:", 400, 100);
        pdfDoc.font(fontNormal).text(customerInfo.name, 400, 115, { width: 250 });
        pdfDoc.text(customerInfo.address.locality, 400, 130, { width: 250 });
        pdfDoc.text(customerInfo.address.zip, 400, 145, { width: 250 });

        pdfDoc.font(fontBold).text("Seller details:", 27, 180);
        pdfDoc.font(fontNormal).text("Name: " + sellerInfo.name, 27, 195, { width: 250 });
        pdfDoc.text("Contact No: " + sellerInfo.phone, 27, 210, { width: 250 });

        pdfDoc.rect(27, 250, 560, 20).fill("#FC427B").stroke("#FC427B");
        pdfDoc.fillColor("#fff").text("Item", 27, 256, { width: 130 });
        pdfDoc.text("Quantity", 180, 256, { width: 100 });
        pdfDoc.text("Price per Item", 310, 256, { width: 100 });
        pdfDoc.text("Total Price", 440, 256, { width: 100 });

        let productNo = 1;
        orderInfo.forEach(i => {
            //console.log("adding", item.quantity);
            let y = 256 + (productNo * 20);
            pdfDoc.fillColor("#000").text(i.item.title, 27, y, { width: 130 });
            pdfDoc.text(i.quantity, 185, y, { width: 100 });
            pdfDoc.text(i.item.price, 320, y, { width: 100 });
            pdfDoc.text((i.quantity*i.item.price), 445, y, { width: 100 });
            productNo++;
        });

        pdfDoc.rect(27, 256 + (productNo * 20), 560, 0.2).fillColor("#000").stroke("#000");
        productNo++;

        var totalPrice = 0;
        orderInfo.forEach(i => {
            totalPrice += i.item.price*i.quantity;
        });

        pdfDoc.font(fontBold).text("Total:", 400, 256 + (productNo * 17));

        pdfDoc.font(fontBold).text(totalPrice, 445, 256 + (productNo * 17));

        pdfDoc.end();
        console.log("pdf generate successfully");
    } catch (error) {
        console.log("Error occurred", error);
    }
}
