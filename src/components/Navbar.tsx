import { motion, useScroll, useTransform } from 'framer-motion';
import { Code2, Menu, X, User as UserIcon } from 'lucide-react';
import { useState } from 'react';
import { User } from '@supabase/supabase-js';

interface NavbarProps {
  onAuthClick: () => void;
  onAdminClick: () => void;
  user: User | null;
  profile: { full_name: string; is_admin: boolean } | null;
}

export function Navbar({ onAuthClick, onAdminClick, user, profile }: NavbarProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { scrollY } = useScroll();

  const backgroundColor = useTransform(
    scrollY,
    [0, 100],
    ['rgba(15, 23, 42, 0)', 'rgba(15, 23, 42, 0.8)']
  );

  const backdropBlur = useTransform(
    scrollY,
    [0, 100],
    ['blur(0px)', 'blur(12px)']
  );

  return (
    <motion.nav
      style={{ backgroundColor, backdropFilter: backdropBlur }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-white/10"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <div className="p-2 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 shadow-lg shadow-cyan-500/50">
              <Code2 className="w-6 h-6 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              DevGeeks
            </span>
          </motion.div>

          <div className="hidden md:flex items-center space-x-6">
            <NavLink href="#home">Home</NavLink>
            <NavLink href="#explore">Explore</NavLink>
            {user ? (
              <>
                <div className="flex items-center space-x-2 px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
                  <UserIcon className="w-4 h-4 text-cyan-400" />
                  <span className="text-sm text-gray-300">{profile?.full_name || 'User'}</span>
                </div>
                {profile?.is_admin && (
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={onAdminClick}
                    className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
                  >
                    Admin
                  </motion.button>
                )}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={onAuthClick}
                  className="px-6 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all shadow-lg"
                >
                  Sign Out
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={onAuthClick}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium shadow-lg shadow-cyan-500/50 hover:shadow-cyan-500/70 transition-all"
              >
                Sign In
              </motion.button>
            )}
          </div>

          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-white/10 backdrop-blur-md border border-white/20"
          >
            {isMenuOpen ? <X className="w-6 h-6 text-white" /> : <Menu className="w-6 h-6 text-white" />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="md:hidden bg-slate-900/95 backdrop-blur-lg border-t border-white/10"
        >
          <div className="px-4 py-4 space-y-3">
            <MobileNavLink href="#home" onClick={() => setIsMenuOpen(false)}>Home</MobileNavLink>
            <MobileNavLink href="#explore" onClick={() => setIsMenuOpen(false)}>Explore</MobileNavLink>
            {user ? (
              <>
                <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-gray-300 text-center">
                  {profile?.full_name || 'User'}
                </div>
                {profile?.is_admin && (
                  <button
                    onClick={() => {
                      setIsMenuOpen(false);
                      onAdminClick();
                    }}
                    className="w-full px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
                  >
                    Admin Dashboard
                  </button>
                )}
                <button
                  onClick={() => {
                    setIsMenuOpen(false);
                    onAuthClick();
                  }}
                  className="w-full px-6 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 transition-all"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  onAuthClick();
                }}
                className="w-full px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium"
              >
                Sign In
              </button>
            )}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.05 }}
      className="text-gray-300 hover:text-white transition-colors"
    >
      {children}
    </motion.a>
  );
}

function MobileNavLink({ href, onClick, children }: { href: string; onClick: () => void; children: React.ReactNode }) {
  return (
    <a
      href={href}
      onClick={onClick}
      className="block px-4 py-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-all"
    >
      {children}
    </a>
  );
}
