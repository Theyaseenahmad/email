"use client";
import { useState } from 'react';
import axios from 'axios';

export default function EmailForm() {
  const [state, setState] = useState({
    userInput: '',
    generatedEmail: '',
    loading: false
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setState({ ...state, loading: true });
    
    try {
      const response = await axios.post('/api/generate-email', {
        prompt: state.userInput
      });
      
      setState({
        userInput: state.userInput,
        generatedEmail: response.data.email,
        loading: false
      });
      
    } catch (error) {
      setState({
        ...state,
        generatedEmail: 'Error generating email. Please try again.',
        loading: false
      });
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 text-black">
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          className="w-full p-3 border rounded-lg text-white bg-black"
          placeholder="What email do you need? (e.g., 'Request deadline extension for marketing project')"
          value={state.userInput}
          onChange={(e) => setState({...state, userInput: e.target.value})}
          required
        />
        
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          disabled={state.loading}
        >
          {state.loading ? 'Generating...' : 'Create Email'}
        </button>
      </form>

      {state.generatedEmail && (
        <div className="mt-8 p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Email Draft:</h3>
          <textarea
            className="w-full h-64 p-4 border rounded-md"
            value={state.generatedEmail}
            onChange={(e) => setState({...state, generatedEmail: e.target.value})}
          />
          <button
            onClick={() => navigator.clipboard.writeText(state.generatedEmail)}
            className="mt-4 bg-gray-100 px-4 py-2 rounded hover:bg-gray-200"
          >
            Copy to Clipboard
          </button>
        </div>
      )}
    </div>
  );
}