import Link from "next/link";
import SignupForm from "@/components/auth/SignupForm";

export const metadata = {
  title: "Create Account | Period-App",
};

export default function SignupPage() {
  return (
    <div className="w-full max-w-lg animate-slide-up">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cerulean-500 to-cerulean-700 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-2xl">water_drop</span>
        </div>
        <span className="font-display font-bold text-3xl text-cerulean-800">Period-App</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-alice-blue-100">
        <div className="bg-linear-to-r from-cerulean-500 to-cerulean-700 p-8 text-center text-white">
          <h1 className="font-display text-2xl font-bold mb-1.5">Create Your Account</h1>
          <p className="text-cerulean-200 text-sm">Join our wellness community today 🌸</p>
        </div>

        <div className="p-8">
          <SignupForm />
        </div>
      </div>

      <div className="text-center mt-6 text-xs text-alice-blue-500">
        <p>© {new Date().getFullYear()} Period-App Health. All rights reserved.</p>
      </div>
    </div>
  );
}
