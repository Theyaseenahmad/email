"use client";
import { useState } from "react";
import axios from "axios";

export default function PromptForm() {
  const [state, setState] = useState({
    prompt: "",
    emailContent: "",
    loading: false,
    recipientEmail: "",
    sending: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState(prev => ({...prev, loading: true, emailContent: ""}));

    try {
      const response = await axios.post("/api/generate-email", {
        prompt: `Generate plain text business email about: ${state.prompt}`
      });
      
      setState(prev => ({
        ...prev,
        emailContent: response.data.emailContent
      }));
    } catch (error) {
      console.error("Error generating email:", error);
    }
    setState(prev => ({...prev, loading: false}));
  };

  const handleSendEmail = async () => {
    if (!state.recipientEmail.includes('@')) {
      alert("Please enter a valid email address");
      return;
    }

    setState(prev => ({...prev, sending: true}));
    try {
      await axios.post("/api/send-email", {
        to: state.recipientEmail,
        subject: "Project Deadline Update",
        text: state.emailContent
      });
      alert("Email sent successfully!");
    } catch (error) {
      console.error("Error sending email:", error);
      alert("Failed to send email");
    }
    setState(prev => ({...prev, sending: false}));
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-black bg-white shadow-md rounded-lg">
      <h2 className="text-xl font-bold mb-4">Email Generator</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          className="w-full p-2 border rounded"
          placeholder="Describe the email purpose..."
          value={state.prompt}
          onChange={(e) => setState(prev => ({...prev, prompt: e.target.value}))}
          rows={3}
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={state.loading}
        >
          {state.loading ? "Generating..." : "Generate Email"}
        </button>
      </form>

      {state.emailContent && (
        <div className="mt-6 space-y-4">
          <div className="p-4 border rounded bg-gray-50">
            <h3 className="font-bold mb-2">Email Draft:</h3>
            <textarea
              className="w-full p-2 border rounded min-h-[200px]"
              value={state.emailContent}
              onChange={(e) => setState(prev => ({...prev, emailContent: e.target.value}))}
            />
          </div>
          
          <div className="space-y-2">
            <input
              type="email"
              className="w-full p-2 border rounded"
              placeholder="recipient@company.com"
              value={state.recipientEmail}
              onChange={(e) => setState(prev => ({...prev, recipientEmail: e.target.value}))}
              required
            />
            <button
              onClick={handleSendEmail}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 w-full disabled:opacity-50"
              disabled={state.sending}
            >
              {state.sending ? "Sending..." : "Send Email"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}