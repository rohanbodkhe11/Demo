import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { Check, Calendar } from 'lucide-react';

const RoomDetails = () => {
    const { id } = useParams();
    // Mock fetch based on ID
    const room = {
        id: '1',
        name: 'Deluxe Suite',
        type: 'Deluxe',
        description: 'Experience the ultimate comfort in our Deluxe Suite. Featuring a king-size bed, private balcony, and premium amenities, this room is perfect for families and couples seeking a luxurious stay.',
        price: 2500,
        image: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
        amenities: ['AC', 'Free Wi-Fi', 'Smart TV', 'Complimentary Breakfast', 'Mini Fridge', 'Tea/Coffee Maker', 'Private Balcony', '24/7 Room Service'],
        maxOccupancy: 3,
    };

    const [checkIn, setCheckIn] = useState('');
    const [checkOut, setCheckOut] = useState('');

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                    {/* Image Section */}
                    <div>
                        <div className="rounded-lg overflow-hidden shadow-lg mb-4">
                            <img src={room.image} alt={room.name} className="w-full h-96 object-cover" />
                        </div>
                        {/* Placeholder for small gallery thumbnails */}
                        <div className="grid grid-cols-4 gap-4">
                            {[1, 2, 3, 4].map(idx => (
                                <div key={idx} className="rounded-md overflow-hidden h-24 bg-gray-200">
                                    <img src={`https://source.unsplash.com/random/200x200?hotel-room&sig=${idx}`} className="w-full h-full object-cover" alt="" />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Section */}
                    <div>
                        <h1 className="text-4xl font-bold text-gray-900 mb-2">{room.name}</h1>
                        <div className="flex items-center mb-6">
                            <span className="px-3 py-1 bg-secondary text-white text-sm font-semibold rounded-full">{room.type}</span>
                            <span className="ml-4 text-gray-500">Max Occupancy: {room.maxOccupancy} Adults</span>
                        </div>

                        <p className="text-3xl font-bold text-primary mb-6">₹{room.price} <span className="text-lg font-normal text-gray-500">/ night</span></p>

                        <p className="text-gray-600 mb-8 leading-relaxed">
                            {room.description}
                        </p>

                        <div className="mb-8">
                            <h3 className="text-xl font-semibold mb-4 text-gray-900">Amenities</h3>
                            <div className="grid grid-cols-2 gap-y-2">
                                {room.amenities.map((item, idx) => (
                                    <div key={idx} className="flex items-center text-gray-600">
                                        <Check className="h-5 w-5 text-green-500 mr-2" />
                                        {item}
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Booking Widget */}
                        <div className="bg-white p-6 rounded-lg shadow-lg border border-gray-100">
                            <h3 className="text-xl font-bold mb-4">Book this Room</h3>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-in</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-3 py-2 bg-gray-50"
                                        value={checkIn}
                                        onChange={(e) => setCheckIn(e.target.value)}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Check-out</label>
                                    <input
                                        type="date"
                                        className="w-full border rounded-md px-3 py-2 bg-gray-50"
                                        value={checkOut}
                                        onChange={(e) => setCheckOut(e.target.value)}
                                    />
                                </div>
                            </div>
                            <Button size="lg" className="w-full">Proceed to Book</Button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default RoomDetails;
