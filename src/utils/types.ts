 export type FlightDetails = { 
  id: number
  flightID: string
  carrierId: string
  flightNum: string
  origin: string
  destination: string
  departureDateTime: string
  arrivalDateTime: string
  class: string
  fareBasisCode: string
  validatingCarrier: string
  originAirportName: string
  originAirportCity: string
  originAirportCountry: string
  destinationAirportName: string
  destinationAirportCity: string
  destinationAirportCountry: string
  airlineName: string
  majorClassCode: string
  meal: string
  mile: string
  orgTerminal: string
  destTerminal: string
  carryOnBaggage: string
  duration: string | number,
  price: string
  basePrice: string
  noOfStops: number,
  NoOfStops: number
 }