import { FaFilePdf } from "react-icons/fa";

export default function Sidebar({ documents }) {
  return (
    <aside className="bg-white rounded-xl shadow p-5 h-full">

      <h2 className="text-lg font-semibold mb-4">
        Uploaded Documents
      </h2>

      {documents.length === 0 ? (
        <p className="text-gray-500">
          No documents uploaded.
        </p>
      ) : (
        <div className="space-y-2">
          {documents.map((doc) => (
            <div
              key={doc.document_id}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
            >
              <FaFilePdf className="text-red-500" />

              <span className="truncate">
                {doc.original_filename}
              </span>
            </div>
          ))}
        </div>
      )}

    </aside>
  );
}