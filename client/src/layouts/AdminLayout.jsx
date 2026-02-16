import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    LayoutDashboard,
    BedDouble,
    CalendarCheck,
    CreditCard,
    MessageSquare,
    Image,
    Settings,
    LogOut,
    Menu,
    X,
} from 'lucide-react';

const AdminLayout = ({ children }) => {
    const { logout } = useAuth();
    const location = useLocation();
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);

    const navItems = [
        { name: 'Dashboard', path: '/admin/dashboard', icon: LayoutDashboard },
        { name: 'Rooms', path: '/admin/rooms', icon: BedDouble },
        { name: 'Bookings', path: '/admin/bookings', icon: CalendarCheck },
        { name: 'Payments', path: '/admin/payments', icon: CreditCard },
        { name: 'Inquiries', path: '/admin/inquiries', icon: MessageSquare },
        { name: 'Gallery', path: '/admin/gallery', icon: Image },
        { name: 'Settings', path: '/admin/settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div className={`${isSidebarOpen ? 'w-64' : 'w-20'} bg-primary text-white transition-all duration-300 flex flex-col`}>
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className={`${!isSidebarOpen && 'hidden'} text-xl font-bold`}>Admin Panel</h2>
                    <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-1 hover:bg-gray-700 rounded">
                        {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
                    </button>
                </div>

                <nav className="flex-1 overflow-y-auto py-4">
                    <ul className="space-y-2 px-2">
                        {navItems.map((item) => (
                            <li key={item.name}>
                                <Link
                                    to={item.path}
                                    className={`flex items-center p-3 rounded-lg transition-colors ${location.pathname === item.path ? 'bg-secondary text-white' : 'hover:bg-gray-700 text-gray-300'}`}
                                >
                                    <item.icon size={20} className="min-w-[20px]" />
                                    <span className={`ml-3 whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>{item.name}</span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </nav>

                <div className="p-4 border-t border-gray-700">
                    <button
                        onClick={logout}
                        className="flex items-center w-full p-3 text-red-400 hover:bg-gray-700 rounded-lg transition-colors"
                    >
                        <LogOut size={20} className="min-w-[20px]" />
                        <span className={`ml-3 whitespace-nowrap ${!isSidebarOpen && 'hidden'}`}>Logout</span>
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-auto">
                <header className="bg-white shadow-sm p-4 sticky top-0 z-10">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold text-gray-800">
                            {navItems.find(i => i.path === location.pathname)?.name || 'Dashboard'}
                        </h2>
                        <div className="flex items-center space-x-4">
                            <div className="text-sm text-gray-600">Admin User</div>
                            <div className="h-8 w-8 rounded-full bg-secondary flex items-center justify-center text-white font-bold">A</div>
                        </div>
                    </div>
                </header>
                <main className="p-6">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
