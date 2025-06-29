export const getSatellites = async () => {
  return [
    {
      id: 1,
      name: "Hubble Space Telescope",
      launchDate: "1990-04-24",
      status: "Active",
      orbitType: "LEO",
      agency: "NASA",
      country: "USA",
      purpose: "Astronomy & Observation",
      duration: "30+ years"
    },
    {
      id: 2,
      name: "GPS IIF-3",
      launchDate: "2012-10-04",
      status: "Active",
      orbitType: "MEO",
      agency: "USAF",
      country: "USA",
      purpose: "Navigation",
      duration: "15 years"
    },
    {
      id: 3,
      name: "INSAT-3C",
      launchDate: "2002-01-24",
      status: "Decommissioned",
      orbitType: "GEO",
      agency: "ISRO",
      country: "India",
      purpose: "Communication",
      duration: "12 years"
    },
  ];
};
