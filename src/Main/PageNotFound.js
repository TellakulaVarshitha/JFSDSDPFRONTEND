import React from 'react';
import NotFoundImage from './notfound.png';

export default function PageNotFound() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100vh',
        textAlign: 'center',
        backgroundColor: '#f0f0f0', // Optional: background color
      }}
    >
      <h1>Page Not Found</h1>
      <img
        src={NotFoundImage}
        alt="Page Not Found"
        style={{
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </div>
  );
}
