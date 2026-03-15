"use client";

import { useState } from "react";

export default function AssessmentPage() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 5;

  // Form data state
  const [formData, setFormData] = useState({
    // Step 1
    firstName: "",
    age: "",
    relationship: "",
    livingSituation: "",
    
    // Step 2
    mobilityLevel: "",
    dailyLivingAssistance: [] as string[],
    
    // Step 3
    cognitiveStatus: "",
    medicalConditions: [] as string[],
    medicalCareNeeds: [] as string[],
    
    // Step 4
    socialPreferences: [] as string[],
    dietaryNeeds: [] as string[],
    importantAmenities: [] as string[],
    
    // Step 5
    budgetRange: 2000,
    paymentMethod: "",
    preferredLocation: "",
    careTimeline: "",
  });

  const progress = (currentStep / totalSteps) * 100;

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleCheckboxChange = (category: keyof typeof formData, value: string) => {
    const currentArray = formData[category] as string[];
    const updatedArray = currentArray.includes(value)
      ? currentArray.filter((item) => item !== value)
      : [...currentArray, value];
    setFormData({ ...formData, [category]: updatedArray });
  };

  const handleSubmit = () => {
    console.log("Form submitted:", formData);
    // Redirect to results page
  };

  return (
    <div className="min-h-screen bg-teal-50 pt-16">
      <div className="max-w-3xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-900 mb-2">Care Needs Assessment</h1>
          <p className="text-sm text-slate-600">Answer a few questions to get personalized care recommendations.</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-slate-700">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-xs font-medium text-slate-700">{Math.round(progress)}% complete</span>
          </div>
          <div className="w-full bg-slate-200 rounded-full h-2">
            <div
              className="bg-slate-800 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-8">
          {/* Step 1: Basic Information */}
          {currentStep === 1 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Let's start with some basic information</h2>
              <p className="text-sm text-slate-600 mb-6">Tell us about your loved one so we can find the best care options.</p>

              <div className="space-y-4">
                {/* First two fields side by side */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">
                      Loved one's first name
                    </label>
                    <input
                      type="text"
                      value={formData.firstName}
                      onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                      placeholder="First name"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-slate-700 mb-2">Approximate age</label>
                    <input
                      type="number"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      placeholder="Age"
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-400"
                    />
                  </div>
                </div>

                {/* Dropdowns full width */}
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Your relationship</label>
                  <div className="relative">
                    <select
                      value={formData.relationship}
                      onChange={(e) => setFormData({ ...formData, relationship: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white text-slate-900 pr-10"
                    >
                      <option value="">Select relationship</option>
                      <option value="spouse">Spouse</option>
                      <option value="child">Child</option>
                      <option value="parent">Parent</option>
                      <option value="sibling">Sibling</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Current living situation</label>
                  <div className="relative">
                    <select
                      value={formData.livingSituation}
                      onChange={(e) => setFormData({ ...formData, livingSituation: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white text-slate-900 pr-10"
                    >
                      <option value="">Select current situation</option>
                      <option value="home">Living at home</option>
                      <option value="assisted-living">Assisted living facility</option>
                      <option value="nursing-home">Nursing home</option>
                      <option value="hospital">Hospital</option>
                      <option value="other">Other</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Mobility & Physical Needs */}
          {currentStep === 2 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Mobility & Physical Needs</h2>
              <p className="text-sm text-slate-600 mb-6">Help us understand their physical capabilities and needs.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Mobility Level</label>
                  <div className="space-y-2">
                    {[
                      { value: "independent", label: "Independent", desc: "Walks without assistance" },
                      { value: "some-assistance", label: "Some Assistance", desc: "Uses cane, walker, or occasional help" },
                      { value: "wheelchair", label: "Wheelchair User", desc: "Primarily uses wheelchair for mobility" },
                      { value: "limited", label: "Limited Mobility", desc: "Requires significant assistance or bedbound" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                          formData.mobilityLevel === option.value
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="mobilityLevel"
                          value={option.value}
                          checked={formData.mobilityLevel === option.value}
                          onChange={(e) => setFormData({ ...formData, mobilityLevel: e.target.value })}
                          className="mt-0.5 w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">
                    Daily Living Assistance Needed
                  </label>
                  <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Bathing/showering",
                      "Dressing",
                      "Eating/feeding",
                      "Toileting",
                      "Medication management",
                      "Mobility assistance",
                      "Grooming",
                      "Transfers (bed/chair)",
                    ].map((item) => (
                      <label
                        key={item}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.dailyLivingAssistance.includes(item)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.dailyLivingAssistance.includes(item)}
                          onChange={() => handleCheckboxChange("dailyLivingAssistance", item)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{item}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Cognitive & Medical Needs */}
          {currentStep === 3 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Cognitive & Medical Needs</h2>
              <p className="text-sm text-slate-600 mb-6">This helps us recommend the right level of care.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Cognitive status</label>
                  <div className="space-y-2">
                    {[
                      { value: "no-concerns", label: "No Concerns", desc: "Sharp and alert, no memory issues" },
                      { value: "mild", label: "Mild Memory Issues", desc: "Occasional forgetfulness, generally aware" },
                      { value: "dementia", label: "Dementia/Alzheimer's", desc: "Diagnosed with dementia or Alzheimer's" },
                      { value: "severe", label: "Severe Cognitive Decline", desc: "Significant confusion, may not recognize family" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-start gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                          formData.cognitiveStatus === option.value
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="cognitiveStatus"
                          value={option.value}
                          checked={formData.cognitiveStatus === option.value}
                          onChange={(e) => setFormData({ ...formData, cognitiveStatus: e.target.value })}
                          className="mt-0.5 w-4 h-4 text-teal-600 border-slate-300 focus:ring-teal-500"
                        />
                        <div className="flex-1">
                          <div className="text-sm font-medium text-slate-900">{option.label}</div>
                          <div className="text-xs text-slate-500">{option.desc}</div>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Medical Conditions</label>
                  <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Diabetes",
                      "Heart disease",
                      "COPD/Respiratory",
                      "Parkinson's",
                      "Stroke recovery",
                      "Cancer",
                      "Kidney disease",
                      "Arthritis",
                      "Vision impairment",
                      "Hearing impairment",
                    ].map((condition) => (
                      <label
                        key={condition}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.medicalConditions.includes(condition)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.medicalConditions.includes(condition)}
                          onChange={() => handleCheckboxChange("medicalConditions", condition)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{condition}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Medical Care Needs</label>
                  <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Insulin injections",
                      "Wound care",
                      "Physical therapy",
                      "Oxygen therapy",
                      "Catheter care",
                      "IV therapy",
                      "Feeding tube",
                      "Dialysis",
                    ].map((need) => (
                      <label
                        key={need}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.medicalCareNeeds.includes(need)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.medicalCareNeeds.includes(need)}
                          onChange={() => handleCheckboxChange("medicalCareNeeds", need)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{need}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Preferences & Lifestyle */}
          {currentStep === 4 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Preferences & Lifestyle</h2>
              <p className="text-sm text-slate-600 mb-6">Help us find a community that matches their personality.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">
                    What's important for their social life?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Active social calendar",
                      "Religious services",
                      "Pet-friendly environment",
                      "Outdoor activities",
                      "Arts & music programs",
                      "Fitness classes",
                      "Quiet, peaceful setting",
                      "Family-style dining",
                    ].map((pref) => (
                      <label
                        key={pref}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.socialPreferences.includes(pref)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.socialPreferences.includes(pref)}
                          onChange={() => handleCheckboxChange("socialPreferences", pref)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{pref}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Dietary Needs</label>
                  <p className="text-xs text-slate-500 mb-3">Select all that apply</p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Diabetic diet",
                      "Low sodium",
                      "Soft/pureed food",
                      "Vegetarian/Vegan",
                      "Kosher",
                      "Halal",
                      "Gluten-free",
                      "Food allergies",
                    ].map((diet) => (
                      <label
                        key={diet}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.dietaryNeeds.includes(diet)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.dietaryNeeds.includes(diet)}
                          onChange={() => handleCheckboxChange("dietaryNeeds", diet)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{diet}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">What features matter most?</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      "Private room",
                      "Private bathroom",
                      "Outdoor spaces",
                      "On-site beauty salon",
                      "Transportation services",
                      "WiFi access",
                      "Cable TV",
                      "Housekeeping",
                    ].map((amenity) => (
                      <label
                        key={amenity}
                        className={`flex items-center gap-2 p-2 border rounded-lg cursor-pointer transition-colors ${
                          formData.importantAmenities.includes(amenity)
                            ? "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={formData.importantAmenities.includes(amenity)}
                          onChange={() => handleCheckboxChange("importantAmenities", amenity)}
                          className="w-4 h-4 text-teal-600 border-slate-300 rounded focus:ring-teal-500"
                        />
                        <span className="text-xs text-slate-700">{amenity}</span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 5: Budget & Timeline */}
          {currentStep === 5 && (
            <div>
              <h2 className="text-xl font-bold text-slate-900 mb-2">Budget & Timeline</h2>
              <p className="text-sm text-slate-600 mb-6">Almost done! Let us know your budget and when you need care.</p>

              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">Monthly Budget Range</label>
                  <div className="px-2">
                    <input
                      type="range"
                      min="0"
                      max="8000"
                      step="500"
                      value={formData.budgetRange}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          budgetRange: parseInt(e.target.value),
                        })
                      }
                      className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-600"
                      style={{
                        background: `linear-gradient(to right, #0f172a 0%, #0f172a ${(formData.budgetRange / 8000) * 100}%, #e2e8f0 ${(formData.budgetRange / 8000) * 100}%, #e2e8f0 100%)`,
                      }}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-2">
                      <span>$0</span>
                      <span className="font-medium text-slate-900 text-sm">
                        ${formData.budgetRange.toLocaleString()}
                        {formData.budgetRange >= 8000 ? "+" : ""}
                      </span>
                      <span>$8,000+</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">
                    Insurance/Payment Method
                  </label>
                  <div className="relative">
                    <select
                      value={formData.paymentMethod}
                      onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                      className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none appearance-none bg-white text-slate-900 pr-10"
                    >
                      <option value="">Select primary payment method</option>
                      <option value="medicare">Medicare</option>
                      <option value="medicaid">Medicaid</option>
                      <option value="private-insurance">Private Insurance</option>
                      <option value="long-term-care">Long-term Care Insurance</option>
                      <option value="private-pay">Private Pay</option>
                      <option value="va-benefits">VA Benefits</option>
                    </select>
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                      <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-2">Preferred Location</label>
                  <input
                    type="text"
                    value={formData.preferredLocation}
                    onChange={(e) => setFormData({ ...formData, preferredLocation: e.target.value })}
                    placeholder="City, State, or ZIP code"
                    className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none text-slate-900 placeholder:text-slate-400"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-slate-700 mb-3">When do you need care?</label>
                  <div className="space-y-2">
                    {[
                      { value: "urgent", label: "Urgent - Within the next week" },
                      { value: "30-days", label: "Within 30 days" },
                      { value: "1-3-months", label: "1-3 months" },
                      { value: "3-6-months", label: "3-6 months" },
                      { value: "researching", label: "Just researching options" },
                    ].map((option) => (
                      <label
                        key={option.value}
                        className={`flex items-center gap-3 p-2.5 border rounded-lg cursor-pointer transition-colors ${
                          formData.careTimeline === option.value
                            ? option.value === "urgent"
                              ? "border-red-500 bg-red-50"
                              : "border-teal-600 bg-teal-50"
                            : "border-slate-200 hover:bg-slate-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name="careTimeline"
                          value={option.value}
                          checked={formData.careTimeline === option.value}
                          onChange={(e) => setFormData({ ...formData, careTimeline: e.target.value })}
                          className={`w-4 h-4 ${
                            option.value === "urgent" && formData.careTimeline === option.value
                              ? "text-red-600"
                              : "text-teal-600"
                          } border-slate-300 focus:ring-teal-500`}
                        />
                        <span
                          className={`text-sm text-slate-700 ${
                            option.value === "urgent" && formData.careTimeline === option.value
                              ? "text-red-600 font-medium"
                              : ""
                          }`}
                        >
                          {option.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-200">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                currentStep === 1
                  ? "text-slate-300 cursor-not-allowed"
                  : "text-slate-700 border border-slate-300 bg-white hover:bg-slate-50"
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {currentStep < totalSteps ? (
              <button
                onClick={handleNext}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                Continue
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={handleSubmit}
                className="flex items-center gap-2 px-5 py-2.5 bg-teal-600 text-white rounded-lg text-sm font-semibold hover:bg-teal-700 transition-colors"
              >
                Get Recommendations
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500 mt-6">
          Your information is kept confidential and only used to provide personalized recommendations.
        </p>
      </div>
    </div>
  );
}
