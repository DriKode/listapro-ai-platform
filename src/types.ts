export type PropertyType = "Casa" | "Departamento" | "Terreno" | "Penthouse";
export type OperationType = "Venta" | "Renta";

export interface PropertyFormState {
  propertyType: PropertyType;
  operation: OperationType;
  address: string;
  cityState: string;
  priceBob: string;
  priceUsd: string;
  bedrooms: string;
  bathrooms: string;
  builtArea: string;
  plotArea: string;
  parking: string;
  amenities: string[];
  shortDescription: string;
  coverImage: string | null; // Base64 data URL
  extraImages: string[]; // Base64 data URLs
  agentName: string;
  agentPhone: string;
  agentEmail: string;
  agentPhoto: string | null;
}

export interface GeneratedResult {
  title: string;
  description: string;
  instagramCopy: string;
  keyHighlights: string[];
  estimatedValueTagline: string;
  isFallback?: boolean;
  fallbackReason?: string;
}
