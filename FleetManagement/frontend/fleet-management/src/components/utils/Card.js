import React from 'react';

const Card = ({ title, children, className }) => {
  return (
    <div className={`bg-white shadow-md rounded p-4 ${className}`}>
      <h3 className="text-lg font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
};

export default Card;