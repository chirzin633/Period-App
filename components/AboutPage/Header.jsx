import Link from "next/link";

export default function Header() {
  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-gray-200 px-4 py-3 sm:px-10">
      <div className="flex items-center gap-4 text-slate-900">
        <div className="size-8 text-terracotta">
          <svg fill="currentColor" viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <g clipPath="url(#clip0_6_319)">
              <path d="M8.57829 8.57829C5.52816 11.6284 3.451 15.5145 2.60947 19.7452C1.76794 23.9758 2.19984 28.361 3.85056 32.3462C5.50128 36.3314 8.29667 39.7376 11.8832 42.134C15.4698 44.5305 19.6865 45.8096 24 45.8096C28.3135 45.8096 32.5302 44.5305 36.1168 42.134C39.7033 39.7375 42.4987 36.3314 44.1494 32.3462C45.8002 28.361 46.2321 23.9758 45.3905 19.7452C44.549 15.5145 42.4718 11.6284 39.4217 8.57829L24 24L8.57829 8.57829Z"></path>
            </g>
            <defs>
              <clipPath id="clip0_6_319">
                <rect fill="white" height="48" width="48"></rect>
              </clipPath>
            </defs>
          </svg>
        </div>
        <h2 className="text-xl font-bold leading-tight tracking-[-0.015rem]">Femwell</h2>
      </div>

      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          <Link className="text-subtext-gray hover:text-terracotta text-sm font-medium leading-normal" href="#">
            Home
          </Link>
          <Link className="text-subtext-gray hover:text-terracotta text-sm font-medium leading-normal" href="#">
            Calendar
          </Link>
          <Link className="text-subtext-gray hover:text-terracotta text-sm font-medium leading-normal" href="#">
            About
          </Link>
        </div>
        <button className="min-w-[84px] max-w-[480px] cursor-pointer items-center justify-center overflow-hidden rounded-full h-10 px-6 bg-terracotta text-white text-sm font-bold leading-normal tracking-[0.015rem] shadow-soft hover:opacity-90 transition-colors">
          <span>Sign Up</span>
        </button>
      </div>
      <div className="md:hidden">
        <button className="text-text-gray">
          <span className="material-symbols-outlined">menu</span>
        </button>
      </div>
    </header>
  );
}
