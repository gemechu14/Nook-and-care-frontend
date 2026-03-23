import { catalogApi } from "@/services/catalogService";
import type { CatalogKey, CatalogItem, CatalogFormState } from "./types";

const API_MAP = {
  amenities: catalogApi.amenities,
  activities: catalogApi.activities,
  languages: catalogApi.languages,
  certifications: catalogApi.certifications,
  diningOptions: catalogApi.diningOptions,
  safetyFeatures: catalogApi.safetyFeatures,
  insuranceOptions: catalogApi.insuranceOptions,
  houseRules: catalogApi.houseRules,
  equipment: catalogApi.equipment,
  treatmentServices: catalogApi.treatmentServices,
} as const;

export async function listCatalogItems(
  key: CatalogKey,
  skip: number,
  limit: number
): Promise<CatalogItem[]> {
  return API_MAP[key].list({ skip, limit });
}

export async function createCatalogItem(
  key: CatalogKey,
  form: CatalogFormState
): Promise<CatalogItem> {
  const api = API_MAP[key];
  const trimmed = (v: string) => v.trim() || null;

  switch (key) {
    case "amenities":
      return api.create({
        name: form.name.trim(),
        category: form.category.trim(),
        icon: trimmed(form.icon),
      });
    case "activities":
      return api.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "languages":
      return api.create({ code: form.code.trim(), name: form.name.trim() });
    case "certifications":
      return api.create({ name: form.name.trim(), description: trimmed(form.description) });
    case "diningOptions":
      return api.create({ name: form.name.trim(), description: trimmed(form.description) });
    case "safetyFeatures":
      return api.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "insuranceOptions":
      return api.create({ name: form.name.trim(), description: trimmed(form.description) });
    case "houseRules":
      return api.create({
        name: form.name.trim(),
        description: trimmed(form.description),
        category: form.category.trim(),
      });
    case "equipment":
      return api.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "treatmentServices":
      return api.create({ name: form.name.trim(), description: trimmed(form.description) });
    default:
      throw new Error("Unsupported catalog type.");
  }
}

export async function updateCatalogItem(
  key: CatalogKey,
  id: string,
  form: CatalogFormState
): Promise<CatalogItem> {
  const api = API_MAP[key];
  const trimmed = (v: string) => v.trim() || null;

  switch (key) {
    case "amenities":
      return api.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        icon: trimmed(form.icon),
      });
    case "activities":
      return api.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "languages":
      return api.update(id, { code: form.code.trim(), name: form.name.trim() });
    case "certifications":
      return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
    case "diningOptions":
      return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
    case "safetyFeatures":
      return api.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "insuranceOptions":
      return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
    case "houseRules":
      return api.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
        category: form.category.trim(),
      });
    case "equipment":
      return api.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });
    case "treatmentServices":
      return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
    default:
      throw new Error("Unsupported catalog type.");
  }
}

export async function deleteCatalogItem(key: CatalogKey, id: string): Promise<void> {
  await API_MAP[key].delete(id);
}
