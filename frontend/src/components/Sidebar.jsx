import { FaFilePdf } from "react-icons/fa";

export default function Sidebar({
    documents,
    selectedDocument,
    onSelect,
}) {

    console.log("onSelect =", onSelect);
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

                    {documents.map((doc) => {

                        const isSelected =
                            selectedDocument?.document_id === doc.document_id;

                        return (

                            <button
                                key={doc.document_id}
                                onClick={() => onSelect(doc)}
                                className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition
                                    
                                    ${
                                        isSelected
                                            ? "bg-blue-100 border border-blue-500"
                                            : "hover:bg-gray-100"
                                    }
                                `}
                            >

                                <FaFilePdf className="text-red-500" />

                                <span className="truncate">
                                    {doc.original_filename}
                                </span>

                            </button>

                        );
                    })}

                </div>
            )}

        </aside>
    );
}