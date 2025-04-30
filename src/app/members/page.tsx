"use client";
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';

interface Member {
  _id: string;
  name: string;
  role: string;
  email: string;
  image: string;
}

interface DeleteConfirmModalProps {
  isOpen: boolean;
  member: Member | null;
  onCancel: () => void;
  onConfirm: () => void;
}

// Delete Confirmation Modal Component
const DeleteConfirmModal = ({ isOpen, member, onCancel, onConfirm }: DeleteConfirmModalProps) => {
  if (!isOpen || !member) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-lg max-w-md w-full">
        <div className="p-6">
          <div className="flex items-center mb-4">
            <div className="bg-red-100 p-2 rounded-full mr-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-gray-900">Confirm Deletion</h3>
          </div>
          <p className="text-gray-700 mb-1">Are you sure you want to delete this member?</p>
          <p className="text-gray-900 font-medium mb-4">{member.name} - {member.role}</p>
          <p className="text-sm text-red-600 mb-6">This action cannot be undone.</p>
          
          <div className="flex justify-end gap-3">
            <Button 
              variant="outline" 
              className="border-gray-300"
              onClick={onCancel}
            >
              Cancel
            </Button>
            <Button 
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={onConfirm}
            >
              Delete Member
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MembersPage = () => {
  const { toast } = useToast();
  const [members, setMembers] = useState<Member[]>([]);
  const [filteredMembers, setFilteredMembers] = useState<Member[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const fetchMembers = async () => {
    try {
      const response = await axios.get('/api/members');
      setMembers(response.data.data);
      setFilteredMembers(response.data.data);
    } catch (error) {
      console.error('Error fetching members:', error);
      toast({
        title: "Error",
        description: "Failed to fetch team members",
        variant: "destructive",
      });
    } finally {
      setTimeout(() => setIsLoading(false), 500);
    }
  };

  useEffect(() => {
    fetchMembers();
  }, [toast]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredMembers(members);
      return;
    }

    const filtered = members.filter(member => 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      member.role.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredMembers(filtered);
  }, [searchTerm, members]);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { y: 20, opacity: 0 },
    show: { y: 0, opacity: 1, transition: { duration: 0.4 } }
  };

  const handleDeleteClick = (e: React.MouseEvent, member: Member) => {
    e.preventDefault();
    e.stopPropagation();
    setMemberToDelete(member);
    setShowDeleteModal(true);
  };

  const cancelDelete = () => {
    setShowDeleteModal(false);
    setMemberToDelete(null);
  };

  const confirmDelete = async () => {
    if (!memberToDelete) return;
    
    setIsDeletingId(memberToDelete._id);
    setShowDeleteModal(false);
    
    try {
      await axios.delete(`/api/members/${memberToDelete._id}`);
      
      // Remove the deleted member from the state
      setMembers(prev => prev.filter(m => m._id !== memberToDelete._id));
      setFilteredMembers(prev => prev.filter(m => m._id !== memberToDelete._id));
      
      toast({
        title: "Success",
        description: `${memberToDelete.name} has been removed from the team.`,
      });
      
    } catch (error) {
      console.error('Error deleting member:', error);
      toast({
        title: "Error",
        description: "Failed to delete the team member",
        variant: "destructive",
      });
    } finally {
      setIsDeletingId(null);
      setMemberToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16 flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 relative">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-100"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-emerald-500 border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          </div>
          <p className="text-lg text-emerald-700 font-medium">Loading team members...</p>
          <p className="text-sm text-gray-500 mt-2">Fetching the most up-to-date information</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-10">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="bg-gradient-to-r from-emerald-50 to-teal-50 p-6 rounded-xl mb-8 border border-emerald-100"
      >
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-emerald-800">Team Members</h1>
            <p className="text-emerald-600 mt-1">
              {filteredMembers.length} 
              {filteredMembers.length === 1 ? ' person' : ' people'} in your team
            </p>
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="relative flex-grow md:w-64">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <Input 
                type="text" 
                placeholder="Search by name or role..." 
                className="pl-10 bg-white border-gray-200" 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              {searchTerm && (
                <button 
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setSearchTerm('')}
                >
                  <svg className="h-5 w-5 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
            </div>
            <Link href="/add-member">
              <Button className="bg-emerald-600 hover:bg-emerald-700 whitespace-nowrap">
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                Add Member
              </Button>
            </Link>
          </div>
        </div>
      </motion.div>

      {filteredMembers.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="bg-white text-center py-16 rounded-xl shadow-sm border border-gray-100"
        >
          {searchTerm ? (
            <>
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 16l2.879-2.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242zM21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-xl text-gray-600 mb-2">No matches found</p>
              <p className="text-gray-500 max-w-md mx-auto mb-6">
                No team members match your search for "<span className="font-medium text-emerald-600">{searchTerm}</span>".
              </p>
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear Search
              </Button>
            </>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-300 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <p className="text-xl text-gray-600 mb-2">Your team roster is empty</p>
              <p className="text-gray-500 max-w-md mx-auto mb-6">Add your first team member to start building your team roster.</p>
              <Link href="/add-member">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Add Your First Team Member
                </Button>
              </Link>
            </>
          )}
        </motion.div>
      ) : (
        <motion.div 
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
          variants={container}
          initial="hidden"
          animate="show"
        >
          <AnimatePresence>
            {filteredMembers.map(member => (
              <motion.div 
                key={member._id} 
                variants={item} 
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
                exit={{ opacity: 0, scale: 0.8 }}
              >
                <Link href={`/members/${member._id}`} className="block h-full">
                  <div className="bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden border border-gray-100 h-full flex flex-col group relative">
                    <div className="relative h-36 w-full overflow-hidden">
                      <div className="absolute inset-0 bg-gradient-to-t from-emerald-500/10 to-transparent z-10" />
                      <Image
                        src={member.image}
                        alt={member.name}
                        fill
                        style={{ objectFit: 'cover' }}
                        unoptimized={true}
                        className="transition-transform duration-300 hover:scale-105"
                      />
                      
                      {/* Delete Button */}
                      <button
                        onClick={(e) => handleDeleteClick(e, member)}
                        disabled={isDeletingId === member._id}
                        className="absolute top-2 right-2 bg-white/70 p-1.5 rounded-full opacity-0 group-hover:opacity-100 hover:bg-red-100 transition-opacity duration-200 z-20"
                        title="Delete member"
                      >
                        {isDeletingId === member._id ? (
                          <svg className="animate-spin h-4 w-4 text-red-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        ) : (
                          <svg className="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        )}
                      </button>
                    </div>
                    
                    <div className="p-3 flex flex-col flex-grow">
                      <div>
                        <h2 className="font-semibold text-base text-gray-800 line-clamp-1">{member.name}</h2>
                        <div className="mt-1 inline-flex items-center bg-emerald-50 text-emerald-700 text-xs px-2 py-0.5 rounded-full">
                          <svg className="w-3 h-3 mr-1 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                          </svg>
                          {member.role}
                        </div>
                      </div>
                      <div className="flex items-center mt-2 text-gray-600 text-xs">
                        <svg className="w-3 h-3 mr-1 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="truncate">{member.email}</span>
                      </div>
                      <div className="mt-2 pt-2 border-t border-gray-50 flex justify-between items-center">
                        <span className="text-xs text-gray-500">Details</span>
                        <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Delete confirmation modal */}
      <DeleteConfirmModal 
        isOpen={showDeleteModal}
        member={memberToDelete}
        onCancel={cancelDelete}
        onConfirm={confirmDelete}
      />
    </div>
  );
};

export default MembersPage;
