import ListingCard from "./ListingCard";

// Mock data - replace with API call
const featuredListings = [
  {
    id: "1",
    title: "Sunset Senior Living",
    location: "Los Angeles, CA",
    careType: "Assisted Living",
    roomType: "Private",
    price: 3500,
    rating: 4.5,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Pool", "Gym", "24/7 Care"],
  },
  {
    id: "2",
    title: "Harmony Gardens",
    location: "San Diego, CA",
    careType: "Memory Care",
    roomType: "Semi-Private",
    price: 4200,
    rating: 4.8,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Garden", "Activities"],
  },
  {
    id: "3",
    title: "Golden Years Residence",
    location: "San Francisco, CA",
    careType: "Independent Living",
    roomType: "Private",
    price: 3800,
    rating: 4.7,
    image: "/placeholder-listing.jpg",
    amenities: ["WiFi", "Pool", "Library"],
  },
];

export default function FeaturedListings() {
  return (
    <div className="grid md:grid-cols-3 gap-6">
      {featuredListings.map((listing) => (
        <ListingCard key={listing.id} listing={listing} />
      ))}
    </div>
  );
}

