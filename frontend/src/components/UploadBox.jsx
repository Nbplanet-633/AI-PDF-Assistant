import { useState } from "react";
import { FaUpload } from "react-icons/fa";
import { uploadDocument } from "../api/documentApi";

export default function UploadBox({ onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

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
    <div className="bg-white rounded-xl shadow p-6">

      <h2 className="text-xl font-semibold mb-4">
        Upload PDF
      </h2>

      <div className="border-2 border-dashed border-gray-300 rounded-xl p-10 text-center">

        <FaUpload className="mx-auto text-4xl text-gray-400 mb-4" />

        <input
          type="file"
          accept=".pdf"
          onChange={(e) => setSelectedFile(e.target.files[0])}
        />

        {selectedFile && (
          <p className="mt-4 text-gray-600">
            {selectedFile.name}
          </p>
        )}

        <button
          onClick={handleUpload}
          disabled={loading}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg"
        >
          {loading ? "Uploading..." : "Upload"}
        </button>

      </div>

    </div>
  );
}