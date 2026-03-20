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

type CreateAmenityBody = {
  name: string;
  category: string;
  icon?: string | null;
};
type UpdateAmenityBody = Partial<CreateAmenityBody>;

type CreateActivityBody = {
  name: string;
  category: string;
  description?: string | null;
};
type UpdateActivityBody = Partial<CreateActivityBody>;

type CreateLanguageBody = {
  code: string;
  name: string;
};
type UpdateLanguageBody = Partial<CreateLanguageBody>;

type CreateCertificationBody = {
  name: string;
  description?: string | null;
};
type UpdateCertificationBody = Partial<CreateCertificationBody>;

type CreateDiningOptionBody = {
  name: string;
  description?: string | null;
};
type UpdateDiningOptionBody = Partial<CreateDiningOptionBody>;

type CreateSafetyFeatureBody = {
  name: string;
  category: string;
  description?: string | null;
};
type UpdateSafetyFeatureBody = Partial<CreateSafetyFeatureBody>;

type CreateInsuranceOptionBody = {
  name: string;
  description?: string | null;
};
type UpdateInsuranceOptionBody = Partial<CreateInsuranceOptionBody>;

type CreateHouseRuleBody = {
  name: string;
  description?: string | null;
  category: string;
};
type UpdateHouseRuleBody = Partial<CreateHouseRuleBody>;

type CreateEquipmentBody = {
  name: string;
  category: string;
  description?: string | null;
};
type UpdateEquipmentBody = Partial<CreateEquipmentBody>;

type CreateTreatmentServiceBody = {
  name: string;
  description?: string | null;
};
type UpdateTreatmentServiceBody = Partial<CreateTreatmentServiceBody>;

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

function makeCrud<T, C, U>(resource: string) {
  return {
    ...makeList<T>(resource),
    create: (body: C) => api.post<T>(`/${resource}`, body),
    update: (id: string, body: U) => api.put<T>(`/${resource}/${id}`, body),
    delete: (id: string) => api.delete<void>(`/${resource}/${id}`),
  };
}

export const catalogApi = {
  amenities: makeCrud<Amenity, CreateAmenityBody, UpdateAmenityBody>("amenities"),
  activities: makeCrud<Activity, CreateActivityBody, UpdateActivityBody>("activities"),
  languages: makeCrud<Language, CreateLanguageBody, UpdateLanguageBody>("languages"),
  certifications: makeCrud<Certification, CreateCertificationBody, UpdateCertificationBody>(
    "certifications",
  ),
  diningOptions: makeCrud<DiningOption, CreateDiningOptionBody, UpdateDiningOptionBody>(
    "dining-options",
  ),
  safetyFeatures: makeCrud<SafetyFeature, CreateSafetyFeatureBody, UpdateSafetyFeatureBody>(
    "safety-features",
  ),
  insuranceOptions: makeCrud<InsuranceOption, CreateInsuranceOptionBody, UpdateInsuranceOptionBody>(
    "insurance-options",
  ),
  houseRules: makeCrud<HouseRule, CreateHouseRuleBody, UpdateHouseRuleBody>("house-rules"),
  equipment: makeCrud<Equipment, CreateEquipmentBody, UpdateEquipmentBody>("equipment"),
  treatmentServices: makeCrud<
    TreatmentService,
    CreateTreatmentServiceBody,
    UpdateTreatmentServiceBody
  >("treatment-services"),
};







