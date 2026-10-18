"use client";

import React, { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/components/ui/Toast";

export default function AccountProfilePage() {
  const { user, updateProfile } = useAuth();
  const { toast } = useToast();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [isLoading, setIsLoading] = useState(false);
  const [nameError, setNameError] = useState("");

  // Synchronize inputs when user profile is loaded from /api/auth/me or updated
  React.useEffect(() => {
    if (user) {
      setFullName(user.fullName || "");
      setPhone(user.phone || "");
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");

    if (!fullName || fullName.trim().length < 2) {
      setNameError("Full name must be at least 2 characters.");
      return;
    }

    setIsLoading(true);
    const res = await updateProfile(fullName.trim(), phone.trim() || undefined);
    setIsLoading(false);

    if (res.success) {
      toast({
        title: "Profile Updated",
        description: "Your private client details have been successfully saved.",
        type: "success",
      });
    } else {
      toast({
        title: "Update Failed",
        description: res.error || "Failed to update profile. Please try again.",
        type: "error",
      });
    }
  };

  const parsedYear = user?.createdAt ? new Date(user.createdAt).getFullYear() : 2026;
  const memberSinceYear = isNaN(parsedYear) ? 2026 : parsedYear;

  return (
    <div className="max-w-2xl space-y-8">
      {/* Editorial Header */}
      <div className="pb-6 border-b border-[#E6E4DE]">
        <span className="font-mono text-eyebrow-label uppercase tracking-widest text-[#78542E]">
          Account Settings
        </span>
        <h1 className="font-serif text-page-title text-[#121312] mt-1">
          Private Client Profile
        </h1>
        <p className="font-sans text-body-small text-[#63655E] mt-1">
          Manage your personal details and advisory contact preferences.
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6" noValidate>
        {/* Email Field (Read-only verified) */}
        <div>
          <label className="block text-xs font-mono uppercase tracking-[0.12em] text-[#4A4C48] mb-2 font-medium">
            Email Address
          </label>
          <div className="flex items-center justify-between p-3.5 bg-[#F3F1EC] border border-[#D5D1C7] rounded-xs font-mono text-sm text-[#121312]">
            <span className="truncate">{user?.email}</span>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-[#78542E] text-[#FBFBF9] shrink-0 ml-2">
              ✓ Verified via OTP
            </span>
          </div>
          <p className="mt-1.5 text-[11px] font-sans text-[#8E8A80]">
            Authentication is passwordless. Your email is your cryptographic identity key.
          </p>
        </div>

        {/* Full Name */}
        <Input
          label="Full Legal Name"
          id="profile-fullname"
          name="fullName"
          autoComplete="name"
          value={fullName}
          onChange={(e) => {
            setFullName(e.target.value);
            if (nameError) setNameError("");
          }}
          error={nameError}
          isRequired
        />

        {/* Telephone Number */}
        <Input
          label="Contact Telephone"
          id="profile-phone"
          type="tel"
          name="phone"
          autoComplete="tel"
          placeholder="+44 20 7946 0192"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          helperText="Direct line used exclusively by your designated Listing Advisor to coordinate property access."
        />

        {/* Membership Details Card */}
        <div className="p-4 bg-[#FFFFFF] border border-[#E6E4DE] rounded-xs space-y-2">
          <span className="font-mono text-[10px] uppercase text-[#78542E] block">
            Advisory Status
          </span>
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[#63655E]">Client Membership:</span>
            <span className="font-medium text-[#121312]">Active Private Client</span>
          </div>
          <div className="flex items-center justify-between text-xs font-sans">
            <span className="text-[#63655E]">Member Since:</span>
            <span className="font-mono text-[#121312]">{memberSinceYear}</span>
          </div>
        </div>

        {/* Submit Button */}
        <div className="pt-4 flex items-center justify-end">
          <Button
            type="submit"
            variant="primary"
            isLoading={isLoading}
            loadingText="Saving Changes..."
          >
            Save Profile Changes
          </Button>
        </div>
      </form>
    </div>
  );
}
