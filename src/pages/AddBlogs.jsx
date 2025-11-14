import { useState } from "react";
import * as mammoth from "mammoth";
import API from "../service/api";

const AddBlogs = () => {
  const [title, setTitle] = useState("");
  const [creator, setCreator] = useState("");
  const [content, setContent] = useState("");
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
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

  // Submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      const res = await API.post("/blogs", {
        title,
        creator,
        content,
      });
      setSnackbar({
        open: true,
        message: res.data.message || "Ad created successfully!",
        severity: "success",
      });
      setTitle("");
      setContent("");
      setCreator("");
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
      {/* Page Header (Outside Form) */}
      <div className="w-full mb-6 mt-4">
        <h2 className="text-2xl md:text-3xl font-bold text-start text-orange-600 mb-2 font-poppins">
          Create a Blog Post
        </h2>
        <div className="w-full border-b-2 border-[#FAA533]"></div>
      </div>
      <div className="min-h-screen flex flex-col items-center p-4">
        {/* Blog Form Container */}
        <div className="bg-white shadow-lg rounded-2xl w-full max-w-3xl p-6 md:p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Title */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Blog Title
              </label>
              <input
                type="text"
                placeholder="Enter blog title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
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
                placeholder="Enter creator name"
                value={creator}
                onChange={(e) => setCreator(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400"
                required
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
                className="w-full border border-dashed border-gray-400 p-3 rounded-xl text-sm text-gray-500 cursor-pointer hover:bg-gray-50"
              />
              {fileName && (
                <p className="text-sm text-green-600 mt-1">File: {fileName}</p>
              )}
            </div>

            {/* Textarea */}
            <div>
              <label className="block text-gray-700 font-semibold mb-2">
                Blog Content
              </label>
              <textarea
                rows="10"
                placeholder="Write or edit your blog content here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full border border-gray-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-orange-400 resize-none"
              ></textarea>
            </div>

            {/* Submit Button */}
            <div className="text-center">
              <button
                type="submit"
                className="w-full md:w-auto bg-orange-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-orange-600 transition-all duration-200"
              >
                Publish Blog
              </button>
            </div>
          </form>
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
      </div>
    </>
  );
};

export default AddBlogs;
