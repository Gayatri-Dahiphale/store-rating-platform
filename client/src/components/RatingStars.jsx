import React, { useState } from 'react';
import { Star } from 'lucide-react';

const RatingStars = ({ rating, onRate, interactive = true }) => {
  const [hover, setHover] = useState(0);

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={18}
          className={interactive ? 'star' : 'star-static'}
          fill={(hover || rating) >= star ? '#FBBF24' : 'none'}
          color={(hover || rating) >= star ? '#FBBF24' : '#D1D5DB'}
          onMouseEnter={() => interactive && setHover(star)}
          onMouseLeave={() => interactive && setHover(0)}
          onClick={() => interactive && onRate(star)}
        />
      ))}
    </div>
  );
};

export default RatingStars;
