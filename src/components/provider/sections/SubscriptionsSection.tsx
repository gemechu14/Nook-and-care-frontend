export function SubscriptionsSection() {
  const plans = [
    { 
      name: "FREE", 
      price: "$0", 
      features: ["Up to 3 listings", "Basic support"],
      current: true
    },
    { 
      name: "PRO", 
      price: "$99/mo", 
      features: ["Unlimited listings", "Priority support", "Analytics"],
      current: false
    },
    { 
      name: "PREMIUM", 
      price: "$199/mo", 
      features: ["Unlimited listings", "Featured placement", "Priority support", "Advanced analytics"],
      current: false
    },
  ];

  return (
    <div className="space-y-4">
      <div>
        <h2 className="text-lg font-bold text-slate-900">Subscription Plan</h2>
        <p className="text-sm text-slate-500">Manage your subscription and billing</p>
      </div>
      
      <div className="grid md:grid-cols-3 gap-4">
        {plans.map((plan) => (
          <div 
            key={plan.name} 
            className={`bg-white rounded-xl border p-6 ${
              plan.current ? "border-teal-500 ring-2 ring-teal-500/20" : "border-slate-200"
            }`}
          >
            {plan.current && (
              <div className="mb-3">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-100 text-teal-700">
                  Current Plan
                </span>
              </div>
            )}
            <h3 className="font-bold text-slate-900 mb-1">{plan.name}</h3>
            <p className="text-2xl font-bold text-teal-600 mb-4">{plan.price}</p>
            <ul className="space-y-2 text-sm text-slate-600 mb-4">
              {plan.features.map((f, i) => (
                <li key={i} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-teal-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  {f}
                </li>
              ))}
            </ul>
            <button 
              className={`w-full py-2 rounded-lg font-medium transition-colors ${
                plan.current
                  ? "bg-slate-100 text-slate-600 cursor-not-allowed"
                  : "bg-teal-600 text-white hover:bg-teal-700"
              }`}
              disabled={plan.current}
            >
              {plan.current ? "Current Plan" : "Subscribe"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

