import { FaFilePdf } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-white border-b shadow-sm">
      <div className="max-w-7xl mx-auto h-16 px-6 flex items-center gap-3">
        <FaFilePdf className="text-red-600 text-2xl" />
        <h1 className="text-2xl font-bold text-gray-800">
          AI PDF Assistant
        </h1>
      </div>
    </header>
  );
}