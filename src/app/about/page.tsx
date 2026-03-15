export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="w-full px-4 md:px-8 lg:px-12 xl:px-16 py-16">
        <h1 className="text-4xl font-bold mb-8 text-center">About Nook and Care</h1>
        
        <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Mission</h2>
            <p className="text-gray-700 leading-relaxed">
              Nook and Care is dedicated to helping families find the perfect senior housing 
              facility for their loved ones. We understand that choosing the right care facility 
              is one of the most important decisions you&apos;ll make, and we&apos;re here to make that 
              process easier and more transparent.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">What We Do</h2>
            <p className="text-gray-700 leading-relaxed mb-4">
              Our platform connects families with verified senior housing facilities across the 
              country. We provide:
            </p>
            <ul className="list-disc list-inside space-y-2 text-gray-700">
              <li>Comprehensive search and filtering options</li>
              <li>Detailed facility information and photos</li>
              <li>Verified listings with quality assurance</li>
              <li>Easy tour booking system</li>
              <li>Reviews and ratings from families</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold mb-4">Our Commitment</h2>
            <p className="text-gray-700 leading-relaxed">
              Every facility on our platform undergoes a verification process to ensure quality 
              and safety. We work closely with providers to maintain high standards and provide 
              families with accurate, up-to-date information.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

