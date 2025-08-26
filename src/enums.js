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
    "Currencies": {
      "USD": "$",
      "PLN": "zł",
      "EUR": "€",
    },
    "TAILWIND_BREAKPOINTS": {
      "sm": "640", //px
      "md": "768", //px
      "lg": "1024", //px
      "xl": "1280", //px
    }
};
