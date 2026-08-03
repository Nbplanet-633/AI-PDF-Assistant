import { useState, useRef } from "react";
import { FaUpload } from "react-icons/fa";
import { uploadDocument } from "../api/documentApi";
import { FaCloudUploadAlt } from "react-icons/fa";

export default function UploadBox({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);

  const fileInputRef = useRef(null);

  function handleDragOver(e) {
      e.preventDefault();
      setDragActive(true);
  }

  function handleDragLeave(e) {
      e.preventDefault();
      setDragActive(false);
  }

  function handleDrop(e) {
      e.preventDefault();

      setDragActive(false);

      const file = e.dataTransfer.files[0];

      if (!file) return;

      if (file.type !== "application/pdf") {
          alert("Please upload a PDF file.");
          return;
      }

      setSelectedFile(file);
  }

  async function handleUpload() {
    if (!selectedFile) return;

    try {
      setLoading(true);

      const response = await uploadDocument(selectedFile);

      console.log(response);

      onUploadSuccess(); // Call the callback to refresh the document list
    } catch (error) {
      console.error(error);

      alert("Upload Failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
        {/* Hidden File Input */}
        <input
            ref={fileInputRef}
            type="file"
            accept=".pdf"
            className="hidden"
            onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {/* Upload Box */}
        <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`border-2 border-dashed rounded-2xl p-10 text-center transition-all duration-300 cursor-pointer

            ${
                dragActive
                    ? "border-blue-500 bg-blue-50 scale-[1.02]"
                    : "border-gray-300 bg-gray-50 hover:border-blue-500"
            }
            `}
        >

            <FaCloudUploadAlt className="mx-auto text-6xl text-blue-600 mb-4" />

            <h2 className="text-2xl font-semibold text-gray-800">
                {dragActive ? "Drop your PDF here" : "Upload your PDF"}
            </h2>

            <p className="text-gray-500 mt-2">
                {dragActive
                    ? "Release the mouse to upload the file."
                    : "Drag & drop your PDF here or browse your files."}
            </p>

            {/* Browse Button */}
            <button
                type="button"
                disabled = {dragActive}
                onClick={() => fileInputRef.current.click()}
                className="mt-6 bg-gray-900 hover:bg-black text-white px-6 py-3 rounded-xl transition font-medium"
            >
                Browse Files
            </button>

            {/* Selected File */}
            {selectedFile && (
                <div className="mt-6 inline-flex items-center gap-2 bg-green-50 border border-green-300 text-green-700 px-4 py-3 rounded-xl">
                    <span className="text-xl">✅</span>

                    <span className="font-medium">
                        {selectedFile.name}
                    </span>
                </div>
            )}

        </div>

        {/* Upload Button */}
        <button
            onClick={handleUpload}
            disabled={!selectedFile || loading}
            className="mt-6 w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition"
        >
            {loading ? "Uploading..." : "Upload PDF"}
        </button>
    </>
  );
}