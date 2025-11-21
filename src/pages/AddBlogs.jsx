import { useState } from "react";
import * as mammoth from "mammoth";
import API from "../service/api";

const AddBlogs = () => {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [content, setContent] = useState("");

  const [fileName, setFileName] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState("");
  const [timeChips, setTimeChips] = useState("");
  const [slugs, setSlugs] = useState("");

  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // Handle .docx upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = async (e) => {
      const arrayBuffer = e.target.result;
      try {
        const result = await mammoth.extractRawText({ arrayBuffer });
        setContent(result.value);
      } catch (err) {
        console.error("Error reading Word file:", err);
        alert("Failed to read the Word file. Please try again.");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Submit form with image + data
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("title", title);
      formData.append("creator", creator);
      formData.append("content", content);
      formData.append("timeChips", timeChips);
      formData.append("slugs", slugs);

      if (image) formData.append("image", image);
      console.log("formdata", formData);

      const res = await API.post("/blogs", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      console.log(res);

      setSnackbar({
        open: true,
        message: res.data.message || "Blog created successfully!",
        severity: "success",
      });

      setTitle("");
      setCreator("");
      setContent("");
      setImage("");
      setImagePreview("");
      setFileName("");
      setTimeChips("");
      setSlugs("");
    } catch (error) {
      setSnackbar({
        open: true,
        message: error.response?.data?.message || "Failed to create blog",
        severity: "error",
      });
    } finally {
      setLoading(false);
      setTimeout(() => setSnackbar({ ...snackbar, open: false }), 3000);
    }
  };

  return (
    <>
      {/* Page Header */}
      <div className="w-full mb-6 mt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-start text-orange-600 mb-2 font-poppins">
          Create a Blog Post
        </h2>
        <div className="w-full border-b-2 border-[#FAA533]"></div>
      </div>

      <div className="min-h-screen flex flex-col items-center p-4">
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Blog Title
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Creator */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Creator
              </label>
              <input
                type="text"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:ring-2 focus:ring-orange-400"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Blog Image
              </label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="w-full border border-dashed border-gray-400 p-3 rounded-xl"
              />

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 w-full h-56 object-cover rounded-xl shadow-md"
                />
              )}
            </div>

            {/* slugs */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Slug
              </label>
              <input
                type="text"
                placeholder="Do not add any space between words"
                value={slugs}
                onChange={(e) => setSlugs(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* Time Chips */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Reading Time (e.g., 5 min read)
              </label>
              <input
                type="text"
                placeholder="Enter reading time"
                value={timeChips}
                onChange={(e) => setTimeChips(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
              />
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Upload Word File
              </label>
              <input
                type="file"
                accept=".docx"
                onChange={handleFileUpload}
                className="w-full border border-dashed border-gray-400 p-3 rounded-xl"
              />
              {fileName && (
                <p className="text-sm text-green-600 mt-1">File: {fileName}</p>
              )}
            </div>

            {/* Content */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Blog Content
              </label>
              <textarea
                rows="10"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 resize-none focus:ring-2 focus:ring-orange-400"
              ></textarea>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full bg-orange-500 text-white py-3 rounded-xl font-semibold hover:bg-orange-600"
              disabled={loading}
            >
              {loading ? "Publishing..." : "Publish Blog"}
            </button>
          </form>

          {/* Snackbar */}
          {snackbar.open && (
            <div
              className={`fixed bottom-6 right-6 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium ${
                snackbar.severity === "success" ? "bg-green-500" : "bg-red-500"
              }`}
            >
              {snackbar.message}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AddBlogs;
