import React, { useState } from "react";
import API from "../service/api";

const AddAds = () => {
  const [title, setTitle] = useState("");
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!title || !image || !startDate || !endDate) {
      setSnackbar({
        open: true,
        message: "Please fill all fields and upload an image!",
        severity: "warning",
      });
      return;
    }

    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("title", title);
      formData.append("image", image);
      formData.append("startDate", startDate);
      formData.append("endDate", endDate);

      const res = await API.post("/ads", formData);

      setSnackbar({
        open: true,
        message: res.data.message || "Ad created successfully!",
        severity: "success",
      });

      setTitle("");
      setImage(null);
      setPreview(null);
      setStartDate("");
      setEndDate("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create ad",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
    }
  };

  return (
    <div className="flex flex-col items-center md:items-start px-4 sm:px-8 py-6 font-poppins">
      {/* Heading */}
      <h2
        className="text-2xl md:text-3xl font-bold text-[#EF7722] mb-4 text-center md:text-left"
        style={{ fontFamily: "Poppins" }}
      >
        Add Advertisement
      </h2>
      <div className="w-full border-b-2 border-[#FAA533] mb-8"></div>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-md p-6 space-y-5"
      >
        {/* Title */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Ad Title
          </label>
          <input
            type="text"
            placeholder="Enter ad title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Start Date */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Start Date
          </label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* End Date */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            End Date
          </label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          />
        </div>

        {/* Image Upload */}
        <div>
          <label className="block text-gray-700 font-semibold mb-2">
            Upload Image
          </label>
          <label className="cursor-pointer bg-gradient-to-r from-[#FAA533] to-[#EF7722] text-white px-4 py-2 rounded-lg shadow-md hover:from-[#FA812F] hover:to-[#ED3F27] inline-block">
            Choose File
            <input
              type="file"
              hidden
              accept="image/*"
              onChange={handleImageChange}
            />
          </label>

          {preview && (
            <div className="mt-4 rounded-xl overflow-hidden shadow-lg transition-transform duration-300 hover:scale-105">
              <img
                src={preview}
                alt="Ad Preview"
                className="w-full h-56 object-cover"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className={`w-full mt-3 py-2.5 rounded-lg text-white font-semibold text-lg shadow-md transition-all duration-300 ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-[#FAA533] to-[#EF7722] hover:from-[#FA812F] hover:to-[#ED3F27]"
          }`}
        >
          {loading ? "Submitting..." : "Submit Ad"}
        </button>
      </form>

      {/* Snackbar */}
      {snackbar.open && (
        <div
          className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-all duration-300 ${
            snackbar.severity === "success"
              ? "bg-green-500"
              : snackbar.severity === "error"
              ? "bg-red-500"
              : "bg-yellow-500"
          }`}
        >
          {snackbar.message}
        </div>
      )}
    </div>
  );
};

export default AddAds;
