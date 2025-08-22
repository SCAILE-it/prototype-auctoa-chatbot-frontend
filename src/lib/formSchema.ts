import { z } from "zod";

// Form validation schema for the property evaluation form
export const propertyFormSchema = z.object({
  // Step 1: Data Collection
  // Standort (Location)
  address: z.string().min(1, "Adresse ist erforderlich"),
  
  // Objekttyp & Basisdaten (Property Type & Basic Data)
  propertyType: z.string().min(1, "Immobilientyp ist erforderlich"),
  apartmentType: z.string().min(1, "Wohnungstyp ist erforderlich"),
  constructionYear: z.string().min(1, "Baujahr ist erforderlich"),
  livingSpace: z.string().min(1, "Wohnfläche ist erforderlich"),
  numberOfRooms: z.string().min(1, "Anzahl der Zimmer ist erforderlich"),
  floor: z.string().min(1, "Stockwerk ist erforderlich"),
  
  // Zustand & Ausstattung (Condition & Equipment)
  condition: z.string().min(1, "Zustand ist erforderlich"),
  equipment: z.string().min(1, "Ausstattung ist erforderlich"),
  lastRenovation: z.string().min(1, "Letzte Modernisierung ist erforderlich"),
  
  // Energie & Rechtliche Aspekte (Optional)
  energyValue: z.string().optional(),
  currentRent: z.string().optional(),
  targetRent: z.string().optional(),
  legalAspects: z.string().optional(),
  
  // Sonstige Angaben (Additional Information)
  additionalInfo: z.string().optional(),
  
  // Step 2: Analysis (placeholder for now)
  analysisData: z.object({}).optional(),
  
  // Step 3: Results (placeholder for now)
  estimatedValue: z.number().optional(),
});

export type PropertyFormData = z.infer<typeof propertyFormSchema>;

// Options for dropdowns
export const propertyTypeOptions = [
  { value: "apartment", label: "Wohnung" },
  { value: "house", label: "Haus" },
  { value: "commercial", label: "Gewerbe" },
] as const;

export const apartmentTypeOptions = [
  { value: "1-room", label: "1-Zimmer" },
  { value: "2-room", label: "2-Zimmer" },
  { value: "3-room", label: "3-Zimmer" },
  { value: "4-room", label: "4-Zimmer" },
  { value: "5-room", label: "5+ Zimmer" },
] as const;

export const conditionOptions = [
  { value: "excellent", label: "Sehr gut" },
  { value: "good", label: "Gut" },
  { value: "fair", label: "Befriedigend" },
  { value: "poor", label: "Renovierungsbedürftig" },
] as const;

export const equipmentOptions = [
  { value: "basic", label: "Einfach" },
  { value: "standard", label: "Standard" },
  { value: "high", label: "Gehoben" },
  { value: "luxury", label: "Luxus" },
] as const;

export const renovationOptions = [
  { value: "never", label: "Nie" },
  { value: "over-20", label: "Vor über 20 Jahren" },
  { value: "10-20", label: "Vor 10-20 Jahren" },
  { value: "5-10", label: "Vor 5-10 Jahren" },
  { value: "under-5", label: "Vor weniger als 5 Jahren" },
] as const;
