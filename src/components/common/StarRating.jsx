import React from 'react';
const StarRating = ({ rating = 0, max = 5 }) => (
  <span className="text-yellow-400 mr-2">
    {'★'.repeat(rating)}{'☆'.repeat(max - rating)}
  </span>
);
export default StarRating; 