import { Outlet, Link } from "react-router";
import { Menu, ShoppingBag, Star, BarChart3 } from "lucide-react";

export function Layout() {

  return (
    <div className="min-h-screen bg-neutral-50 font-sans text-neutral-900">
      {/* Navigation */}
      <nav className="sticky top-0 z-50 border-b border-neutral-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:px-6">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-neutral-900">B&Y <span className="text-blue-600">k-link</span></span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-neutral-100 rounded-full transition-colors md:hidden text-[#0C3F80]"><Menu size={20} /></button>
            <div className="hidden md:flex items-center gap-2 border-l border-neutral-200 pl-4 ml-2">
              <Link to="/brands" className="flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-lg transition-colors text-sm">
                <BarChart3 size={18} className="text-[#0C3F80]" />
                <span className="font-medium text-xs">For Brands</span>
              </Link>
              <Link to="/b2b" className="flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-lg transition-colors text-sm">
                <ShoppingBag size={18} className="text-[#0C3F80]" />
                <span className="font-medium text-xs">For Sellers</span>
              </Link>
              <Link to="/creator" className="flex items-center gap-1.5 p-2 hover:bg-neutral-100 rounded-lg transition-colors text-sm">
                <Star size={18} className="text-[#0C3F80]" />
                <span className="font-medium text-xs">For Creators</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      <main>
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="border-t border-neutral-200 bg-white py-12">
        <div className="mx-auto max-w-7xl px-4 md:px-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
            <div className="col-span-1 md:col-span-2">
              <span className="text-2xl font-black tracking-tight mb-4 block opacity-80">B&Y <span className="text-blue-600">k-link</span></span>
              <p className="max-w-md text-neutral-500 text-sm leading-relaxed">
                B&Y k-link is Korea's leading trend incubator. We discover hidden gems in Seoul and bring them to the forefront of the Thai market through data-driven curation and influencer validation.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Connect</h4>
              <ul className="space-y-2 text-sm text-neutral-600">
                <li><a href="#" className="hover:text-blue-600">About Us</a></li>
                <li><a href="#" className="hover:text-blue-600">B2B Partners</a></li>
                <li><a href="#" className="hover:text-blue-600">Creator Program</a></li>
                <li><a href="#" className="hover:text-blue-600">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-sm mb-4">Seoul HQ</h4>
              <p className="text-sm text-neutral-500">
                Seongsu-dong, Seoul, South Korea<br />
                Bangkok Branch, Thailand
              </p>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-neutral-100 text-center text-xs text-neutral-400">
            © 2026 B&Y k-link co., ltd. All rights reserved. First Choice, Next Trend.
          </div>
        </div>
      </footer>
    </div>
  );
}
