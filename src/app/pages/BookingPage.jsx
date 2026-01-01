import React from 'react';
import BookingFlow from '../components/BookingFlow';

/**
 * BookingPage - Wrapper component for the booking flow
 * 
 * This component serves as the main booking page that uses the BookingFlow component
 * to handle the complete booking process from date selection to payment confirmation.
 */
function BookingPage({ property, user, onNavigate }) {
  const handleBookingComplete = (booking) => {
    console.log('✅ Booking completed:', booking._id);
    // Could add analytics tracking, notifications, etc. here
  };

  return (
    <BookingFlow 
      property={property}
      user={user}
      onNavigate={onNavigate}
      onBookingComplete={handleBookingComplete}
    />
  );
}

export default BookingPage;