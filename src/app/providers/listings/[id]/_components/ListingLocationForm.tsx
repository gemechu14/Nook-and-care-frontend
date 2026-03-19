"use client";

import { useMemo, useState } from "react";

interface ListingLocationFormProps {
  latitude: number | null;
  longitude: number | null;
  saving: boolean;
  success: boolean;
  onSave: (e: React.FormEvent) => void;
  onLatitudeChange: (value: number | null) => void;
  onLongitudeChange: (value: number | null) => void;
}

export function ListingLocationForm({
  latitude,
  longitude,
  saving,
  success,
  onSave,
  onLatitudeChange,
  onLongitudeChange,
}: ListingLocationFormProps) {
  const [mapLink, setMapLink] = useState("");
  const [linkError, setLinkError] = useState<string | null>(null);

  const parseNum = (s: string): number | null => {
    const v = parseFloat(s);
    return Number.isNaN(v) ? null : v;
  };

  const mapsHref = useMemo(() => {
    if (latitude !== null && longitude !== null) {
      return `https://www.google.com/maps?q=${latitude},${longitude}`;
    }
    return "https://www.google.com/maps";
  }, [latitude, longitude]);

  const extractCoordinatesFromGoogleLink = (
    urlLike: string,
  ): { latitude: number; longitude: number } | null => {
    const input = urlLike.trim();
    if (!input) return null;

    const directCoords = input.match(
      /^\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*$/,
    );
    if (directCoords) {
      return {
        latitude: Number(directCoords[1]),
        longitude: Number(directCoords[2]),
      };
    }

    const atCoords = input.match(/@(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i);
    if (atCoords) {
      return {
        latitude: Number(atCoords[1]),
        longitude: Number(atCoords[2]),
      };
    }

    const qCoords = input.match(/[?&](?:q|ll)=(-?\d+(?:\.\d+)?),\s*(-?\d+(?:\.\d+)?)/i);
    if (qCoords) {
      return {
        latitude: Number(qCoords[1]),
        longitude: Number(qCoords[2]),
      };
    }

    return null;
  };

  const applyMapLinkCoordinates = () => {
    const coords = extractCoordinatesFromGoogleLink(mapLink);
    if (!coords) {
      setLinkError("Could not detect coordinates. Paste a Google Maps link or lat,lng.");
      return;
    }

    if (coords.latitude < -90 || coords.latitude > 90) {
      setLinkError("Latitude must be between -90 and 90.");
      return;
    }
    if (coords.longitude < -180 || coords.longitude > 180) {
      setLinkError("Longitude must be between -180 and 180.");
      return;
    }

    setLinkError(null);
    onLatitudeChange(coords.latitude);
    onLongitudeChange(coords.longitude);
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          Location saved successfully.
        </div>
      )}

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Google Maps (Optional)</h2>
        <p className="mt-1 text-xs text-slate-600">
          Open Google Maps, pick a point, then paste the share link to auto-fill coordinates.
        </p>
        <div className="mt-4 grid gap-3 sm:grid-cols-[1fr_auto]">
          <input
            type="text"
            value={mapLink}
            onChange={(e) => {
              setMapLink(e.target.value);
              if (linkError) setLinkError(null);
            }}
            placeholder="Paste Google Maps link or lat,lng"
            className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
          />
          <button
            type="button"
            onClick={applyMapLinkCoordinates}
            className="rounded-lg border border-slate-300 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50"
          >
            Use coordinates
          </button>
        </div>
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <a
            href={mapsHref}
            target="_blank"
            rel="noreferrer"
            className="text-xs font-medium text-teal-600 transition-colors hover:text-teal-700"
          >
            Open in Google Maps
          </a>
          {linkError ? <p className="text-xs text-red-600">{linkError}</p> : null}
        </div>
      </div>

      <div className="rounded-xl border border-slate-200 bg-slate-50/60 p-4">
        <h2 className="text-sm font-semibold text-slate-900">Coordinates</h2>
        <p className="mt-1 text-xs text-slate-600">
          Set latitude and longitude for map display. Use decimal degrees (e.g. 47.6062, -122.3321).
        </p>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Latitude</label>
            <input
              type="number"
              step="any"
              value={latitude ?? ""}
              onChange={(e) => onLatitudeChange(parseNum(e.target.value))}
              placeholder="e.g. 47.6062"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">Longitude</label>
            <input
              type="number"
              step="any"
              value={longitude ?? ""}
              onChange={(e) => onLongitudeChange(parseNum(e.target.value))}
              placeholder="e.g. -122.3321"
              className="w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm outline-none transition-colors focus:border-teal-500 focus:ring-2 focus:ring-teal-500"
            />
          </div>
        </div>
      </div>

      <div className="flex justify-end border-t border-slate-200 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="rounded-lg bg-teal-600 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {saving ? "Saving…" : "Save location"}
        </button>
      </div>
    </form>
  );
}
