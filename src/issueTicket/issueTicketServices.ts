import axios from 'axios'
const Email = require('email-templates')
import logger from '../config/winston'
import {format, parseISO} from 'date-fns'
const base64ToS3 = require('nodemailer-base64-to-s3')
import createSendGridTransporter from '../utils/createSendGridTransporter'


const sendConfirmationEmail = async (reservationDetails, passengerDetails, flightDetails) => {

    try {
        console.log('in send confimration email')
        const { firstName, lastName } = passengerDetails[0]
        console.log('oh oh')
        const toEmail = reservationDetails.email
        // const PNR = reservationDetails.airlinePNR
        
        console.log('before tranporter')
        const transporter = createSendGridTransporter()
        console.log('got transporter')
        const base64s3Options = {
            aws:{
                accessKeyId:process.env.AWS_TRIPRITE_ACCESSKEYID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                params:{
                    Bucket: process.env.EMAIL_BUCKET_NAME
                }
            }
        }
        console.log('got options')

        transporter.use('compile', base64ToS3(base64s3Options))
        
        const email = new Email({
            message: {
                from: 'flights@triprite.com',
                to: toEmail,
            },
            send:true,
            transport: transporter,
            juiceResources: {
                preserveImportant: true,
                webResources: {
                  //
                  // this is the relative directory to your CSS/image assets
                  // and its default path is `build/`:
                  //
                  // e.g. if you have the following in the `<head`> of your template:
                  // `<link rel="stylesheet" href="style.css" data-inline="data-inline">`
                  // then this assumes that the file `build/style.css` exists
                  //
                  relativeTo: __dirname+'/../emailTemplates/testEmailTemplate',
                  images: true // <--- set this as `true`
                  //
                  // but you might want to change it to something like:
                  // relativeTo: path.join(__dirname, '..', 'assets')
                  // (so that you can re-use CSS/images that are used in your web-app)
                  //
                }
              }
        })

        let content:object 
    
     
        flightDetails.forEach((flightDetail)=>{
            flightDetail['departureDateTime'] = format(parseISO(flightDetail['departureDateTime']), 'dd MMMMM HH:MM')
            flightDetail['arrivalDateTime'] = format(parseISO(flightDetail['arrivalDateTime']), 'dd MMMM HH:MM')
            
        })
       console.log('formated flight dates')
        // Make the DOB readable
        passengerDetails.forEach(passenger=>{
            passenger.dateOfBirth = format(parseISO(passenger.dateOfBirth), 'dd MMMM yyyy')
        })

        try {
            content =  {
                template:__dirname+'/../emailTemplates/testEmailTemplate',
                message: {
                to: toEmail
                },
                locals: {
                    Email, 
                    firstName,  
                    lastName,
                    passengerDetails,
                    reservationDetails,
                    flightDetails
                }
            }
        }
        catch(e){
            console.log(e)
            throw e
        }
        // }
        return await email
        .send(content)
        .then((res)=>{
            console.log('yay it worked')
            try {
                forwardBookingToAdmin({reservationDetails})
            }
            catch(e){
                throw e
            }
            return true
        })
        .catch((e)=>{
            console.log('hmm something went wrong when populating the pug file')
            console.log(e)
            throw e
        });
    }
    catch (e) {
        throw e
    }
}


const forwardBookingToAdmin = (bookingInformation) => {
    const adminEmailAddress = process.env.ADMIN_EMAIL_ADDRESS

    const transporter = createSendGridTransporter()
    console.log(adminEmailAddress)
    console.log(bookingInformation)
    console.log('AND')
    Object.keys(bookingInformation).forEach(el=>{console.log(el)})
    const email = {
        from:'server@triprite.com',
        to: adminEmailAddress,
        subject: 'Reservation :' + bookingInformation.reservationDetails.airlinePNR,
        text: JSON.stringify(bookingInformation),
    }
    try{
        transporter.sendMail(email)
    }
    catch(e){
        // logger('forwarding email to admin', e.toString())
        throw e
    }
  }
const notifyIssueErrorToAdmin = (orderID, bookingInformation, errorMessage) => {
    try{
        const adminEmailAddress = process.env.ADMIN_EMAIL_ADDRESS
        const transporter = createSendGridTransporter()
        console.log(bookingInformation)
        const email = {
            from:'server@triprite.com',
            to: adminEmailAddress,
            subject: 'There was an issue with the reservation with order ID ' + orderID,
            text: errorMessage + "\n\n"  + JSON.stringify(bookingInformation),
        }
    
        transporter.sendMail(email)
    }
    catch(e){
        logger('notify issue error to admin', e.toString())
    }
}

export default {
    sendConfirmationEmail,
    notifyIssueErrorToAdmin
}