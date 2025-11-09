import { useState } from 'react';
import { LayoutDashboard, MessageSquare } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ChatWithData from './pages/ChatWithData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800">
            Invoice Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">Dashboard v1.0</p>
        </div>
        
        <nav className="flex-1 p-4">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
              activeTab === 'dashboard'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <LayoutDashboard size={20} />
            <span className="font-medium">Dashboard</span>
          </button>
          
          <button
            onClick={() => setActiveTab('chat')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
              activeTab === 'chat'
                ? 'bg-blue-50 text-blue-600'
                : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            <MessageSquare size={20} />
            <span className="font-medium">Chat with Data</span>
          </button>
        </nav>
        
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500">
            Built by Pruthavik Gavali
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {activeTab === 'dashboard' ? <Dashboard /> : <ChatWithData />}
      </main>
    </div>
  );
}

export default App;
