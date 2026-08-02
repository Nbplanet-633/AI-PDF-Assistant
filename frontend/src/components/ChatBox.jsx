export default function ChatBox() {
  return (
    <div className="bg-white rounded-xl shadow p-6 h-[500px] flex flex-col">

      <h2 className="text-xl font-semibold mb-4">
        Chat
      </h2>

      <div className="flex-1 overflow-y-auto border rounded-lg p-4">

        <p className="text-gray-400">
          Upload a PDF to start chatting.
        </p>

      </div>

      <div className="mt-4 flex gap-3">

        <input
          className="flex-1 border rounded-lg px-4 py-3"
          placeholder="Ask a question..."
        />

        <button
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg"
        >
          Send
        </button>

      </div>

    </div>
  );
}