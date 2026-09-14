export const wasteCategories = [
  {
    key: "wet",
    label: "Wet & Organic Waste",
    color: "#2fd077",
    hint: "Kitchen scraps, vegetable peels, food leftovers, fallen leaves, garden trimmings.",
    timing: "Daily: 06:30 AM - 09:30 AM"
  },
  {
    key: "dry",
    label: "Dry & Recyclable Waste",
    color: "#4c9eff",
    hint: "Paper, cardboard, plastic bottles, glass containers, clean metal cans (rinsed & dry).",
    timing: "Tuesday, Thursday, Saturday: 07:00 AM - 10:00 AM"
  },
  {
    key: "hazardous",
    label: "Hazardous & Sanitary E-Waste",
    color: "#f1594f",
    hint: "Batteries, tube lights, expired medicines, sanitary napkins, aerosol cans, syringes.",
    timing: "Wednesday & Sunday: 08:00 AM - 11:00 AM"
  }
];

export const wardSchedules = [
  {
    wardId: "W-04",
    wardName: "MG Road (Ward 04)",
    supervisor: "Officer R. Sharma",
    phone: "+91 80 2296 1104",
    morningSlot: "06:30 AM - 09:30 AM",
    eveningSlot: "05:00 PM - 07:30 PM",
    primaryTruck: "KA-01-EA-4821 (Hydraulic Compactor)",
    collectionDays: {
      wet: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dry: ["Tue", "Thu", "Sat"],
      hazardous: ["Wed", "Sun"]
    }
  },
  {
    wardId: "W-08",
    wardName: "Koramangala (Ward 08)",
    supervisor: "Officer P. Rao",
    phone: "+91 80 2296 1108",
    morningSlot: "06:00 AM - 09:00 AM",
    eveningSlot: "04:30 PM - 07:00 PM",
    primaryTruck: "KA-01-ME-1104 (Road Sweeper)",
    collectionDays: {
      wet: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dry: ["Mon", "Wed", "Fri"],
      hazardous: ["Sun"]
    }
  },
  {
    wardId: "W-12",
    wardName: "Indiranagar (Ward 12)",
    supervisor: "Officer A. Hegde",
    phone: "+91 80 2296 1112",
    morningSlot: "07:00 AM - 10:00 AM",
    eveningSlot: "05:30 PM - 08:00 PM",
    primaryTruck: "KA-01-EV-9012 (Zero Emission Mini Tipper)",
    collectionDays: {
      wet: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dry: ["Tue", "Thu", "Sat"],
      hazardous: ["Wed", "Sat"]
    }
  },
  {
    wardId: "W-15",
    wardName: "Jayanagar (Ward 15)",
    supervisor: "Officer K. Narayanan",
    phone: "+91 80 2296 1115",
    morningSlot: "06:15 AM - 09:15 AM",
    eveningSlot: "05:00 PM - 07:30 PM",
    primaryTruck: "KA-01-EV-9012 (Zero Emission Mini Tipper)",
    collectionDays: {
      wet: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      dry: ["Mon", "Wed", "Fri", "Sat"],
      hazardous: ["Thu", "Sun"]
    }
  }
];

export const municipalAlerts = [
  {
    id: 1,
    title: "Independence Day Public Holiday Advisory",
    date: "15 August 2026",
    type: "Schedule Adjustment",
    message: "No municipal collection on national holiday. Bulk and routine pickup shifts to the next working day morning.",
    urgent: false
  },
  {
    id: 2,
    title: "Ganesh Chaturthi Festival Segregation Guidelines",
    date: "25 August 2026",
    type: "Special Protocol",
    message: "Dry & organic puja flower waste collection only. Wet food waste resumes the subsequent morning.",
    urgent: true
  },
  {
    id: 3,
    title: "Monsoon Hotspot Vector Prevention Drive",
    date: "Ongoing",
    type: "Public Health Notice",
    message: "Citizens are requested to report stagnant uncollected bins to prevent mosquito breeding.",
    urgent: false
  }
];
