// import { useState } from 'react';
// import { LayoutDashboard, MessageSquare } from 'lucide-react';
// import Dashboard from './pages/Dashboard';
// import ChatWithData from './pages/ChatWithData';

// function App() {
//   const [activeTab, setActiveTab] = useState('dashboard');

//   return (
//     <div className="flex min-h-screen bg-gray-50">
//       {/* Sidebar */}
//       <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
//         <div className="p-6 border-b border-gray-200">
//           <h1 className="text-2xl font-bold text-gray-800">
//             Invoice Analytics
//           </h1>
//           <p className="text-sm text-gray-500 mt-1">Dashboard v1.0</p>
//         </div>
        
//         <nav className="flex-1 p-4">
//           <button
//             onClick={() => setActiveTab('dashboard')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-2 ${
//               activeTab === 'dashboard'
//                 ? 'bg-blue-50 text-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <LayoutDashboard size={20} />
//             <span className="font-medium">Dashboard</span>
//           </button>
          
//           <button
//             onClick={() => setActiveTab('chat')}
//             className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
//               activeTab === 'chat'
//                 ? 'bg-blue-50 text-blue-600'
//                 : 'text-gray-600 hover:bg-gray-50'
//             }`}
//           >
//             <MessageSquare size={20} />
//             <span className="font-medium">Chat with Data</span>
//           </button>
//         </nav>
        
//         <div className="p-4 border-t border-gray-200">
//           <p className="text-xs text-gray-500">
//             Built by Pruthavik Gavali
//           </p>
//         </div>
//       </aside>

//       {/* Main Content */}
//       <main className="flex-1 overflow-auto">
//         {activeTab === 'dashboard' ? <Dashboard /> : <ChatWithData />}
//       </main>
//     </div>
//   );
// }

// export default App;



import { useState } from 'react';
import { 
  LayoutDashboard, 
  FileText, 
  Upload, 
  Users, 
  Settings,
  MessageSquare,
  Menu,
  X
} from 'lucide-react';
import Dashboard from './pages/Dashboard';
import ChatWithData from './pages/ChatWithData';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const navigation = [
    { 
      id: 'dashboard', 
      label: 'Dashboard', 
      icon: LayoutDashboard,
      component: Dashboard 
    },
    { 
      id: 'invoice', 
      label: 'Invoice', 
      icon: FileText,
      disabled: true
    },
    { 
      id: 'other-files', 
      label: 'Other files', 
      icon: Upload,
      disabled: true
    },
    { 
      id: 'departments', 
      label: 'Departments', 
      icon: Users,
      disabled: true
    },
    { 
      id: 'users', 
      label: 'Users', 
      icon: Users,
      disabled: true
    },
    { 
      id: 'settings', 
      label: 'Settings', 
      icon: Settings,
      disabled: true
    },
    { 
      id: 'chat', 
      label: 'Chat with Data', 
      icon: MessageSquare,
      component: ChatWithData 
    },
  ];

  const ActiveComponent = navigation.find(n => n.id === activeTab)?.component;

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Mobile Sidebar Toggle */}
      <button
        onClick={() => setSidebarOpen(!sidebarOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white rounded-lg shadow-lg"
      >
        {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full' }
          lg:translate-x-0 
          fixed lg:static
          overflow-hidden
          w-64 h-screen bg-white border-r border-gray-200 
          flex flex-col transition-transform duration-300 ease-in-out
          z-40
        `}
      >
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">📊</span>
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-900">
                Buchhaltung
              </h1>
              <p className="text-xs text-gray-500">12 members</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 overflow-y-auto">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3 px-3">
            GENERAL
          </p>
          {navigation.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                if (!item.disabled) {
                  setActiveTab(item.id);
                  if (window.innerWidth < 1024) {
                    setSidebarOpen(false);
                  }
                }
              }}
              disabled={item.disabled}
              className={`
                w-full flex items-center gap-3 px-4 py-3 rounded-lg 
                transition-all mb-1 text-left
                ${activeTab === item.id
                  ? 'bg-blue-50 text-blue-600 font-medium'
                  : item.disabled
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-50'
                }
              `}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full flex items-center justify-center">
              <span className="text-white text-sm font-semibold">FA</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                Flowbit AI
              </p>
              <p className="text-xs text-gray-500">AI Assistant by Pruthavik</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        {ActiveComponent ? (
          <ActiveComponent />
        ) : (
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h2 className="text-2xl font-semibold text-gray-900 mb-2">
                Coming Soon
              </h2>
              <p className="text-gray-600">This feature is under development</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;