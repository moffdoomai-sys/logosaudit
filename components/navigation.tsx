// @ts-nocheck
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  Shield, 
  Settings, 
  BarChart3, 
  FileText, 
  Plus,
  LayoutDashboard,
  User
} from 'lucide-react';
import { useAuditManager } from '@/hooks/use-audit-manager';
import { Badge } from '@/components/ui/badge';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'New Audit', href: '/new-audit', icon: Plus },
  { name: 'Reports', href: '/reports', icon: BarChart3 },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export default function Navigation() {
  const pathname = usePathname();
  const { audits, currentUser } = useAuditManager();
  
  const activeAudits = audits?.filter(audit => audit.status === 'IN_PROGRESS') || [];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200/50 bg-white/80 backdrop-blur-lg supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex h-20 items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center shadow-lg">
                  <Shield className="h-6 w-6 text-white" />
                </div>
                <div className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-gradient-to-r from-emerald-400 to-teal-500"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold logos-heading bg-gradient-to-r from-violet-600 to-purple-600 bg-clip-text text-transparent">
                  LogosAudit
                </h1>
                <p className="text-xs logos-text-muted">Multi-Audit Management</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <nav className="flex items-center space-x-1">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href || 
                  (item.href === '/dashboard' && (pathname === '/' || pathname === '/dashboard'));
                
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      'flex items-center space-x-2 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 relative',
                      isActive
                        ? 'bg-violet-100/70 text-violet-700 shadow-sm'
                        : 'text-gray-600 hover:text-violet-700 hover:bg-violet-50/50'
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    <span className="hidden sm:inline">{item.name}</span>
                    {item.name === 'Dashboard' && activeAudits.length > 0 && (
                      <Badge variant="secondary" className="ml-1 h-5 text-xs">
                        {activeAudits.length}
                      </Badge>
                    )}
                  </Link>
                );
              })}
            </nav>
            
            {currentUser && (
              <div className="flex items-center space-x-2 text-sm text-gray-600">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">{currentUser.name || 'User'}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
