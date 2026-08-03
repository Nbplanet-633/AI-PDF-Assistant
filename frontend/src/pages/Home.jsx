import { useEffect, useState } from "react";
import Header from "../components/Header";
import Sidebar from "../components/Sidebar";
import UploadBox from "../components/UploadBox";
import ChatBox from "../components/ChatBox";
import { getDocuments, getSummary, deleteDocument } from "../api/documentApi";

export default function Home() {
  const [documents, setDocuments] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [messages, setMessages] = useState([]);
  const [chatLoading, setChatLoading] = useState(false);

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
          setChatLoading(true);

          const response = await getSummary(document.document_id);

          setMessages([
              {
                  role: "assistant",
                  type: "summary",
                  content: response.summary,
              },
          ]);

      } catch (error) {
          console.error(error);
      } finally {
          setChatLoading(false);
      }
  }

  async function handleDelete(document) {

      const confirmed = window.confirm(
          `Are you sure you want to delete "${document.original_filename}"?`
      );

      if (!confirmed) return;

      try {

          await deleteDocument(document.document_id);

          // Reload sidebar
          await loadDocuments();

          // If deleted document was selected
          if (
              selectedDocument &&
              selectedDocument.document_id === document.document_id
          ) {
              setSelectedDocument(null);
              setMessages([]);
          }

      } catch (error) {

          console.error(error);

          alert("Failed to delete document.");

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
                onDelete={handleDelete}
            />
          </div>

          <div className="col-span-9 space-y-6">
            <UploadBox onUploadSuccess={loadDocuments} />
            <ChatBox
                selectedDocument={selectedDocument}
                messages={messages}
                setMessages={setMessages}
                chatLoading={chatLoading}
            />
          </div>

        </div>
      </main>
    </>
  );
}