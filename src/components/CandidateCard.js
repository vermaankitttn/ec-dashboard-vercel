import React, { useState } from 'react';
import './CandidateCard.css';
import { getCandidatePhoto, getInitials } from '../utils/photoMapping';

const CandidateCard = ({ candidate, isTop10 }) => {
  const { name, totalCount, totalValue, position } = candidate;
  
  // Get candidate photo and initials
  const photoUrl = getCandidatePhoto(name);
  const initials = getInitials(name);
  
  // State for image loading error
  const [imageError, setImageError] = useState(false);
  
  // Determine card color based on position
  const cardBgColor = isTop10 ? "#e8f5e8" : "#fff5e6"; // Light orange-yellow for trailing candidates
  const borderColor = isTop10 ? "#2E8B57" : "#ffa726"; // Orange border for trailing candidates
  


  return (
    <div 
      className="candidate-card"
      style={{
        border: `3px solid ${borderColor}`,
        backgroundColor: cardBgColor
      }}
    >
      {/* Position Number */}
      <div className="position-number">
        {position || 'N/A'}
      </div>
      
      {/* Header */}
      <div 
        className="card-header"
        style={{ backgroundColor: borderColor }}
      >
        {name.toUpperCase()}
      </div>
      
      {/* Card Body */}
      <div className="card-body">
        <div className="card-content">
          {/* Profile Photo */}
          <div className="profile-photo">
            {photoUrl && !imageError ? (
              <img 
                src={photoUrl} 
                alt={name}
                onError={() => setImageError(true)}
                className="candidate-photo"
              />
            ) : (
              <div className="photo-fallback">
                {initials}
              </div>
            )}
          </div>
          
          {/* Vote Information */}
          <div className="vote-info">
            <div className="vote-stats">
              <div className="stat-item">
                <span className="stat-label">Total Count:</span>
                <span className="stat-value">{totalCount}</span>
              </div>
              <div className="stat-item">
                <span className="stat-label">Total Value:</span>
                <span className="stat-value">{totalValue}</span>
              </div>
            </div>
            

          </div>
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;
