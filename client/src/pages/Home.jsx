import React from 'react';
import MainLayout from '../layouts/MainLayout';
import Button from '../components/Button';
import { Link } from 'react-router-dom';

const Home = () => {
    return (
        <MainLayout>
            {/* Hero Section */}
            <section className="relative h-[600px] flex items-center justify-center">
                {/* Background Image Placeholder - using a gradient for now, replace with actual image */}
                <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-gray-800 z-0">
                    <img
                        src="https://images.unsplash.com/photo-1566073771259-6a8506099945?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
                        alt="Lodge Exterior"
                        className="w-full h-full object-cover opacity-50"
                    />
                </div>

                <div className="relative z-10 text-center px-4 sm:px-6 lg:px-8">
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight mb-4">
                        Gurukrupa <span className="text-secondary">Lodge</span>
                    </h1>
                    <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-200 mb-8">
                        Comfortable Stay with Trusted Hospitality. Experience luxury and peace in the heart of the city.
                    </p>
                    <div className="flex justify-center gap-4">
                        <Link to="/booking">
                            <Button size="lg" variant="secondary">Book Now</Button>
                        </Link>
                        <Link to="/rooms">
                            <Button size="lg" variant="outline" className="text-white border-white hover:bg-white hover:text-primary">
                                View Rooms
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Amenities Preview */}
            <section className="py-20 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-extrabold text-primary sm:text-4xl">
                            Why Choose Us?
                        </h2>
                        <p className="mt-4 text-xl text-gray-500">
                            We provide the best amenities for a comfortable stay.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {[
                            { title: 'Prime Location', desc: 'Located in the heart of the city, close to all major attractions.' },
                            { title: 'Free Wi-Fi', desc: 'Stay connected with high-speed internet access throughout the property.' },
                            { title: '24/7 Support', desc: 'Our dedicated staff is available round the clock to assist you.' },
                        ].map((item, index) => (
                            <div key={index} className="p-6 bg-gray-50 rounded-lg text-center hover:shadow-lg transition-shadow">
                                <h3 className="text-xl font-bold text-primary mb-2">{item.title}</h3>
                                <p className="text-gray-600">{item.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </MainLayout>
    );
};

export default Home;
