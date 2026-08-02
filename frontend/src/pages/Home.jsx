import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";
import { getDocuments } from "../api/documentApi";

export default function Home() {
  const [documents, setDocuments] = useState([]);

  async function loadDocuments() {
    try {
      const response = await getDocuments();
      setDocuments(response.documents);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    loadDocuments();
  }, []);

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-3">
            <Sidebar documents={documents} />
          </div>

          <div className="col-span-9 space-y-6">
            <UploadBox onUploadSuccess={loadDocuments} />
            <ChatBox />
          </div>

        </div>
      </main>
    </>
  );
}