import React, { useState } from 'react';
import AdminLayout from '../../layouts/AdminLayout';
import Button from '../../components/Button';
import { Plus, Edit, Trash2, X } from 'lucide-react';

const ManageRooms = () => {
    // Mock data
    const [rooms, setRooms] = useState([
        { id: 1, name: 'Deluxe Suite', type: 'Deluxe', price: 2500, availability: true },
        { id: 2, name: 'Standard AC', type: 'AC', price: 1800, availability: true },
        { id: 3, name: 'Standard Non-AC', type: 'Non-AC', price: 1200, availability: false },
    ]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [currentRoom, setCurrentRoom] = useState(null);

    const handleAdd = () => {
        setCurrentRoom(null);
        setIsModalOpen(true);
    };

    const handleEdit = (room) => {
        setCurrentRoom(room);
        setIsModalOpen(true);
    };

    const handleDelete = (id) => {
        if (window.confirm('Are you sure you want to delete this room?')) {
            setRooms(rooms.filter(r => r.id !== id));
        }
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setCurrentRoom(null);
    };

    return (
        <AdminLayout>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Manage Rooms</h1>
                <Button onClick={handleAdd} className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" /> Add Room
                </Button>
            </div>

            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {rooms.map((room) => (
                            <tr key={room.id}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{room.name}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{room.type}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">₹{room.price}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${room.availability ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                        {room.availability ? 'Available' : 'Occupied'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button onClick={() => handleEdit(room)} className="text-indigo-600 hover:text-indigo-900 mr-4"><Edit size={16} /></button>
                                    <button onClick={() => handleDelete(room.id)} className="text-red-600 hover:text-red-900"><Trash2 size={16} /></button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white rounded-lg w-full max-w-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-bold">{currentRoom ? 'Edit Room' : 'Add New Room'}</h2>
                            <button onClick={closeModal} className="text-gray-500 hover:text-gray-700">
                                <X size={20} />
                            </button>
                        </div>
                        <form className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Room Name</label>
                                <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue={currentRoom?.name} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Type</label>
                                <select className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue={currentRoom?.type}>
                                    <option>Deluxe</option>
                                    <option>AC</option>
                                    <option>Non-AC</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700">Price</label>
                                <input type="number" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3" defaultValue={currentRoom?.price} />
                            </div>
                            <div className="flex justify-end gap-2 mt-6">
                                <Button type="button" variant="ghost" onClick={closeModal}>Cancel</Button>
                                <Button type="submit">{currentRoom ? 'Update' : 'Create'}</Button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </AdminLayout>
    );
};

export default ManageRooms;
