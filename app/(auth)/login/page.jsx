import Link from "next/link";
import LoginForm from "@/components/auth/LoginForm";

export const metadata = {
  title: "Sign In | Flo-ra",
};

export default function LoginPage() {
  return (
    <div className="w-full max-w-md animate-slide-up">
      {/* Logo */}
      <div className="flex items-center justify-center gap-3 mb-8">
        <div className="w-12 h-12 rounded-2xl bg-linear-to-br from-cerulean-500 to-cerulean-700 flex items-center justify-center shadow-lg">
          <span className="material-symbols-outlined text-white text-2xl">water_drop</span>
        </div>
        <span className="font-display font-bold text-3xl text-cerulean-800">Period-App</span>
      </div>

      {/* Card */}
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-alice-blue-100">
        {/* Header */}
        <div className="bg-linear-to-r from-cerulean-500 to-cerulean-700 p-8 text-center text-white">
          <h1 className="font-display text-2xl font-bold mb-1.5">Welcome Back</h1>
          <p className="text-cerulean-200 text-sm">Sign in to continue tracking your cycle</p>
        </div>

        {/* Form */}
        <div className="p-8">
          <LoginForm />
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-6 text-xs text-alice-blue-500">
        <p>© {new Date().getFullYear()} Period-App Health. All rights reserved.</p>
        <div className="flex justify-center gap-4 mt-2">
          <Link href="/terms" className="hover:text-cerulean-500 transition-colors">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-cerulean-500 transition-colors">
            Privacy
          </Link>
        </div>
      </div>
    </div>
  );
}
