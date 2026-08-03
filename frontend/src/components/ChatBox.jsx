import { askQuestion} from "../api/documentApi";
import { useState, useEffect, useRef } from "react";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";

export default function ChatBox({
    selectedDocument,
    messages,
    setMessages,
    chatLoading,
}) {

    const [question, setQuestion] = useState("");
    const [loading, setLoading] = useState(false);

    const messagesEndRef = useRef(null);

    useEffect(() => {
        if (messages.length > 0) {
            messagesEndRef.current?.scrollIntoView({
                behavior: "smooth",
            });
        }
    }, [messages]);

    async function handleSend() {

        if (!question.trim()) return;

        const userQuestion = question;

        // Add user message immediately
        setMessages((prev) => [
            ...prev,
            {
                role: "user",
                content: userQuestion,
            },
        ]);

        setQuestion("");

        try {

            setLoading(true);

            const response = await askQuestion(
                selectedDocument.document_id,
                userQuestion
            );

            // Add AI response
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    type: "answer",
                    content: response.answer,
                    sources: response.sources,
                },
            ]);

        } catch (error) {

            console.error(error);

        } finally {

            setLoading(false);

        }
    }

    return (
        <div className="bg-white rounded-xl shadow p-6 h-[500px] flex flex-col">

            <h2 className="text-xl font-semibold mb-4">
                Chat
            </h2>

            <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4">

                {!selectedDocument ? (

                    <p className="text-gray-400">
                        Select a document first.
                    </p>

                ) : chatLoading ? (

                    <p className="text-gray-500">
                        Generating AI Summary...
                    </p>

                ) : (

                    <div className="flex-1 overflow-y-auto border rounded-lg p-4 space-y-4">

                        {messages.map((message, index) => (
                            <MessageBubble
                                key={index}
                                message={message}
                            />
                        ))}

                        {loading && <TypingIndicator />}

                        <div ref={messagesEndRef} />

                    </div>

                )}

            </div>

            <div className="mt-4 flex gap-3">

                <input
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    disabled={!selectedDocument || loading}
                    className="flex-1 border rounded-lg px-4 py-3"
                    placeholder="Ask a question..."
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            handleSend();
                        }
                    }}
                />

                <button
                    onClick={handleSend}
                    disabled={!selectedDocument || loading}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 rounded-lg disabled:opacity-50"
                >
                    Send
                </button>

            </div>

        </div>
    );
}