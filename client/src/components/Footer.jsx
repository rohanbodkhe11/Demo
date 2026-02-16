import React from 'react';
import { Link } from 'react-router-dom';
import { Phone, Mail, MapPin, Facebook, Instagram } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-primary text-white pt-12 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Brand Info */}
                    <div>
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="text-white">Gurukrupa</span>
                            <span className="text-secondary ml-1">Lodge</span>
                        </h3>
                        <p className="text-gray-300 mb-4">
                            Comfortable Stay with Trusted Hospitality. Experience a home away from home with our premium amenities and dedicated service.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                                <Facebook className="h-6 w-6" />
                            </a>
                            <a href="#" className="text-gray-300 hover:text-secondary transition-colors">
                                <Instagram className="h-6 w-6" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-secondary">Quick Links</h4>
                        <ul className="space-y-2">
                            {[
                                { name: 'Home', path: '/' },
                                { name: 'Our Rooms', path: '/rooms' },
                                { name: 'Gallery', path: '/gallery' },
                                { name: 'Contact Us', path: '/contact' },
                                { name: 'Book Now', path: '/booking' },
                            ].map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} className="text-gray-300 hover:text-white transition-colors">
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="text-lg font-semibold mb-4 text-secondary">Contact Us</h4>
                        <div className="space-y-4">
                            <div className="flex items-start">
                                <MapPin className="h-5 w-5 text-secondary mt-1 flex-shrink-0" />
                                <span className="ml-3 text-gray-300">
                                    123 Lodge Street, Near Temple Road,<br />
                                    City Name, State - 123456
                                </span>
                            </div>
                            <div className="flex items-center">
                                <Phone className="h-5 w-5 text-secondary flex-shrink-0" />
                                <span className="ml-3 text-gray-300">+91 98765 43210</span>
                            </div>
                            <div className="flex items-center">
                                <Mail className="h-5 w-5 text-secondary flex-shrink-0" />
                                <span className="ml-3 text-gray-300">info@gurukrupalodge.com</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
                    <p>&copy; {new Date().getFullYear()} Gurukrupa Lodge. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
