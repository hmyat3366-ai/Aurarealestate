export const AGENCY_CONFIG = {
  name: "Vane & Sterling",
  legalName: "Vane & Sterling Real Estate Ltd",
  tagline: "Curators of Prime & Exceptional Residential Property",
  description:
    "An independent, partner-led real estate agency specializing in the sale, acquisition, and letting of prestigious residential residences across Prime Central London and renowned European retreats.",
  address: {
    line1: "42 Berkeley Square",
    line2: "Mayfair",
    city: "London",
    postalCode: "W1J 5AW",
    country: "United Kingdom",
  },
  contact: {
    phone: "+44 (0)20 7946 0880",
    phoneDisplay: "+44 (0)20 7946 0880",
    email: process.env.NEXT_PUBLIC_AGENCY_EMAIL || "privateoffice@vaneandsterling.com",
    salesEmail: "sales@vaneandsterling.com",
    lettingsEmail: "lettings@vaneandsterling.com",
    pressEmail: "press@vaneandsterling.com",
  },
  officeHours: [
    { days: "Monday – Friday", hours: "08:30 – 18:30 GMT" },
    { days: "Saturday", hours: "10:00 – 16:00 GMT (By Appointment)" },
    { days: "Sunday & Bank Holidays", hours: "Private Client Appointments Only" },
  ],
  regulatory: {
    registrationNumber: "08291410",
    ricsRegulated: true,
    propertyOmbudsmanMember: true,
    amlComplianceOfficer: "A. Sterling, Compliance Director",
  },
  social: {
    instagram: "https://instagram.com",
    linkedin: "https://linkedin.com",
    architecturalDigest: "https://architecturaldigest.com",
  },
};
