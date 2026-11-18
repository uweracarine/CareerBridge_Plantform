import { LayoutDashboard, User, BookOpen, Briefcase, Star, FileText, Search, Bookmark, ClipboardList, Bell, MessageSquare, Settings, CalendarCheck2 } from 'lucide-react';

export const STUDENT_NAV = [
  { to: '/student/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { divider: true, label: 'Profile' },
  { to: '/student/profile', label: 'My Profile', icon: User },
  { to: '/student/education', label: 'Education', icon: BookOpen },
  { to: '/student/experience', label: 'Experience', icon: Briefcase },
  { to: '/student/skills', label: 'Skills', icon: Star },
  { to: '/student/cvs', label: 'My CVs', icon: FileText },
  { divider: true, label: 'Opportunities' },
  { to: '/opportunities', label: 'Browse Jobs', icon: Search },
  { to: '/student/saved', label: 'Saved Jobs', icon: Bookmark },
  { divider: true, label: 'Applications' },
  { to: '/student/applications', label: 'My Applications', icon: ClipboardList },
  { divider: true, label: 'Account' },
  { to: '/student/notifications', label: 'Notifications', icon: Bell },
  { to: '/student/messages', label: 'Messages', icon: MessageSquare },
  { to: '/student/profile', label: 'Settings', icon: Settings },
];

export const EMPLOYER_NAV = [
  { to: '/employer/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/employer/applications', label: 'Candidates', icon: User },
  { to: '/employer/opportunities', label: 'Jobs', icon: Briefcase },
  { to: '/employer/schedule', label: 'Schedule', icon: CalendarCheck2 },
  { divider: true, label: 'Account' },
  { to: '/employer/messages', label: 'Messages', icon: MessageSquare },
  { to: '/employer/notifications', label: 'Notifications', icon: Bell },
  { to: '/employer/profile', label: 'Setting', icon: Settings },
];

export const ADMIN_NAV = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { divider: true, label: 'Management' },
  { to: '/admin/users', label: 'Users', icon: User },
  { to: '/admin/employers', label: 'Employers', icon: Briefcase },
  { to: '/admin/verification', label: 'Verification Requests', icon: Star },
  { divider: true, label: 'Content' },
  { to: '/admin/opportunities', label: 'Opportunities', icon: Search },
  { to: '/admin/categories', label: 'Categories', icon: BookOpen },
  { divider: true, label: 'Reports' },
  { to: '/admin/analytics', label: 'Analytics', icon: ClipboardList },
  { to: '/admin/activity-logs', label: 'Activity Logs', icon: FileText },
  { divider: true, label: 'System' },
  { to: '/admin/admins', label: 'Admin Accounts', icon: Settings },
];
