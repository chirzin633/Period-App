"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";

export default function SignupForm() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [formError, setFormError] = useState(null);
  const [success, setSuccess] = useState(false);

  const { signUp, loading } = useAuthStore();
  const router = useRouter();

  const handleChange = (field) => (e) => {
    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    if (formData.password !== formData.confirmPassword) {
      setFormError("Passwords do not match.");
      return;
    }
    if (formData.password.length < 8) {
      setFormError("Password must be at least 8 characters.");
      return;
    }
    if (!agreedToTerms) {
      setFormError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    const { data, error } = await signUp({
      email: formData.email,
      password: formData.password,
      fullName: formData.fullName,
    });

    if (error) {
      setFormError(error.message || "Something went wrong. Please try again.");
      return;
    }

    // Check if email confirmation is required
    if (data?.user && !data.session) {
      setSuccess(true);
    } else {
      router.push("/dashboard");
    }
  };

  if (success) {
    return (
      <div className="text-center py-8">
        <div className="w-20 h-20 bg-cerulean-100 rounded-full flex items-center justify-center mx-auto mb-5">
          <span className="material-symbols-outlined text-4xl text-cerulean-500">mark_email_read</span>
        </div>
        <h3 className="text-xl font-bold text-cerulean-800 mb-2">Check your email!</h3>
        <p className="text-alice-blue-600 text-sm mb-6">
          We sent a confirmation link to <strong className="text-cerulean-700">{formData.email}</strong>. Click the link to activate your account.
        </p>
        <Link href="/login">
          <Button variant="secondary" size="md">
            Back to Login
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input icon="person" type="text" placeholder="Full Name" value={formData.fullName} onChange={handleChange("fullName")} required wrapperClassName="mb-0" />
      <Input icon="mail" type="email" placeholder="Email Address" value={formData.email} onChange={handleChange("email")} required wrapperClassName="mb-0" />
      <Input icon="lock" type="password" placeholder="Password (min. 8 characters)" value={formData.password} onChange={handleChange("password")} required wrapperClassName="mb-0" />
      <Input icon="lock_reset" type="password" placeholder="Confirm Password" value={formData.confirmPassword} onChange={handleChange("confirmPassword")} required wrapperClassName="mb-0" />

      <label className="flex items-start gap-3 cursor-pointer">
        <button
          type="button"
          onClick={() => setAgreedToTerms(!agreedToTerms)}
          className={`w-5 h-5 mt-0.5 rounded border-2 flex items-center justify-center shrink-0 transition-all duration-200 ${agreedToTerms ? "bg-cerulean-500 border-cerulean-500" : "border-alice-blue-300 bg-white"}`}
        >
          {agreedToTerms && <span className="text-white text-xs font-bold">✓</span>}
        </button>
        <span className="text-sm text-alice-blue-600 leading-relaxed">
          I agree to the{" "}
          <Link href="/terms" className="text-cerulean-500 hover:underline font-medium">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-cerulean-500 hover:underline font-medium">
            Privacy Policy
          </Link>
          .
        </span>
      </label>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {formError}
        </div>
      )}

      <Button type="submit" variant="primary" size="full" loading={loading}>
        <span className="material-symbols-outlined text-lg">person_add</span>
        Create Account
      </Button>

      <p className="text-center text-sm text-alice-blue-600">
        Already have an account?{" "}
        <Link href="/login" className="text-cerulean-500 font-semibold hover:underline">
          Sign in
        </Link>
      </p>
    </form>
  );
}
