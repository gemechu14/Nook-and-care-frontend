"use client";

export type TabId =
  | "details"
  | "images"
  | "features";

export interface ListingTabItem {
  id: TabId;
  label: string;
  description?: string;
  count?: number;
}
