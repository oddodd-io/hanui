'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { Logo } from './Logo';
import { Container } from '@hanui/react';
import {
  SquareArrowOutUpRight,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Menu,
  X,
} from 'lucide-react';
import { SearchModal } from '@/components/search/SearchModal';
import { useFramework } from '@/components/FrameworkTabs';

export function Header() {
  const { resolvedTheme, setTheme } = useTheme();
  const { framework, setFramework } = useFramework();
  const [mounted, setMounted] = useState(false);
  const [isHidden, setIsHidden] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const prevScrollY = useRef(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const isMainPage = pathname === '/';

  useEffect(() => {
    const timer = setTimeout(() => setMounted(true), 0);
    return () => clearTimeout(timer);
  }, []);

  // Keyboard shortcut for search (Cmd/Ctrl + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.scrollY;
          if (scrollY < 56) {
            setIsHidden(false);
          } else {
            setIsHidden(scrollY > prevScrollY.current);
          }
          prevScrollY.current = scrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Navigation menu items
  const navItems = [
    {
      label: 'Docs',
      href: '/docs/introduction',
      isActive: pathname?.startsWith('/docs'),
    },
    {
      label: 'Components',
      href: '/components',
      isActive:
        pathname?.startsWith('/components') ||
        pathname?.startsWith('/typography') ||
        pathname?.startsWith('/layout'),
    },
    {
      label: 'Blocks',
      href: '/blocks',
      isActive: pathname?.startsWith('/blocks'),
    },
    {
      label: 'Blog',
      href: '/blog',
      isActive: pathname?.startsWith('/blog'),
    },
  ];

  return (
    <>
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
      <header
        id="header"
        // style={{
        //   position: isFixed ? 'fixed' : 'absolute',
        //   top: isFixed ? '-56px' : '0',
        // }}
        className={`fixed top-0 z-50 w-full bg-krds-white supports-[backdrop-filter]:bg-krds-white/95 transition-transform duration-300 ${isHidden ? '-translate-y-full' : 'translate-y-0'} ${isMainPage ? '' : 'border-b border-krds-gray-5'}`}
      >
        {/* Main Header */}
        <Container maxWidth="full" className="h-14 flex items-center gap-4">
          {/* Left: Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0 text-krds-gray-95"
          >
            <Logo />
            <span className="text-lg font-bold font-krona">HANUI</span>
          </Link>

          {/* Center: Main Navigation */}
          <nav className="hidden md:flex items-center space-x-2 text-sm font-medium ml-8">
            {navItems.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                target={item.target}
                rel={item.rel}
                className={`flex items-center gap-2 transition-colors px-4 py-2 whitespace-nowrap ${
                  item.isActive
                    ? 'text-krds-gray-95 bg-krds-gray-5 rounded-md'
                    : 'text-krds-gray-70 hover:text-krds-gray-95'
                }`}
              >
                {item.label}
                {item.icon}
              </Link>
            ))}
          </nav>

          {/* Right: Version + Sponsor + Search + GitHub + Theme */}
          <div className="flex items-center gap-1 lg:gap-2 ml-auto">
            {/* Sponsor - GitHub Sponsors 설정 후 활성화 예정 */}
            {/* <Link
            href="https://github.com/sponsors/hanui-o"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden lg:flex items-center gap-1.5 h-9 px-3 font-medium text-red-600 hover:text-red-700 rounded-md hover:bg-red-50 transition-colors"
          >
            <HeartIcon />
            <span>Sponsor</span>
          </Link> */}

            {/* Framework Selector */}
            <div className="hidden lg:flex items-center h-9 rounded-md border border-krds-gray-20 overflow-hidden">
              <button
                onClick={() => setFramework('react')}
                className={`h-full px-3 text-sm font-medium transition-colors ${
                  framework === 'react'
                    ? 'bg-[#e6f7ff] text-[#0b607f]'
                    : 'text-krds-gray-70 hover:bg-krds-gray-5 bg-white'
                }`}
              >
                React
              </button>
              <button
                onClick={() => setFramework('vue')}
                className={`h-full px-3 text-sm font-medium transition-colors ${
                  framework === 'vue'
                    ? 'bg-emerald-600 text-white'
                    : 'text-krds-gray-70 hover:bg-krds-gray-5'
                }`}
              >
                Vue
              </button>
            </div>

            {/* Version */}
            <button className="hidden lg:flex items-center gap-1.5 h-9 px-3 text-sm font-medium text-krds-gray-70 rounded-md hover:bg-krds-gray-5 transition-colors border border-krds-gray-20 whitespace-nowrap">
              <span>v0.1.0-beta</span>
              <ChevronDown className="w-4 h-4" />
            </button>

            {/* Search */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="flex items-center gap-2 h-9 px-3 text-krds-gray-70 rounded-md hover:bg-krds-gray-5 transition-colors max-w-sm lg:bg-krds-gray-5"
            >
              <Search className="w-5 lg:w-4 h-5 lg:h-4" />
              <span className="hidden xl:inline text-sm">Search...</span>
              <kbd className="hidden xl:inline-flex h-5 select-none items-center gap-1 rounded border border-krds-gray-20 bg-krds-gray-0 px-1.5 font-mono text-xs font-medium text-krds-gray-70 ml-auto">
                <span className="text-xs">⌘</span>K
              </kbd>
            </button>

            {/* GitHub */}
            <Link
              href="https://github.com/hanui-o/hanui"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub 저장소 (새 탭에서 열림)"
              className="flex items-center gap-2 h-9 px-3 text-sm font-medium text-krds-gray-70 rounded-md hover:bg-krds-gray-5 transition-colors"
            >
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="currentColor"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
              </svg>
            </Link>

            {/* Theme Toggle */}
            {mounted && (
              <button
                onClick={() =>
                  setTheme(resolvedTheme === 'dark' ? 'light' : 'dark')
                }
                className="flex items-center justify-center text-lg h-9 w-9 text-krds-gray-70 rounded-md hover:bg-krds-gray-5 transition-colors"
                aria-label="Toggle theme"
              >
                {resolvedTheme === 'dark' ? (
                  <Sun className="w-5 h-5" />
                ) : (
                  <Moon className="w-5 h-5" />
                )}
              </button>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="flex md:hidden items-center justify-center h-9 w-9 text-krds-gray-70 rounded-md hover:bg-krds-gray-5 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5" />
              ) : (
                <Menu className="w-5 h-5" />
              )}
            </button>
          </div>
        </Container>

        {/* Mobile Menu Panel */}
        {isMobileMenuOpen && (
          <div className="md:hidden border-t border-krds-gray-5 bg-krds-white">
            <Container maxWidth="full" className="py-4">
              <nav className="flex flex-col space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    target={item.target}
                    rel={item.rel}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between gap-2 transition-colors px-4 py-3 rounded-md ${
                      item.isActive
                        ? 'text-krds-gray-95 bg-krds-gray-5'
                        : 'text-krds-gray-70 hover:text-krds-gray-95 hover:bg-krds-gray-5'
                    }`}
                  >
                    <span>{item.label}</span>
                    {item.icon}
                  </Link>
                ))}
              </nav>
            </Container>
          </div>
        )}
      </header>
    </>
  );
}
