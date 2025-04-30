"use client";
import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  image: string;
  additionalInfo?: string;
  createdAt: string;
}

const MemberDetails = () => {
  const router = useRouter();
  const params = useParams();
  const memberId = params?.id as string;
  const { toast } = useToast();
  const [member, setMember] = useState<Member | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchMemberDetails = async () => {
      try {
        if (!memberId) return;
        const response = await axios.get(`/api/members/${memberId}`);
        setMember(response.data.data);
      } catch (error) {
        console.error('Error fetching member details:', error);
        toast({
          title: "Error",
          description: "Failed to fetch member details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMemberDetails();
  }, [memberId, toast]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-10 flex flex-col items-center justify-center min-h-[50vh]">
        <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
        <p className="text-lg mt-4 text-emerald-800">Loading member details...</p>
      </div>
    );
  }

  if (!member) {
    return (
      <div className="container mx-auto px-4 py-10 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="bg-red-50 rounded-lg p-8 max-w-md mx-auto">
          <svg className="w-12 h-12 text-red-500 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="text-xl font-semibold text-red-700 mb-2">Member not found</p>
          <p className="text-gray-600 mb-6">The team member you're looking for doesn't exist or has been removed.</p>
          <Button
            onClick={() => router.push('/members')}
            className="bg-emerald-600 hover:bg-emerald-700"
          >
            Return to Members List
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10 max-w-4xl">
      <Button 
        variant="ghost" 
        className="mb-6 flex items-center gap-2 text-emerald-700 hover:bg-emerald-50"
        onClick={() => router.push('/members')}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Back to Members List
      </Button>

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-6">
          <div className="md:col-span-1">
            <div className="relative h-80 w-full rounded-lg overflow-hidden shadow-md">
              <Image
                src={member.image}
                alt={member.name}
                fill
                style={{ objectFit: 'cover' }}
                className="rounded-lg hover:scale-105 transition-transform duration-300"
                unoptimized={true}
              />
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="bg-emerald-50/50 px-4 py-3 rounded-lg mb-6">
              <h1 className="text-3xl font-bold text-emerald-800">{member.name}</h1>
              <p className="text-emerald-600 font-medium">{member.role}</p>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">Contact Information</h3>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">{member.email}</p>
                </div>
              </div>

              {member.additionalInfo && (
                <div className="bg-white p-4 rounded-lg border border-gray-100">
                  <h3 className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">Additional Information</h3>
                  <p className="text-gray-700 whitespace-pre-wrap">{member.additionalInfo}</p>
                </div>
              )}

              <div className="bg-white p-4 rounded-lg border border-gray-100">
                <h3 className="text-sm font-medium text-emerald-600 uppercase tracking-wider mb-2">Team Member Since</h3>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-gray-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p className="text-lg">
                    {new Date(member.createdAt).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDetails;
