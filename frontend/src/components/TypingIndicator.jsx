export default function TypingIndicator() {
    return (
        <div className="flex justify-start">
            <div className="bg-white border border-gray-200 rounded-2xl px-4 py-3 shadow-sm max-w-fit">

                <p className="text-xs font-semibold text-blue-600 mb-2">
                    🤖 AI Assistant
                </p>

                <div className="flex gap-2">

                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"></span>

                    <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.2s" }}
                    ></span>

                    <span
                        className="w-2 h-2 rounded-full bg-gray-400 animate-bounce"
                        style={{ animationDelay: "0.4s" }}
                    ></span>

                </div>

            </div>
        </div>
    );
}