// Static data for now. Later this will be replaced by API responses.
// Add or remove machines by editing this list; the view adapts automatically.

export const hourlyProductionMock = [
  {
    id: "rh",
    machine: "RH Assembly",
    shift: "A",
    shiftHours: "06:00 – 14:00",
    targetPerHour: 32, // ~112 sec cycle time
    hours: [
      { hour: "06–07", production: 30 },
      { hour: "07–08", production: 33 },
      { hour: "08–09", production: 31 },
      { hour: "09–10", production: 26 }, // tea break
      { hour: "10–11", production: 34 },
      { hour: "11–12", production: 32 },
      { hour: "12–13", production: 29 },
      { hour: "13–14", production: 35 },
    ],
  },
  {
    id: "lh",
    machine: "LH Assembly",
    shift: "A",
    shiftHours: "06:00 – 14:00",
    targetPerHour: 36, // ~100 sec cycle time
    hours: [
      { hour: "06–07", production: 34 },
      { hour: "07–08", production: 37 },
      { hour: "08–09", production: 36 },
      { hour: "09–10", production: 30 }, // tea break
      { hour: "10–11", production: 38 },
      { hour: "11–12", production: 35 },
      { hour: "12–13", production: 33 },
      { hour: "13–14", production: 39 },
    ],
  },
];