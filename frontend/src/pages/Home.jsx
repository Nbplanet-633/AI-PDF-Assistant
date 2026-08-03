import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";
import { getDocuments, getSummary } from "../api/documentApi";

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [summary, setSummary] = useState(null);
  const [summaryLoading, setSummaryLoading] = useState(false);

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

  async function loadSummary(document) {
      try {
          setSummaryLoading(true);

          const response = await getSummary(document.document_id);

          setSummary(response.summary);

      } catch (error) {
          console.error(error);
      } finally {
          setSummaryLoading(false);
      }
  }

  return (
    <>
      <Header />

      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-12 gap-6">

          <div className="col-span-3">
            <Sidebar
                documents={documents}
                selectedDocument={selectedDocument}
                onSelect={(doc) => {
                    setSelectedDocument(doc);
                    loadSummary(doc);
                }}
            />
          </div>

          <div className="col-span-9 space-y-6">
            <UploadBox onUploadSuccess={loadDocuments} />
            <ChatBox
                selectedDocument={selectedDocument}
                summary={summary}
                summaryLoading={summaryLoading}
            />
          </div>

        </div>
      </main>
    </>
  );
}