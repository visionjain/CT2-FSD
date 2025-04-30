import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';

const Home = () => {
  return (
    <div className="container mx-auto px-4 flex flex-col justify-center flex-grow overflow-hidden">
      <div className="text-center max-w-4xl mx-auto py-2">
        <div className="mb-4">
          <h1 className="text-4xl lg:text-5xl font-extrabold mb-1 mt-10 text-emerald-700">MITRA</h1>
          <p className="text-base lg:text-lg text-emerald-600">Team Management Simplified</p>
        </div>
        
        {/* CT-2 Project Information - Reduced padding & spacing */}
        <div className="mb-6 p-4 bg-gradient-to-br from-emerald-50 to-teal-50 rounded-xl border border-emerald-100">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 rounded-full text-sm font-medium">
              Academic Project
            </span>
          </div>
          <h2 className="text-xl lg:text-2xl font-bold mb-2 text-gray-800">CT-2 of 21CSS301T – FULL STACK DEVELOPMENT</h2>
          
          {/* Faculty Information with Image - Now Centered - Reduced spacing */}
          <div className="mt-3 mb-3 flex flex-col items-center justify-center gap-3 text-center">
            <div className="relative w-16 h-16 lg:w-20 lg:h-20 rounded-full overflow-hidden border-2 border-emerald-300 shadow-sm flex-shrink-0">
              <Image 
                src="/sir.jpg" 
                alt="Dr. Jagadish Kumar N"
                fill
                style={{ objectFit: 'cover' }}
                priority
              />
            </div>
            <div>
              <p className="text-gray-700 font-medium">Course Faculty:</p>
              <p className="text-emerald-700 font-semibold">Dr. Jagadish Kumar N</p>
              <p className="text-sm text-gray-600">Assistant Professor</p>
              <p className="text-sm text-gray-600">Department of Data Science and Business Studies</p>
            </div>
          </div>
          
          {/* Team Members Section - Reduced spacing */}
          <div className="mt-4">
            <p className="text-gray-700 font-medium mb-2">Team Members:</p>
            <div className="grid md:grid-cols-3 gap-3">
              <div className="p-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100">
                  <Image 
                    src="/vision.jpg" 
                    alt="Vision Jain" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-emerald-700 truncate">Vision Jain</p>
                  <p className="text-xs text-gray-500">RA2212704010008</p>
                </div>
              </div>
              
              {/* Other team members with similar reduced spacing */}
              <div className="p-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100">
                  <Image 
                    src="/mudit.jpeg" 
                    alt="Mudit Khater" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-emerald-700 truncate">Mudit Khater</p>
                  <p className="text-xs text-gray-500">RA2212704010042</p>
                </div>
              </div>
              
              <div className="p-2 bg-white rounded-lg shadow-sm flex items-center gap-2">
                <div className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-emerald-100">
                  <Image 
                    src="/waibhav.jpg" 
                    alt="Kumar Waibhav Akshat" 
                    fill
                    style={{ objectFit: 'cover' }}
                    priority
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-emerald-700 truncate">Kumar Waibhav Akshat</p>
                  <p className="text-xs text-gray-500">RA2212704010027</p>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Reduced spacing for bottom content */}
        <h2 className="text-lg lg:text-xl font-bold mb-2">Manage Your Team with Ease</h2>
        <p className="text-gray-600 mb-4 text-sm lg:text-base">
          MITRA helps you organize team members and keep everyone&apos;s information in one place.
          Track roles, contact details, and member profiles with our intuitive interface.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center gap-3">
          <Link href="/add-member">
            <Button className="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700">Add New Member</Button>
          </Link>
          <Link href="/members">
            <Button className="w-full sm:w-auto" variant="outline">View Team Members</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;