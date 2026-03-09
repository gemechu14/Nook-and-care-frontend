import Link from "next/link";
import Image from "next/image";

// Mock data - replace with API call
const mockListing = {
  id: "1",
  title: "Sunset Senior Living",
  location: "Los Angeles, CA",
  address: "123 Main Street, Los Angeles, CA 90001",
  careType: "Assisted Living",
  roomType: "Private",
  price: 3500,
  rating: 4.5,
  reviewCount: 24,
  images: [
    "/placeholder-listing.jpg",
    "/placeholder-listing.jpg",
    "/placeholder-listing.jpg",
  ],
  description: "Sunset Senior Living offers exceptional care in a warm, welcoming environment. Our facility provides 24/7 assistance with daily activities while promoting independence and dignity.",
  amenities: ["WiFi", "Pool", "Gym", "24/7 Care", "Meals", "Transportation"],
  services: ["Medical Care", "Physical Therapy", "Social Activities"],
  languages: ["English", "Spanish"],
};

export default function ListingDetailPage({ params }: { params: { id: string } }) {
  const listing = mockListing;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <Link href="/search" className="text-blue-600 hover:underline">
            ← Back to Search
          </Link>
        </nav>

        {/* Main Content */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Image Gallery */}
          <div className="relative h-96 bg-gray-200">
            <Image
              src={listing.images[0] || "/placeholder-listing.jpg"}
              alt={listing.title}
              fill
              className="object-cover"
            />
          </div>

          <div className="p-8">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{listing.title}</h1>
                <p className="text-gray-600 text-lg">{listing.location}</p>
                <p className="text-gray-500">{listing.address}</p>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-blue-600">
                  ${listing.price.toLocaleString()}
                </div>
                <div className="text-gray-500">per month</div>
              </div>
            </div>

            {/* Rating and Care Type */}
            <div className="flex items-center gap-4 mb-6">
              <div className="flex items-center">
                <span className="text-yellow-400 text-xl">★</span>
                <span className="ml-1 font-semibold">{listing.rating}</span>
                <span className="text-gray-500 ml-1">({listing.reviewCount} reviews)</span>
              </div>
              <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm">
                {listing.careType}
              </span>
              <span className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm">
                {listing.roomType} Room
              </span>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="lg:col-span-2">
                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">About</h2>
                  <p className="text-gray-700 leading-relaxed">{listing.description}</p>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Amenities</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {listing.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✓</span>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="mb-8">
                  <h2 className="text-2xl font-semibold mb-4">Services</h2>
                  <div className="grid md:grid-cols-2 gap-3">
                    {listing.services.map((service, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <span className="text-blue-500">•</span>
                        <span>{service}</span>
                      </div>
                    ))}
                  </div>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold mb-4">Languages Spoken</h2>
                  <div className="flex gap-2">
                    {listing.languages.map((lang, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-gray-100 rounded-full text-sm"
                      >
                        {lang}
                      </span>
                    ))}
                  </div>
                </section>
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-1">
                <div className="bg-gray-50 p-6 rounded-lg sticky top-4">
                  <h3 className="text-xl font-semibold mb-4">Book a Tour</h3>
                  <p className="text-gray-600 mb-6">
                    Schedule an in-person or virtual tour to see this facility.
                  </p>
                  <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition mb-4">
                    Schedule Tour
                  </button>
                  <button className="w-full border border-gray-300 py-3 rounded-lg font-semibold hover:bg-gray-50 transition">
                    Save to Favorites
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

