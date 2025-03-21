"use client";

import { useState } from "react";
import axios from "axios";
import ReactMarkdown from "react-markdown";

export default function PromptForm() {
  const [prompt, setPrompt] = useState("");
  const [markdown, setMarkdown] = useState("");
  const [loading, setLoading] = useState(false);
  const [recipientEmail, setRecipientEmail] = useState("");
  const [sending, setSending] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMarkdown("");

    try {
      const response = await axios.post("api/generate-email", {
        prompt: prompt,
      });
      setMarkdown(response.data.markdown);
    } catch (error) {
      console.error("Error generating email:", error);
    }
    setLoading(false);
  };

  const handleSendEmail = async () => {
    if (!recipientEmail) {
      alert("Please provide a recipient email.");
      return;
    }

    setSending(true);

    try {
      const response = await axios.post("/api/send-email", {
        to: recipientEmail,
        subject: "Generated Email",
        text: markdown, // Sending the markdown content as the email body
      });

      if (response.data.success) {
        alert("Email sent successfully!");
      } else {
        alert("Error sending email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Error sending email.");
    }

    setSending(false);
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white text-black shadow-md rounded-lg min-h-screen p-4">
      <h2 className="text-xl font-bold mb-4">Generate and Send an Email</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Enter your prompt..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          rows={4}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {markdown && (
        <div className="mt-6 p-4 border rounded bg-gray-100">
          <h3 className="font-bold mb-2">Generated Email:</h3>
          <ReactMarkdown>{markdown}</ReactMarkdown>
        </div>
      )}

      {/* Input for recipient email and button to send email */}
      {markdown && (
        <div className="mt-6">
          <input
            type="email"
            className="w-full p-2 border rounded mb-4"
            placeholder="Enter recipient's email"
            value={recipientEmail}
            onChange={(e) => setRecipientEmail(e.target.value)}
            required
          />
          <button
            onClick={handleSendEmail}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
            disabled={sending}
          >
            {sending ? "Sending..." : "Send Email"}
          </button>
        </div>
      )}
    </div>
  );
}
