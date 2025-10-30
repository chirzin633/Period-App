import Link from "next/link";

export default function Footer() {
  return (
    <footer className="mt-auto border-t border-solid border-gray-200 px-4 py-6 sm:px-10">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-subtext-gray">
        <p>&copy; Femwell. All rights reserved</p>
        <div className="flex gap-6">
          <Link className="hover:text-terracotta" href="#">
            Privacy Policy
          </Link>
          <Link className="hover:text-terracotta" href="#">
            Terms of Service
          </Link>
          <Link className="hover:text-terracotta" href="#">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  );
}
