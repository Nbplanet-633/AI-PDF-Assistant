import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function MessageBubble({ message }) {
    const isAI = message.role === "assistant";

    return (
        <div
            className={`flex ${
                isAI ? "justify-start" : "justify-end"
            }`}
        >
            <div
                className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    isAI
                        ? "bg-white border border-gray-200"
                        : "bg-blue-600 text-white"
                }`}
            >
                <p
                    className={`text-xs font-semibold mb-2 ${
                        isAI
                            ? "text-blue-600"
                            : "text-blue-100"
                    }`}
                >
                    {isAI ? "🤖 AI Assistant" : "👤 You"}
                </p>

                {message.type === "summary" ? (
                    <>
                        <p className="leading-7">
                            {message.content.overview}
                        </p>

                        <div className="mt-4">
                            <h4 className="font-semibold mb-2">
                                Key Points
                            </h4>

                            <ul className="list-disc ml-5 space-y-1">
                                {message.content.key_points.map(
                                    (point, index) => (
                                        <li key={index}>
                                            {point}
                                        </li>
                                    )
                                )}
                            </ul>
                        </div>
                    </>
                ) : (
                    <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                            h1: ({ children }) => (
                                <h1 className="text-2xl font-bold mt-4 mb-3">
                                    {children}
                                </h1>
                            ),

                            h2: ({ children }) => (
                                <h2 className="text-xl font-semibold mt-4 mb-2">
                                    {children}
                                </h2>
                            ),

                            h3: ({ children }) => (
                                <h3 className="text-lg font-semibold mt-3 mb-2">
                                    {children}
                                </h3>
                            ),

                            p: ({ children }) => (
                                <p className="mb-3 leading-7">
                                    {children}
                                </p>
                            ),

                            ul: ({ children }) => (
                                <ul className="list-disc ml-6 mb-3 space-y-1">
                                    {children}
                                </ul>
                            ),

                            ol: ({ children }) => (
                                <ol className="list-decimal ml-6 mb-3 space-y-1">
                                    {children}
                                </ol>
                            ),

                            li: ({ children }) => (
                                <li>{children}</li>
                            ),

                            strong: ({ children }) => (
                                <strong className="font-bold">
                                    {children}
                                </strong>
                            ),

                            code: ({ inline, children }) =>
                                inline ? (
                                    <code className="bg-gray-100 px-1 py-0.5 rounded text-sm">
                                        {children}
                                    </code>
                                ) : (
                                    <pre className="bg-gray-900 text-white rounded-lg p-4 overflow-x-auto my-3">
                                        <code>{children}</code>
                                    </pre>
                                ),
                        }}
                    >
                        {message.content}
                    </ReactMarkdown>
                )}

                {message.sources && (
                    <div className="mt-5 border-t pt-4">

                        <p className="font-semibold mb-3">
                            📄 Sources
                        </p>

                        <div className="space-y-2">

                            {message.sources.map((source, index) => (

                                <div
                                    key={index}
                                    className="rounded-lg border bg-gray-50 p-3"
                                >

                                    <p className="font-medium">
                                        Page {source.page}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                                        {source.preview}
                                    </p>

                                </div>

                            ))}

                        </div>

                    </div>
                )}

            </div>
        </div>
    );
}