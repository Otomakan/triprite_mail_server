const nodemailer = require('nodemailer')
 
 const createSendGridTransporter = () => {
    return nodemailer.createTransport({    
        service: "'SendGrid'",
        auth: {
            user: process.env.SENDGRID_USERNAME,
            pass: process.env.SENDGRID_PASSWORD
        },
        send:true,  
        transport: {
            jsonTransport: true
          }
    })
}
export default createSendGridTransporter