export const Enums = {
    "AppointmentStatus": {
        "Pending": "pending",
        "Confirmed": "confirmed",
        "Cancelled": "cancelled"
    },
    "Role": {
        "Client": "client",
        "Provider": "provider",
        "Admin": "admin"
    },
    "Languages": [
      {
        "code" : "pl",
        "name" : "Polski",
        "defaultCurrency" : "PLN"
      },
      {
        "code" : "en",
        "name" : "English",
        "defaultCurrency" : "USD"
      }
    ],
    "Currencies": [
      {
        "symbol" : "$",
        "name" : "USD",
        "rate" : "1",
        "default": false,
        "id": 1
      },
      {
        "symbol" : "zł",
        "name" : "PLN",
        "rate" : "4.1",
        "default": true,
        "id": 2
      },
      {
        "symbol" : "€",
        "name" : "EUR",
        "rate" : "0.92",
        "default": false,
        "id": 3
      }
    ],
    "TAILWIND_BREAKPOINTS": {
      "sm": "640", //px
      "md": "768", //px
      "lg": "1024", //px
      "xl": "1280", //px
    }
};
