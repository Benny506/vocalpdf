import React from 'react';

const Logo = ({ size = 40, className = "" }) => {
    return (
        <div
            className={`d-inline-flex align-items-center justify-content-center ${className}`}
            style={{ width: size, height: size, flexShrink: 0 }}
        >
            <svg
                viewBox="0 0 100 100"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '100%', height: '100%' }}
            >
                {/* Subtle Background Shape */}
                <rect width="100" height="100" rx="22" fill="#4F46E5" fillOpacity="0.08" />

                {/* The VP Ligature */}
                <path
                    d="M 25 35 L 45 70 L 65 35 V 75"
                    stroke="#4F46E5"
                    strokeWidth="9"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                />

                {/* Stylized P loop */}
                <path
                    d="M 65 35 C 90 35 90 62 65 62"
                    stroke="#4F46E5"
                    strokeWidth="9"
                    strokeLinecap="round"
                />
            </svg>
        </div>
    );
};

export default Logo;
