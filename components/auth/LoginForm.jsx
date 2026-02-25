"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import useAuthStore from "@/store/authStore";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [keepLoggedIn, setKeepLoggedIn] = useState(true);
  const [formError, setFormError] = useState(null);

  const { signIn, loading } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError(null);

    const { data, error } = await signIn({ email, password });
    if (error) {
      setFormError("Invalid email or password. Please try again.");
      return;
    }
    router.push("/dashboard");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <Input label="Email Address" icon="mail" type="email" placeholder="your@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required wrapperClassName="mb-0" />
      <Input label="Password" icon="lock" type="password" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required wrapperClassName="mb-0" />

      <div className="flex items-center justify-between">
        <label className="flex items-center gap-2.5 cursor-pointer">
          <button
            type="button"
            onClick={() => setKeepLoggedIn(!keepLoggedIn)}
            className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 ${keepLoggedIn ? "bg-cerulean-500 border-cerulean-500" : "border-alice-blue-300 bg-white"}`}
          >
            {keepLoggedIn && <span className="text-white text-xs font-bold">✓</span>}
          </button>
          <span className="text-sm text-alice-blue-600">Keep me logged in</span>
        </label>
        <Link href="/forgot-password" className="text-sm text-cerulean-500 hover:underline">
          Forgot password?
        </Link>
      </div>

      {formError && (
        <div className="bg-red-50 border border-red-200 rounded-xl p-3 text-sm text-red-600 flex items-center gap-2">
          <span className="material-symbols-outlined text-base">error</span>
          {formError}
        </div>
      )}

      <Button type="submit" variant="primary" size="full" loading={loading}>
        <span className="material-symbols-outlined text-lg">login</span>
        Sign In
      </Button>

      <p className="text-center text-sm text-alice-blue-600">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="text-cerulean-500 font-semibold hover:underline">
          Sign up for free
        </Link>
      </p>
    </form>
  );
}
