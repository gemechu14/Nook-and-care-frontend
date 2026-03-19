"use client";

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
  const parseNum = (s: string): number | null => {
    const v = parseFloat(s);
    return Number.isNaN(v) ? null : v;
  };

  return (
    <form onSubmit={onSave} className="space-y-6">
      {success && (
        <div className="rounded-lg border border-green-200 bg-green-50 p-3 text-sm font-medium text-green-700">
          Location saved successfully.
        </div>
      )}

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
