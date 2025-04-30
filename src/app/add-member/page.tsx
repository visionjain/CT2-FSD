"use client";
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import Image from 'next/image';

const AddMember = () => {
  const router = useRouter();
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    email: '',
    additionalInfo: '',
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) newErrors.name = "Name is required";
    if (!formData.role.trim()) newErrors.role = "Role is required";
    
    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }
    
    if (!imageFile) newErrors.image = "Profile image is required";
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name);
      formDataToSend.append('role', formData.role);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('additionalInfo', formData.additionalInfo || '');
      
      if (imageFile) {
        if (imageFile.size > 5 * 1024 * 1024) {
          setErrors({...errors, image: "Image size exceeds 5MB limit"});
          setIsSubmitting(false);
          return;
        }
        formDataToSend.append('image', imageFile);
      }
      
      await axios.post('/api/members', formDataToSend);
      
      toast({
        title: "Success!",
        description: "Member added successfully.",
      });
      
      router.push('/members');
      
    } catch (error: unknown) {
      console.error('Error adding member:', error);
      
      const isAxiosError = (error: unknown): error is { response?: { status?: number, data?: { error?: string } } } => {
        return typeof error === 'object' && error !== null && 'response' in error;
      };
      
      if (isAxiosError(error) && error.response?.status === 409) {
        setErrors({
          ...errors,
          email: "This email is already registered with another member."
        });
        
        toast({
          title: "Email Already Exists",
          description: "This email address is already in use. Please use a different email.",
          variant: "destructive",
        });
      } else {
        const errorMsg = isAxiosError(error) && error.response?.data?.error 
          ? error.response.data.error 
          : "Failed to add member. Please try again.";
          
        toast({
          title: "Error",
          description: errorMsg,
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="container mx-auto py-6 max-w-2xl px-4">
      <div className="flex items-center mb-6">
        <div className="bg-emerald-100 p-2 rounded-lg mr-4">
          <svg className="w-6 h-6 text-emerald-700" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">Add New Team Member</h1>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Label htmlFor="name" className="flex items-center text-gray-700 text-sm">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  Full Name <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="John Doe"
                  className={errors.name ? "border-red-500" : "border-gray-300"}
                />
                {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="role" className="flex items-center text-gray-700 text-sm">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Role <span className="text-red-500 ml-1">*</span>
                </Label>
                <Input 
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  placeholder="Frontend Developer"
                  className={errors.role ? "border-red-500" : "border-gray-300"}
                />
                {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center text-gray-700 text-sm">
                <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Email Address <span className="text-red-500 ml-1">*</span>
              </Label>
              <Input 
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                className={errors.email ? "border-red-500" : "border-gray-300"}
              />
              {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="image" className="flex items-center text-gray-700 text-sm">
                  <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Profile Image <span className="text-red-500 ml-1">*</span>
                </Label>
                
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-emerald-500 transition-colors cursor-pointer bg-gray-50">
                  <Input 
                    id="image"
                    name="image"
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className={`hidden ${errors.image ? "border-red-500" : ""}`}
                  />
                  <label htmlFor="image" className="cursor-pointer block">
                    <svg className="w-8 h-8 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                    </svg>
                    <p className="mt-2 text-sm text-gray-600">Click to upload</p>
                    <p className="text-xs text-gray-500">Max size: 5MB</p>
                  </label>
                </div>
                {errors.image && <p className="text-sm text-red-500 mt-1">{errors.image}</p>}
              </div>
              
              <div className="flex flex-col items-center justify-center">
                {imagePreview ? (
                  <div className="flex flex-col items-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-emerald-100 shadow-sm">
                      <Image 
                        src={imagePreview} 
                        alt="Preview" 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <p className="text-xs text-emerald-600 mt-2">Image Preview</p>
                  </div>
                ) : (
                  <div className="flex flex-col items-center">
                    <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                      <svg className="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">No image selected</p>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="additionalInfo" className="flex items-center text-gray-700 text-sm">
                <svg className="w-4 h-4 mr-2 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
                Additional Information
              </Label>
              <Textarea 
                id="additionalInfo"
                name="additionalInfo"
                value={formData.additionalInfo}
                onChange={handleChange}
                placeholder="Add any additional details about this team member..."
                rows={3}
                className="border-gray-300 resize-none text-sm"
              />
              <p className="text-xs text-gray-500">Include skills, experience, or any other relevant details.</p>
            </div>
            
            <div className="pt-4 border-t border-gray-100">
              <div className="flex gap-4 justify-end">
                <Button 
                  type="button" 
                  variant="outline"
                  className="w-24 border-gray-300 hover:bg-gray-50"
                  onClick={() => router.push('/members')}
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-36 bg-emerald-600 hover:bg-emerald-700"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Adding...
                    </>
                  ) : (
                    <>
                      <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                      </svg>
                      Add Member
                    </>
                  )}
                </Button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddMember;
