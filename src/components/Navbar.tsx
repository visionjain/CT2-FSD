"use client";
import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const Navbar = () => {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // Define navigation items
  const navItems = [
    { name: 'Home', href: '/' },
    { name: 'Team Members', href: '/members' },
    { name: 'Add Member', href: '/add-member' },
  ];

  return (
    <header className="bg-white border-b border-emerald-100 shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 relative">
        <div className="flex items-center justify-between">
          {/* Logo Area */}
          <div className="flex items-center">
            {/* MITRA Logo */}
            <Link href="/" className="inline-flex items-center transition-transform hover:scale-105 mr-4">
              <div className="flex items-center">
                <span className="text-2xl font-bold bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">MITRA</span>
                <span className="ml-2 text-xs font-medium bg-gradient-to-r from-emerald-500 to-teal-400 px-2 py-1 rounded-full text-white">Team</span>
              </div>
            </Link>
            
            {/* University Logos - Desktop - Larger Size with Positioning */}
            <div className="hidden md:block pl-4 border-l border-gray-200 relative">
              <div className="flex items-center space-x-4 absolute -top-6">
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image 
                    src="/srm.png" 
                    alt="SRM University" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="relative h-20 w-20 flex-shrink-0">
                  <Image 
                    src="/dsbs.png" 
                    alt="Department of Data Science and Business Studies" 
                    fill 
                    className="object-contain"
                    priority
                  />
                </div>
              </div>
              {/* Invisible spacer to maintain layout */}
              <div className="w-44 h-8 invisible"></div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <nav className="hidden md:flex">
            <ul className="flex space-x-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 flex items-center",
                        isActive 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      {item.name}
                      {isActive && (
                        <span className="ml-2 w-2 h-2 rounded-full bg-emerald-500"></span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>
          
          {/* Mobile menu button */}
          <button 
            className="md:hidden p-2 rounded-lg bg-gray-50 text-gray-600 hover:bg-gray-100 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <div className="container mx-auto px-4 py-2">
            {/* University Logos - Mobile - Increased Size */}
            <div className="flex items-center justify-center py-3 mb-2 border-b border-gray-100">
              <div className="relative h-16 w-16 mr-4">
                <Image 
                  src="/srm.png" 
                  alt="SRM University" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
              <div className="relative h-16 w-16">
                <Image 
                  src="/dsbs.png" 
                  alt="Department of Data Science and Business Studies" 
                  fill 
                  className="object-contain"
                  priority
                />
              </div>
            </div>
            
            {/* Navigation Links */}
            <ul className="space-y-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className={cn(
                        "block px-4 py-2 rounded-lg text-sm font-medium",
                        isActive 
                          ? "bg-emerald-50 text-emerald-700" 
                          : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                      )}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      {item.name}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      )}
    </header>
  );
};

export default Navbar;
