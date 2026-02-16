import React, { useState, useEffect } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { Filter, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Rooms = () => {
    // Mock data for now, will replace with API call
    const [rooms, setRooms] = useState([
        {
            id: '1',
            name: 'Deluxe Suite',
            type: 'Deluxe',
            price: 2500,
            image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            amenities: ['AC', 'WiFi', 'TV', 'Breakfast'],
        },
        {
            id: '2',
            name: 'Standard AC Room',
            type: 'AC',
            price: 1800,
            image: 'https://images.unsplash.com/photo-1590490360182-f33db0930327?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            amenities: ['AC', 'WiFi', 'TV'],
        },
        {
            id: '3',
            name: 'Budget Non-AC',
            type: 'Non-AC',
            price: 1200,
            image: 'https://images.unsplash.com/photo-1566665797739-1674de7a421a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
            amenities: ['WiFi', 'TV'],
        },
    ]);

    useEffect(() => {
        // Fetch rooms from backend in future
        // axios.get('http://localhost:5000/api/rooms').then(res => setRooms(res.data));
    }, []);

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
                                />
                                <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                            </div>
                            <Button variant="outline"><Filter className="mr-2 h-4 w-4" /> Filter</Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {rooms.map(room => (
                            <div key={room.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
                                <img src={room.image} alt={room.name} className="w-full h-48 object-cover" />
                                <div className="p-6">
                                    <div className="flex justify-between items-start mb-2">
                                        <h3 className="text-xl font-bold text-gray-900">{room.name}</h3>
                                        <span className="px-2 py-1 bg-secondary text-white text-xs font-semibold rounded">{room.type}</span>
                                    </div>
                                    <p className="text-2xl font-bold text-primary mb-4">₹{room.price} <span className="text-sm font-normal text-gray-500">/ night</span></p>

                                    <div className="flex flex-wrap gap-2 mb-6">
                                        {room.amenities.map((amenity, idx) => (
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
                </div>
            </div>
        </MainLayout>
    );
};

export default Rooms;
