import { useState } from "react";
import API from "../service/api";

const Testimonials = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    feedbackText: "",
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" }); // clear error on change
  };

  const validate = () => {
    const newErrors = {};

    // Full Name
    if (!formData.fullName.trim()) newErrors.fullName = "Full Name is required";

    // Email validation
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    // Phone validation
    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\d{10}$/.test(formData.phone)) {
      newErrors.phone = "Phone number must be 10 digits";
    }

    // Country & City
    if (!formData.country.trim()) newErrors.country = "Country is required";
    if (!formData.city.trim()) newErrors.city = "City is required";

    // Feedback
    if (!formData.feedbackText.trim())
      newErrors.feedbackText = "Feedback is required";

    setErrors(newErrors);

    // Return true if no errors
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return; // stop if validation fails

    try {
      const res = await API.post("/testimonials", formData);
      alert(res.data.message);
      setFormData({
        fullName: "",
        email: "",
        phone: "",
        country: "",
        city: "",
        feedbackText: "",
      });
    } catch (error) {
      console.error("Error submitting testimonial:", error);
      alert("Failed to submit testimonial");
    }
  };

  return (
    <>
      <h2
        className="text-start mb-2 mt-2 text-2xl md:text-3xl font-bold text-orange-500"
        style={{ fontFamily: "Poppins" }}
      >
        Add Testimonials
      </h2>
      <div className="w-full border-b-2 border-[#FAA533] mb-8"></div>
      <div className="w-full max-w-4xl mx-auto p-6 rounded-2xl bg-white shadow-md">
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div className="grid grid-cols-1">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Full Name
              </label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.fullName
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              />
              {errors.fullName && (
                <p className="text-red-500 text-sm mt-1">{errors.fullName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Mobile Number
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Enter Phone Number"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.phone
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Email
              </label>
              <input
                type="text"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter Email"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Country
              </label>
              <input
                type="text"
                name="country"
                value={formData.country}
                onChange={handleChange}
                placeholder="Enter Country Name"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.country
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              />
              {errors.country && (
                <p className="text-red-500 text-sm mt-1">{errors.country}</p>
              )}
            </div>
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                City
              </label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                placeholder="Enter City Name"
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.city
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              />
              {errors.city && (
                <p className="text-red-500 text-sm mt-1">{errors.city}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-1">
            <div>
              <label className="block text-gray-700 mb-1 font-medium">
                Feedback
              </label>
              <textarea
                name="feedbackText"
                rows="4"
                value={formData.feedbackText}
                onChange={handleChange}
                placeholder="Write your testimonial here..."
                className={`w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 ${
                  errors.feedbackText
                    ? "border-red-500 focus:ring-red-300"
                    : "border-gray-300 focus:ring-orange-300"
                }`}
              ></textarea>
              {errors.feedbackText && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.feedbackText}
                </p>
              )}
            </div>
          </div>

          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-orange-500 hover:bg-orange-600 text-white font-semibold px-8 py-3 rounded-lg transition duration-300 ease-in-out"
            >
              Submit
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default Testimonials;
