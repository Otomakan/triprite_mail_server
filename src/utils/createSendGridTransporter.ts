const nodemailer = require('nodemailer')
const base64ToS3 = require('nodemailer-base64-to-s3')
 
 const createSendGridTransporter = () => {
    const transporter =  nodemailer.createTransport({    
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
    const base64s3Options = {
        aws:{
            accessKeyId:process.env.AWS_TRIPRITE_ACCESSKEYID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            params:{
                Bucket: process.env.EMAIL_BUCKET_NAME
            }
        }
    }

    transporter.use('compile', base64ToS3(base64s3Options))
    return transporter
    
}
export default createSendGridTransporter