module.exports = {
  confirmationNumber: 'B2JJWE',
  flights: [
    {
      number: '0728',
      duration: '11h 04m',
      airlineLogo: '',
      date: 'September 15, 2019 at 3:00pm',
      from: {
        city: 'Philadelphia',
        airport: 'International airport',
        acronym: 'PHL'
      },
      to: {
        city: 'London Heathrow',
        airport: 'International airport',
        acronym: 'LHR'
      },
      stops: ['FLL']
    },
    {
      number: '8174',
      duration: '4h 04m',
      airlineLogo: '',
      date: 'September 21, 2019 at 12:05am',
      from: {
        city: 'London Heathrow',
        airport: 'International airport',
        acronym: 'LHR'
      },
      to: {
        city: 'Dublin',
        airport: 'Another airport',
        acronym: 'DBX'
      },
      stops: []
    }
  ],
  billing: {
    purchaseDate: '09/08/2019',
    currencyName: 'US dollars',
    currencySymbol: '$',
    subtotalBilling: 615.82,
    subtotalTaxes: 28.20,
    total: 644.02,
    passengers: [
      {
        name: 'Mr. Dustin Jackson',
        price: 307.91
      },
      {
        name: 'Mrs. Elizabeth DeAntonio',
        price: 307.91
      }
    ],
    fees: [
      {
        name: 'Passenger Facility Tax',
        price: 9.00
      },
      {
        name: 'Security Fee',
        price: 11.20
      },
      {
        name: 'Segmnet Fee',
        price: 8.00
      },
      {
        name: 'Triprite Processing Fee',
        price: 0.00
      }
    ]
  }
};
