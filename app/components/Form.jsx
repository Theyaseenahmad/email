"use client";
import { useState } from "react";
import axios from "axios";

export default function EmailGenerator() {
  const [prompt, setPrompt] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const generateEmail = async () => {
    if (!prompt.trim()) return;
    setLoading(true);
    setEmail("");

    try {
      const res = await axios.post("/api/generate-email", { prompt });
      setEmail(res.data.email || "Error generating email.");
    } catch (error) {
      setEmail("Failed to generate email. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl w-full bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">AI Email Generator</h1>
        
        <textarea
          className="w-full border rounded-lg p-2 mb-4 text-gray-700"
          rows={4}
          placeholder="Enter email context..."
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />

        <button
          onClick={generateEmail}
          className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Email"}
        </button>

        {email && (
          <div className="mt-4 p-4 bg-gray-200 rounded-lg text-gray-800 whitespace-pre-wrap">
            {email}
          </div>
        )}
      </div>
    </div>
  );
}
