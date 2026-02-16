import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import { CheckCircle, XCircle, Clock } from 'lucide-react';

const ManageBookings = () => {
    // Mock data
    const [bookings, setBookings] = useState([
        { id: 101, guest: 'John Doe', room: 'Deluxe Suite', checkIn: '2023-10-25', checkOut: '2023-10-28', status: 'Confirmed', amount: 7500 },
        { id: 102, guest: 'Jane Smith', room: 'Standard AC', checkIn: '2023-11-01', checkOut: '2023-11-03', status: 'Pending', amount: 3600 },
        { id: 103, guest: 'Bob Johnson', room: 'Standard Non-AC', checkIn: '2023-10-20', checkOut: '2023-10-21', status: 'Checked-out', amount: 1200 },
    ]);

    const getStatusBadge = (status) => {
        switch (status) {
            case 'Confirmed': return <span className="flex items-center text-green-600"><CheckCircle size={16} className="mr-1" /> Confirmed</span>;
            case 'Pending': return <span className="flex items-center text-yellow-600"><Clock size={16} className="mr-1" /> Pending</span>;
            case 'Cancelled': return <span className="flex items-center text-red-600"><XCircle size={16} className="mr-1" /> Cancelled</span>;
            default: return <span className="text-gray-600">{status}</span>;
        }
    };

    return (
        <AdminLayout>
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Manage Bookings</h1>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            {['Booking ID', 'Guest', 'Room', 'Check-in', 'Check-out', 'Amount', 'Status', 'Actions'].map(head => (
                                <th key={head} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{head}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {bookings.map((booking) => (
                            <tr key={booking.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">#{booking.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{booking.guest}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.room}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkIn}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{booking.checkOut}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-bold">₹{booking.amount}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm">{getStatusBadge(booking.status)}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600 hover:text-blue-900 cursor-pointer">View</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
};

export default ManageBookings;
