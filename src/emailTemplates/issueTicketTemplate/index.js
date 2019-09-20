var pug = require('pug');
var nodemailer = require('nodemailer');
var path = require('path');
var fs = require('fs');

var data = require('./data')
data.images = require('./images')
data.pretty = true;

var sendEmail = true;

var content = pug.renderFile('email_template.pug', data);

var transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'SENDER_EMAIL',
    pass: 'SENDER_PASSWORD'
  }
});

var email_list = [
  'd.jackson@triprite.com',
  'dustinbjackson@yahoo.com'
];

var mailOptions = {
  from: 'SENDER_EMAIL',
  to: email_list,
  subject: 'New Html Email Test 2',
  html: content
};

if (sendEmail) {
  transporter.sendMail(mailOptions, function(error, info){
    if (error) {
      console.log(error);
    } else {
      console.log('Email sent: ' + info.response);
    }
  });
}

fs.writeFile('rendered.html', content, function(err) {
    if(err) {
        return console.log(err);
    }

    console.log("The file was saved!");
});
