import React from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { BedDouble, CalendarCheck, CreditCard, TrendingUp } from 'lucide-react';

const StatCard = ({ title, value, icon: Icon, color }) => (
    <div className="bg-white rounded-lg shadow-md p-6 flex items-center">
        <div className={`p-4 rounded-full mr-4 ${color}`}>
            <Icon size={24} className="text-white" />
        </div>
        <div>
            <p className="text-gray-500 text-sm font-medium">{title}</p>
            <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        </div>
    </div>
);

const Dashboard = () => {
    // Mock data
    const stats = [
        { title: 'Total Bookings', value: '1,234', icon: CalendarCheck, color: 'bg-blue-500' },
        { title: 'Total Rooms', value: '24', icon: BedDouble, color: 'bg-green-500' },
        { title: 'Revenue (Month)', value: '₹4.5L', icon: TrendingUp, color: 'bg-purple-500' },
        { title: 'Pending Payments', value: '₹12k', icon: CreditCard, color: 'bg-orange-500' },
    ];

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {stats.map((stat, index) => (
                    <StatCard key={index} {...stat} />
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Recent Bookings</h3>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead>
                                <tr>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Guest</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Room</th>
                                    <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {[1, 2, 3, 4, 5].map((i) => (
                                    <tr key={i}>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-700">John Doe</td>
                                        <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">Deluxe Suite</td>
                                        <td className="px-4 py-3 whitespace-nowrap">
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">Confirmed</span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">Room Occupancy</h3>
                    <div className="h-64 flex items-center justify-center text-gray-400 border-2 border-dashed rounded-lg">
                        Chart Placeholder
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
};

export default Dashboard;
