// While Firestore is schemaless, these models act as interfaces/validators
export const Room = {
    collection: 'rooms',
    schema: {
        name: '',
        type: '', // AC, Non-AC, Deluxe
        price: 0,
        amenities: [],
        maxOccupancy: 0,
        images: [],
        availability: true,
        createdAt: null
    }
};

export const Booking = {
    collection: 'bookings',
    schema: {
        roomId: '',
        guestName: '',
        phone: '',
        email: '',
        checkIn: null,
        checkOut: null,
        totalAmount: 0,
        paymentStatus: 'Pending', // Pending, Paid, Failed
        bookingStatus: 'Pending', // Pending, Confirmed, Checked-in, Checked-out, Cancelled
        paymentId: '',
        createdAt: null
    }
};
