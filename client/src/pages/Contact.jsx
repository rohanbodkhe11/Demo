import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { Phone, Mail, MapPin } from 'lucide-react';

const Contact = () => {
    return (
        <MainLayout>
            <div className="bg-gray-50 min-h-screen py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Contact Us</h1>
                        <p className="mt-4 text-xl text-gray-500">We'd love to hear from you. Get in touch with us.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Contact Info & Map */}
                        <div className="space-y-8">
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-xl font-bold text-gray-900 mb-4">Contact Information</h3>
                                <div className="space-y-4">
                                    <div className="flex items-start">
                                        <MapPin className="h-6 w-6 text-secondary mt-1 flex-shrink-0" />
                                        <p className="ml-3 text-gray-600">
                                            123 Lodge Street, Near Temple Road,<br />
                                            City Name, State - 123456
                                        </p>
                                    </div>
                                    <div className="flex items-center">
                                        <Phone className="h-6 w-6 text-secondary flex-shrink-0" />
                                        <p className="ml-3 text-gray-600">+91 98765 43210</p>
                                    </div>
                                    <div className="flex items-center">
                                        <Mail className="h-6 w-6 text-secondary flex-shrink-0" />
                                        <p className="ml-3 text-gray-600">info@gurukrupalodge.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-200 rounded-lg shadow-md h-64 overflow-hidden">
                                {/* Embed Google Map here */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d30711.02633005856!2d73.856743!3d18.520430!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c06adbb363b9%3A0x6d5c56d78a846c48!2sPune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1620000000000!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen=""
                                    loading="lazy"
                                    title="Google Map"
                                ></iframe>
                            </div>
                        </div>

                        {/* Contact Form */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h3 className="text-xl font-bold text-gray-900 mb-4">Send us a Message</h3>
                            <form className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Name</label>
                                    <input type="text" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Email</label>
                                    <input type="email" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary" />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700">Message</label>
                                    <textarea rows="4" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary focus:border-primary"></textarea>
                                </div>
                                <Button className="w-full">Send Message</Button>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
};

export default Contact;
