import { useEffect, useState } from 'react';
import { User, Edit, Ban, Search } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { ADMIN_NAV } from '../../constants/nav.js';
import { adminService } from '../../services/api.js';
import { PageLoader, Badge } from '../../components/ui.jsx';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  useEffect(() => {
    let active = true;
    adminService.getUsers({ q: query || undefined, role: roleFilter || undefined })
      .then((res) => {
        if (!active) return;
        const data = Array.isArray(res?.data) ? res.data : (res?.data?.data || []);
        setUsers(data);
      })
      .catch(() => { if (active) setUsers([]); })
      .finally(() => { if (active) setLoading(false); });
    return () => { active = false; };
  }, [query, roleFilter]);

  const handleStatus = (id, status) => {
    if (!window.confirm(`Mark user as ${status}?`)) return;
    adminService.updateUserStatus(id, status)
      .then(() => {
        setUsers(users.map(u => u.id === id ? { ...u, accountStatus: status } : u));
      })
      .catch(() => alert('Failed to update user status.'));
  };

  if (loading) return <DashboardLayout navItems={ADMIN_NAV} title="Users"><PageLoader /></DashboardLayout>;

  return (
    <DashboardLayout navItems={ADMIN_NAV} title="Users">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-xl font-semibold text-text">Users</h2>
          <div className="flex gap-2 w-full sm:w-auto">
            <input
              type="text"
              placeholder="Search users..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="input-field flex-1"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="input-field"
            >
              <option value="">All Roles</option>
              <option value="student">Student</option>
              <option value="employer">Employer</option>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-border overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-background border-b border-border">
                <th className="px-6 py-3 text-xs font-medium text-text-light">Name</th>
                <th className="px-6 py-3 text-xs font-medium text-text-light">Email</th>
                <th className="px-6 py-3 text-xs font-medium text-text-light">Role</th>
                <th className="px-6 py-3 text-xs font-medium text-text-light">Status</th>
                <th className="px-6 py-3 text-xs font-medium text-text-light">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {(users || []).length ? (
                users.map((user) => (
                  <tr key={user.id} className="hover:bg-background/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary bg-opacity-10 text-primary flex items-center justify-center text-xs font-semibold">
                          {user.fullName ? user.fullName.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-text">{user.fullName || 'Unknown'}</p>
                          <p className="text-xs text-text-light">{user.email || '—'}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-text-light">{user.email || '—'}</td>
                    <td className="px-6 py-4">
                      <Badge status={user.role} label={user.role ? user.role.replace('_', ' ') : '—'} />
                    </td>
                    <td className="px-6 py-4">
                      <Badge status={user.accountStatus || 'active'} label={user.accountStatus ? user.accountStatus.replace('_', ' ') : 'Active'} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {user.accountStatus !== 'active' && (
                          <button
                            onClick={() => handleStatus(user.id, 'active')}
                            className="text-xs bg-green-100 text-green-700 px-3 py-1.5 rounded hover:bg-green-200 transition-colors"
                          >
                            Activate
                          </button>
                        )}
                        {user.accountStatus !== 'suspended' && (
                          <button
                            onClick={() => handleStatus(user.id, 'suspended')}
                            className="text-xs bg-red-100 text-red-700 px-3 py-1.5 rounded hover:bg-red-200 transition-colors"
                          >
                            Suspend
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-text-light">
                    No users found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </DashboardLayout>
  );
}
