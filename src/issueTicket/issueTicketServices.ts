const Email = require('email-templates')
import logger from '../config/winston'
import {format, parseISO} from 'date-fns'
import createSendGridTransporter from '../utils/createSendGridTransporter'
import { resolve } from 'path'
import {FlightDetails} from '../utils/types'

const sendConfirmationEmail = async (targetEmail,reservationDetails, passengerDetails, flightDetails: Array<FlightDetails>) => {
    try {
        const { firstName, lastName } = passengerDetails[0]
        const toEmail = targetEmail
        console.log(flightDetails)
        const transporter = createSendGridTransporter()
        console.log(reservationDetails.created_at)
        reservationDetails.created_at = reservationDetails.created_at.match(/[0-9][0-9][0-9][0-9]-[0-9][0-9]-[0-9][0-9]/)[0]
        flightDetails.forEach((flight,i)=>{
            flightDetails[i].noOfStops = flight.NoOfStops
        })
        console.log(flightDetails)
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
                  relativeTo: resolve(__dirname,'../emailTemplates/issueTicketTemplate'),
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
        // Make the DOB readable
        passengerDetails.forEach(passenger=>{
            if(passenger.dateOfBirth){
                passenger.dateOfBirth = format(parseISO(passenger.dateOfBirth), 'dd MMMM yyyy')
            }
        })

        try {
            content =  {
                template: resolve(__dirname,'../emailTemplates/issueTicketTemplate'),
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
            throw e
        }
        return await email
        .send(content)
        .then((res)=>{
            console.log('yay it worked')
            try {
                forwardBookingToAdmin({reservationDetails})
                console.log('passed forward booking')
                return true
            }
            catch(e){
                throw e
            }
        })
        .catch((e)=>{
            console.log('hmm something went wrong when populating the pug file')
            console.log(e)
            throw e
        });
        
    }
    catch (e) {
        logger.error('', e)
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
        return true
    }
    catch(e){
        logger.error('forwarding email to admin', e.toString())
        return
    }
  }
const notifyIssueErrorToAdmin = (orderID, bookingInformation, errorMessage) => {
    try{
        const adminEmailAddress = process.env.ADMIN_EMAIL_ADDRESS
        const transporter = createSendGridTransporter()
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