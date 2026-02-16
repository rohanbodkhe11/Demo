import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../api';

const Rooms = () => {
    const [rooms, setRooms] = useState([]);
    const [filteredRooms, setFilteredRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        const fetchRooms = async () => {
            try {
                const response = await api.get('/rooms');
                setRooms(response.data);
                setFilteredRooms(response.data);
                setLoading(false);
            } catch (err) {
                console.error("Failed to fetch rooms:", err);
                setError("Failed to load rooms. Please try again later.");
                setLoading(false);
            }
        };

        fetchRooms();
    }, []);

    useEffect(() => {
        const results = rooms.filter(room =>
            room.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            room.type.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredRooms(results);
    }, [searchTerm, rooms]);

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900">Our Rooms</h1>

                        <div className="flex items-center space-x-4 mt-4 md:mt-0">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search rooms..."
                                    className="pl-10 pr-4 py-2 border rounded-md focus:ring-primary focus:border-primary"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-500">Loading rooms...</div>
                    ) : error ? (
                        <div className="text-center py-20 text-red-500">{error}</div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {filteredRooms.map(room => (
                                <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                    <img src={room.image || 'https://via.placeholder.com/400x300?text=No+Image'} alt={room.name} className="w-full h-48 object-cover" />
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-2">
                                            <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                                            <span className="px-2 py-1 bg-secondary text-white text-xs font-semibold rounded">{room.type}</span>
                                        </div>
                                        <p className="text-2xl font-bold text-primary mb-4">₹{room.price} <span className="text-sm font-normal text-gray-500">/ night</span></p>

                                        <div className="flex flex-wrap gap-2 mb-6">
                                            {room.amenities && room.amenities.map((amenity, idx) => (
                                                <span key={idx} className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">{amenity}</span>
                                            ))}
                                        </div>

                                        <Link to={`/rooms/${room.id}`}>
                                            <Button className="w-full" variant="primary">View Details</Button>
                                        </Link>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
};

export default Rooms;
