import React from 'react';
import { Helmet } from 'react-helmet-async';
import Logo from '@/components/react-svg/logo';

const Maintenance: React.FC = () => {
  return (
    <>
      <Helmet>
        <title>Under Maintenance - Fadedlines Barbershop</title>
        <meta name="description" content="We're currently performing scheduled maintenance. We'll be back soon!" />
        <meta name="robots" content="noindex, nofollow" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center bg-gray-950 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl w-full space-y-8 text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <Logo className="w-64 h-auto" />
          </div>

          {/* Main Message */}
          <div className="space-y-4">
            <h1 className="text-4xl sm:text-5xl font-bold text-gray-50">
              We'll Be Right Back
            </h1>

            <p className="text-xl text-gray-300 mt-4">
              We're currently performing scheduled maintenance to improve your experience.
            </p>

            <div className="mt-8 p-6 bg-[#262626] rounded-lg border border-gray-800">
              <div className="flex items-center justify-center space-x-2 mb-4">
                <div className="w-3 h-3 bg-[#33FF00] rounded-full animate-pulse"></div>
                <p className="text-lg font-semibold text-[#33FF00]">
                  Maintenance in Progress
                </p>
              </div>
              <p className="text-gray-400">
                Our team is working hard to get everything back online.
                <br />
                Please check back shortly.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-8 text-gray-400">
              <p>Need immediate assistance?</p>
              <p className="mt-2">
                Contact us at{' '}
                <a
                  href="mailto:info@fadedlinesbarbershop.com"
                  className="text-[#33FF00] hover:underline"
                >
                  info@fadedlinesbarbershop.com
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Maintenance;
