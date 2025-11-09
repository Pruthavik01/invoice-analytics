import { useState } from 'react';
import { apiService } from '../utils/api';
import { Send, Loader2, Database } from 'lucide-react';

export default function ChatWithData() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const exampleQuestions = [
    "What's the total spend in the last 90 days?",
    "List top 5 vendors by spend",
    "Show overdue invoices",
    "How many pending invoices do we have?",
    "What's the average invoice amount?"
  ];

  async function handleSubmit(e) {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const question = input.trim();
    setInput('');
    
    // Add user message
    const userMessage = { role: 'user', content: question };
    setMessages(prev => [...prev, userMessage]);
    
    setLoading(true);

    try {
      const response = await apiService.chatWithData(question);
      
      // Add AI response
      const aiMessage = {
        role: 'assistant',
        content: question,
        pipeline: response.data.pipeline,
        results: response.data.results,
        query: response.data.generatedQuery
      };
      
      setMessages(prev => [...prev, aiMessage]);
    } catch (error) {
      console.error('Chat error:', error);
      const errorMessage = {
        role: 'error',
        content: 'Failed to process query. Please try again.'
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  }

  function handleExampleClick(question) {
    setInput(question);
  }

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <h1 className="text-2xl font-bold text-gray-800">Chat with Data</h1>
        <p className="text-sm text-gray-600 mt-1">
          Ask questions about your invoices in natural language
        </p>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-6">
        {messages.length === 0 ? (
          <div className="max-w-2xl mx-auto mt-12">
            <div className="text-center mb-8">
              <Database className="w-16 h-16 mx-auto text-blue-600 mb-4" />
              <h2 className="text-xl font-semibold text-gray-800 mb-2">
                Start a conversation
              </h2>
              <p className="text-gray-600">
                Ask anything about your invoice data
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-700 mb-3">
                Try these examples:
              </p>
              {exampleQuestions.map((q, i) => (
                <button
                  key={i}
                  onClick={() => handleExampleClick(q)}
                  className="w-full text-left px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors"
                >
                  <p className="text-sm text-gray-700">{q}</p>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <div className="max-w-4xl mx-auto space-y-6">
            {messages.map((msg, idx) => (
              <div key={idx}>
                {msg.role === 'user' ? (
                  <div className="flex justify-end">
                    <div className="bg-blue-600 text-white px-4 py-3 rounded-lg max-w-xl">
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ) : msg.role === 'error' ? (
                  <div className="flex justify-start">
                    <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg max-w-xl border border-red-200">
                      <p>{msg.content}</p>
                    </div>
                  </div>
                ) : (
                  <div className="flex justify-start">
                    <div className="bg-white border border-gray-200 rounded-lg p-4 max-w-3xl w-full">
                      <p className="font-medium text-gray-800 mb-3">
                        Query Result
                      </p>
                      
                      {/* Generated Query */}
                      <div className="bg-gray-50 p-3 rounded mb-3">
                        <p className="text-xs font-medium text-gray-600 mb-1">
                          Generated MongoDB Query:
                        </p>
                        <pre className="text-xs text-gray-700 overflow-x-auto">
                          {msg.query}
                        </pre>
                      </div>

                      {/* Results */}
                      <div>
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Results ({msg.results?.length || 0} records):
                        </p>
                        
                        {msg.results && msg.results.length > 0 ? (
                          <div className="overflow-x-auto">
                            <table className="min-w-full text-sm">
                              <thead className="bg-gray-50">
                                <tr>
                                  {Object.keys(msg.results[0]).map((key) => (
                                    <th
                                      key={key}
                                      className="px-3 py-2 text-left text-xs font-medium text-gray-600 uppercase"
                                    >
                                      {key}
                                    </th>
                                  ))}
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200">
                                {msg.results.map((row, i) => (
                                  <tr key={i}>
                                    {Object.values(row).map((val, j) => (
                                      <td
                                        key={j}
                                        className="px-3 py-2 text-gray-700"
                                      >
                                        {typeof val === 'object'
                                          ? JSON.stringify(val)
                                          : String(val)}
                                      </td>
                                    ))}
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        ) : (
                          <p className="text-gray-500 text-sm">No results found</p>
                        )}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
            
            {loading && (
              <div className="flex justify-start">
                <div className="bg-white border border-gray-200 rounded-lg p-4">
                  <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="bg-white border-t border-gray-200 p-4">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto">
          <div className="flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask a question about your invoice data..."
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}