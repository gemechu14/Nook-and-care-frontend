// import { catalogApi } from "@/services/catalogService";
// import type { CatalogKey, CatalogItem, CatalogFormState } from "./types";

// const API_MAP = {
//   amenities: catalogApi.amenities,
//   activities: catalogApi.activities,
//   languages: catalogApi.languages,
//   certifications: catalogApi.certifications,
//   diningOptions: catalogApi.diningOptions,
//   safetyFeatures: catalogApi.safetyFeatures,
//   insuranceOptions: catalogApi.insuranceOptions,
//   houseRules: catalogApi.houseRules,
//   equipment: catalogApi.equipment,
//   treatmentServices: catalogApi.treatmentServices,
// } as const;

// export async function listCatalogItems(
//   key: CatalogKey,
//   skip: number,
//   limit: number
// ): Promise<CatalogItem[]> {
//   return API_MAP[key].list({ skip, limit });
// }

// export async function createCatalogItem(
//   key: CatalogKey,
//   form: CatalogFormState
// ): Promise<CatalogItem> {
//   const api = API_MAP[key];
//   const trimmed = (v: string) => v.trim() || null;

//   switch (key) {
//     case "amenities":
//       return api.create({
//         name: form.name.trim(),
//         category: form.category.trim(),
//         icon: trimmed(form.icon),
//       });
//     case "activities":
//       return api.create({
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "languages":
//       return api.create({ code: form.code.trim(), name: form.name.trim() });
//     case "certifications":
//       return api.create({ name: form.name.trim(), description: trimmed(form.description) });
//     case "diningOptions":
//       return api.create({ name: form.name.trim(), description: trimmed(form.description) });
//     case "safetyFeatures":
//       return api.create({
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "insuranceOptions":
//       return api.create({ name: form.name.trim(), description: trimmed(form.description) });
//     case "houseRules":
//       return api.create({
//         name: form.name.trim(),
//         description: trimmed(form.description),
//         category: form.category.trim(),
//       });
//     case "equipment":
//       return api.create({
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "treatmentServices":
//       return api.create({ name: form.name.trim(), description: trimmed(form.description) });
//     default:
//       throw new Error("Unsupported catalog type.");
//   }
// }

// export async function updateCatalogItem(
//   key: CatalogKey,
//   id: string,
//   form: CatalogFormState
// ): Promise<CatalogItem> {
//   const api = API_MAP[key];
//   const trimmed = (v: string) => v.trim() || null;

//   switch (key) {
//     case "amenities":
//       return api.update(id, {
//         name: form.name.trim(),
//         category: form.category.trim(),
//         icon: trimmed(form.icon),
//       });
//     case "activities":
//       return api.update(id, {
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "languages":
//       return api.update(id, { code: form.code.trim(), name: form.name.trim() });
//     case "certifications":
//       return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
//     case "diningOptions":
//       return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
//     case "safetyFeatures":
//       return api.update(id, {
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "insuranceOptions":
//       return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
//     case "houseRules":
//       return api.update(id, {
//         name: form.name.trim(),
//         description: trimmed(form.description),
//         category: form.category.trim(),
//       });
//     case "equipment":
//       return api.update(id, {
//         name: form.name.trim(),
//         category: form.category.trim(),
//         description: trimmed(form.description),
//       });
//     case "treatmentServices":
//       return api.update(id, { name: form.name.trim(), description: trimmed(form.description) });
//     default:
//       throw new Error("Unsupported catalog type.");
//   }
// }

// export async function deleteCatalogItem(key: CatalogKey, id: string): Promise<void> {
//   await API_MAP[key].delete(id);
// }

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

// ✅ LIST
export async function listCatalogItems(
  key: CatalogKey,
  skip: number,
  limit: number
): Promise<CatalogItem[]> {
  return API_MAP[key].list({ skip, limit });
}

// ✅ CREATE
export async function createCatalogItem(
  key: CatalogKey,
  form: CatalogFormState
): Promise<CatalogItem> {
  const trimmed = (v?: string) => (v ? v.trim() : "") || null;

  switch (key) {
    case "amenities":
      return catalogApi.amenities.create({
        name: form.name.trim(),
        category: form.category.trim(),
        icon: trimmed(form.icon),
      });

    case "activities":
      return catalogApi.activities.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "languages":
      return catalogApi.languages.create({
        code: form.code.trim(),
        name: form.name.trim(),
      });

    case "certifications":
      return catalogApi.certifications.create({
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "diningOptions":
      return catalogApi.diningOptions.create({
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "safetyFeatures":
      return catalogApi.safetyFeatures.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "insuranceOptions":
      return catalogApi.insuranceOptions.create({
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "houseRules":
      return catalogApi.houseRules.create({
        name: form.name.trim(),
        description: trimmed(form.description),
        category: form.category.trim(),
      });

    case "equipment":
      return catalogApi.equipment.create({
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "treatmentServices":
      return catalogApi.treatmentServices.create({
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    default:
      throw new Error("Unsupported catalog type.");
  }
}

// ✅ UPDATE
export async function updateCatalogItem(
  key: CatalogKey,
  id: string,
  form: CatalogFormState
): Promise<CatalogItem> {
  const trimmed = (v?: string) => (v ? v.trim() : "") || null;

  switch (key) {
    case "amenities":
      return catalogApi.amenities.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        icon: trimmed(form.icon),
      });

    case "activities":
      return catalogApi.activities.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "languages":
      return catalogApi.languages.update(id, {
        code: form.code.trim(),
        name: form.name.trim(),
      });

    case "certifications":
      return catalogApi.certifications.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "diningOptions":
      return catalogApi.diningOptions.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "safetyFeatures":
      return catalogApi.safetyFeatures.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "insuranceOptions":
      return catalogApi.insuranceOptions.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    case "houseRules":
      return catalogApi.houseRules.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
        category: form.category.trim(),
      });

    case "equipment":
      return catalogApi.equipment.update(id, {
        name: form.name.trim(),
        category: form.category.trim(),
        description: trimmed(form.description),
      });

    case "treatmentServices":
      return catalogApi.treatmentServices.update(id, {
        name: form.name.trim(),
        description: trimmed(form.description),
      });

    default:
      throw new Error("Unsupported catalog type.");
  }
}

// ✅ DELETE
export async function deleteCatalogItem(
  key: CatalogKey,
  id: string
): Promise<void> {
  await API_MAP[key].delete(id);
}