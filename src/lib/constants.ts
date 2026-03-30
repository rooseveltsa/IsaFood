// Centralized business constants - single source of truth
export const BUSINESS = {
  name: "Isa Fitness",
  domain: "isafood.com",
  whatsapp: {
    number: "5561996925018",
    display: "(61) 99692-5018",
  },
  pix: "37152661120",
  instagram: "isafitnessfood",
  instagramUrl: "https://instagram.com/isafitnessfood",
  address: "Brasilia - DF",
  hours: {
    weekdays: "Seg-Sex: 8h as 18h",
    saturday: "Sab: 8h as 14h",
  },
  deliveryAreas: [
    "Plano Piloto",
    "Aguas Claras",
    "Taguatinga",
    "Ceilandia",
    "Guara",
    "Sobradinho",
    "Planaltina",
  ],
} as const;

export const whatsappUrl = (message: string) =>
  `https://wa.me/${BUSINESS.whatsapp.number}?text=${encodeURIComponent(message)}`;
