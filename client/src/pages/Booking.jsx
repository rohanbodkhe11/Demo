import React, { useState } from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { CreditCard, Calendar } from 'lucide-react';

const Booking = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        checkIn: '',
        checkOut: '',
        guests: 1,
        roomType: 'Deluxe Suite', // Default for now
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Here we would call the backend to create an order
        // Then open Razorpay
        console.log('Booking submitted:', formData);
        alert('Booking functionality will be integrated with Razorpay.');
    };

    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-white rounded-lg shadow-xl overflow-hidden">
                        <div className="bg-primary px-6 py-4">
                            <h2 className="text-2xl font-bold text-white">Complete Your Reservation</h2>
                            <p className="text-gray-300 text-sm">Secure your stay at Gurukrupa Lodge</p>
                        </div>

                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            {/* Personal Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.name}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Phone Number</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium text-gray-700">Email Address</label>
                                    <input
                                        type="email"
                                        name="email"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.email}
                                        onChange={handleChange}
                                    />
                                </div>
                            </div>

                            {/* Stay Details */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-gray-50 p-4 rounded-md">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check-in Date</label>
                                    <input
                                        type="date"
                                        name="checkIn"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.checkIn}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Check-out Date</label>
                                    <input
                                        type="date"
                                        name="checkOut"
                                        required
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.checkOut}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Guests</label>
                                    <select
                                        name="guests"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.guests}
                                        onChange={handleChange}
                                    >
                                        {[1, 2, 3, 4, 5].map(num => <option key={num} value={num}>{num} Guest{num > 1 ? 's' : ''}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Room Type</label>
                                    <select
                                        name="roomType"
                                        className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-secondary focus:border-secondary sm:text-sm"
                                        value={formData.roomType}
                                        onChange={handleChange}
                                    >
                                        <option value="Deluxe Suite">Deluxe Suite - ₹2500</option>
                                        <option value="Standard AC">Standard AC - ₹1800</option>
                                        <option value="Budget Non-AC">Budget Non-AC - ₹1200</option>
                                    </select>
                                </div>
                            </div>

                            {/* Summary & Payment */}
                            <div className="border-t pt-6">
                                <div className="flex justify-between items-center mb-4 text-lg font-bold">
                                    <span>Total Amount:</span>
                                    <span className="text-primary">₹2500</span>
                                </div>
                                <Button type="submit" className="w-full flex justify-center items-center h-12 text-lg">
                                    <CreditCard className="mr-2 h-5 w-5" /> Pay with Razorpay
                                </Button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Booking;
