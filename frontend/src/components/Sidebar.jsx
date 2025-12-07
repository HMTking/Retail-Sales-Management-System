import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  LayoutDashboard,
  FileText,
  CheckCircle,
  XCircle,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { logout, user } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/dashboard" },
    { icon: FileText, label: "Invoices", submenu: true },
  ];

  const invoiceSubmenu = [
    { icon: FileText, label: "Proforma Invoices", path: "#" },
    { icon: CheckCircle, label: "Final Invoices", path: "#" },
  ];

  const services = [
    { icon: FileText, label: "Pre-active", path: "#" },
    { icon: CheckCircle, label: "Active", path: "#" },
    { icon: XCircle, label: "Blocked", path: "#" },
    { icon: XCircle, label: "Closed", path: "#" },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-primary-600 text-white"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-40 w-64 bg-gray-900 text-white transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-gray-700">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
                <span className="text-xl font-bold">V</span>
              </div>
              <div>
                <h2 className="font-bold text-lg">Vault</h2>
                <p className="text-xs text-gray-400">{user?.name}</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 overflow-y-auto scrollbar-hide">
            <div className="space-y-2">
              {menuItems.map((item) => (
                <div key={item.label}>
                  <button
                    onClick={() => !item.submenu && navigate(item.path)}
                    className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                      location.pathname === item.path
                        ? "bg-primary-600 text-white"
                        : "text-gray-300 hover:bg-gray-800"
                    }`}
                  >
                    <item.icon size={20} />
                    <span>{item.label}</span>
                  </button>

                  {item.submenu && (
                    <div className="ml-8 mt-2 space-y-1">
                      {invoiceSubmenu.map((subItem) => (
                        <button
                          key={subItem.label}
                          onClick={() => navigate(subItem.path)}
                          className="w-full flex items-center space-x-2 px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                        >
                          <subItem.icon size={16} />
                          <span>{subItem.label}</span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              <div className="pt-4">
                <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                  Services
                </p>
                {services.map((service) => (
                  <button
                    key={service.label}
                    onClick={() => navigate(service.path)}
                    className="w-full flex items-center space-x-3 px-4 py-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                  >
                    <service.icon size={18} />
                    <span className="text-sm">{service.label}</span>
                  </button>
                ))}
              </div>
            </div>
          </nav>

          {/* Logout */}
          <div className="p-4 border-t border-gray-700">
            <button
              onClick={handleLogout}
              className="w-full flex items-center space-x-3 px-4 py-3 text-gray-300 hover:bg-red-600 hover:text-white rounded-lg transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-30"
        />
      )}
    </>
  );
};

export default Sidebar;
