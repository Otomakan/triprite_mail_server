// import service from './adminService'
import {Request, Response} from 'express'
import services from './issueTicketServices'
import logger from '../config/winston';

class IssueTicketController {
   
    constructor () {
        this.issueTicket = this.issueTicket.bind(this)
        this.checkValidBody = this.checkValidBody.bind(this)
    }
    private checkApiKey(req:Request){
        if(req.header('apikey')!== process.env.ISSUE_VERIFICATION_API_KEY){
            console.log('wrong key babe')
            return false
        }
        return true
    }

    private checkValidBody(targetEmail,reservationDetails, passengerDetails, flightDetails){
        if(!targetEmail||!reservationDetails || !passengerDetails ||!flightDetails){
            if(reservationDetails.orderID){
                try{
                    services.notifyIssueErrorToAdmin(reservationDetails.orderID, {targetEmail,reservationDetails, passengerDetails, flightDetails}, "An Invalid Body request was sent to the server")
                }
                catch(e){
                    logger.error(e.toString())
                }
            }
            return false
        }
        return true
    }
    
    async issueTicket (req:Request, res:Response)  {
        if(!this.checkApiKey(req))
            return res.status(401).json({errorMessage: "GET OUT OF HERE"})
        
        const {targetEmail, reservationDetails, passengerDetails, flightDetails} = req.body

        if(!this.checkValidBody(targetEmail,reservationDetails, passengerDetails, flightDetails)){
            return res.status(400).json({errorMessage: "Invalid Request"})
        }
        
        try{
            await services.sendConfirmationEmail(targetEmail,reservationDetails,passengerDetails, flightDetails)
            console.log("SUCCESS")
            return res.status(200).send({message:"email sent"})
        }
        catch(e){
            logger.error(e.toString())
            try{
                services.notifyIssueErrorToAdmin(reservationDetails.orderID, {reservationDetails, passengerDetails, flightDetails}, e.toString())
            }
            catch(e){
                return res.status(400).json({errorMessage: e.toString()})
            }
            return res.status(400).json({errorMessage: e.toString()})
        }
    }


 
}

export default IssueTicketController