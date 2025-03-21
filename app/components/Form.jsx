"use client";
import { useState } from "react";
import axios from "axios";

export default function EmailGenerator() {
  const [prompt, setPrompt] = useState("");
  const [recipient, setRecipient] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false); // Track if an email was generated

  const generateEmail = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setEmail("");
    setGenerated(false);

    try {
      const res = await axios.post("/api/generate-email", { prompt });
      setEmail(res.data.email || "Error generating email.");
      setGenerated(true);
    } catch (error) {
      setEmail("Failed to generate email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const sendEmail = async () => {
    if (!recipient.trim() || !email.trim()) return;
    setLoading(true);

    try {
      await axios.post("/api/send-email", {
        to: recipient,
        subject: "AI-Generated Email",
        text: email, // Send the modified email content
      });

      alert("Email sent successfully!");
    } catch (error) {
      alert("Failed to send email.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Email Generator</h1>

        {/* Recipient Email Input */}
        <input
          type="email"
          className="w-full border rounded-lg p-2 mb-4 text-gray-700"
          placeholder="Enter recipient email..."
          value={recipient}
          onChange={(e) => setRecipient(e.target.value)}
        />

        {/* Prompt for AI Email Generation */}
        <textarea
          className="w-full border rounded-lg p-2 mb-4 text-gray-700"
          rows={4}
          placeholder="Enter email context..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        {/* Generate Email Button */}
        <button
          onClick={generateEmail}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Email"}
        </button>

        {/* Editable Generated Email */}
        {generated && (
          <textarea
            className="w-full border rounded-lg p-2 mt-4 text-gray-700 bg-gray-100"
            rows={6}
            value={email}
            onChange={(e) => setEmail(e.target.value)} // Allow user to edit
          />
        )}

        {/* Send Email Button */}
        {generated && (
          <button
            onClick={sendEmail}
            className="w-full bg-green-600 text-white font-semibold py-2 mt-4 rounded-lg hover:bg-green-700 disabled:bg-gray-400"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Email"}
          </button>
        )}
      </div>
    </div>
  );
}
