import { api } from "@/lib/axios";
import type {
  Amenity,
  Activity,
  Language,
  Certification,
  DiningOption,
  SafetyFeature,
  InsuranceOption,
  HouseRule,
  Equipment,
  TreatmentService,
} from "@/types/listing";

function makeList<T>(resource: string) {
  return {
    list: (params?: { skip?: number; limit?: number }) => {
      const q = new URLSearchParams();
      if (params)
        Object.entries(params).forEach(
          ([k, v]) => v !== undefined && q.set(k, String(v))
        );
      const qs = q.toString();
      return api.get<T[]>(`/${resource}${qs ? `?${qs}` : ""}`);
    },
  };
}

export const catalogApi = {
  amenities: makeList<Amenity>("amenities"),
  activities: makeList<Activity>("activities"),
  languages: makeList<Language>("languages"),
  certifications: makeList<Certification>("certifications"),
  diningOptions: makeList<DiningOption>("dining-options"),
  safetyFeatures: makeList<SafetyFeature>("safety-features"),
  insuranceOptions: makeList<InsuranceOption>("insurance-options"),
  houseRules: makeList<HouseRule>("house-rules"),
  equipment: makeList<Equipment>("equipment"),
  treatmentServices: makeList<TreatmentService>("treatment-services"),
};







