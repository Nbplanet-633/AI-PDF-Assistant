export default function ChatBox({
    selectedDocument, summary, summaryLoading
}) {
    return (
        <div className="bg-white rounded-xl shadow p-6 h-[500px] flex flex-col">

            <h2 className="text-xl font-semibold mb-4">
                Chat
            </h2>

            <div className="flex-1 overflow-y-auto border rounded-lg p-4">

                {!selectedDocument ? (

                    <p className="text-gray-400">
                        Select a document first.
                    </p>

                ) : summaryLoading ? (

                    <p className="text-gray-500">
                        Generating AI Summary...
                    </p>

                ) : summary ? (

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">

                        <h3 className="font-semibold mb-2">
                            AI Summary
                        </h3>

                        <p>{summary.overview}</p>

                        <div className="mt-4">

                            <h4 className="font-semibold">
                                Key Points
                            </h4>

                            <ul className="list-disc ml-5 mt-2">

                                {summary.key_points.map((point, index) => (

                                    <li key={index}>
                                        {point}
                                    </li>

                                ))}

                            </ul>

                        </div>

                    </div>

                ) : null}

            </div>

            <div className="mt-4 flex gap-3">

                <input
                    disabled={!selectedDocument}
                    className="flex-1 border rounded-lg px-4 py-3"
                    placeholder="Ask a question..."
                />

                <button
                    disabled={!selectedDocument}
                    className="bg-blue-600 text-white px-6 rounded-lg disabled:opacity-50"
                >
                    Send
                </button>

            </div>

        </div>
    );
}