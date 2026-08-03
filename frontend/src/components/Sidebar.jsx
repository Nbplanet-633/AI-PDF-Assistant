import { FaTrash, FaFilePdf } from "react-icons/fa";

export default function Sidebar({
    documents,
    selectedDocument,
    onSelect,
    onDelete,
}) {
    return (
        <aside className="bg-white rounded-2xl shadow-lg p-5 h-full">

            <h2 className="text-xl font-bold text-gray-800 mb-5">
                📚 Documents
            </h2>

            {documents.length === 0 ? (

                <div className="text-center text-gray-400 mt-12">
                    <FaFilePdf className="mx-auto text-4xl mb-3 opacity-40" />

                    <p>No PDFs uploaded yet</p>
                </div>

            ) : (

                <div className="space-y-3">

                    {documents.map((doc) => {

                        const isSelected =
                            selectedDocument?.document_id === doc.document_id;

                        return (

                            <div
                                key={doc.document_id}
                                onClick={() => onSelect(doc)}
                                className={`group w-full cursor-pointer rounded-xl p-4 transition-all duration-200 border

                                ${
                                    isSelected
                                        ? "bg-blue-50 border-blue-500 shadow-md"
                                        : "bg-gray-50 hover:bg-gray-100 border-transparent"
                                }
                                `}
                            >

                                <div className="flex justify-between items-start">

                                    <div className="flex gap-3 items-start flex-1">

                                        <FaFilePdf className="text-red-500 text-xl mt-1 flex-shrink-0" />

                                        <div className="min-w-0">

                                            <p className="font-medium truncate">
                                                {doc.original_filename}
                                            </p>

                                            <p className="text-xs text-gray-500 mt-1">
                                                PDF Document
                                            </p>

                                        </div>

                                    </div>

                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onDelete(doc);
                                        }}
                                        className="opacity-0 group-hover:opacity-100 transition p-2 rounded-lg hover:bg-red-100 text-gray-400 hover:text-red-600"
                                        title="Delete document"
                                    >
                                        <FaTrash />
                                    </button>

                                </div>

                            </div>

                        );

                    })}

                </div>

            )}

        </aside>
    );
}