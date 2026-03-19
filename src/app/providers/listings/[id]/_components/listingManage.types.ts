"use client";

export type TabId =
  | "details"
  | "images"
  | "location"
  | "features";

export interface ListingTabItem {
  id: TabId;
  label: string;
  description?: string;
  count?: number;
}
