import { useEffect, useMemo, useState } from 'react';
import { Bell, CheckCheck, Clock3, Trash2 } from 'lucide-react';
import DashboardLayout from '../../layouts/DashboardLayout.jsx';
import { STUDENT_NAV, EMPLOYER_NAV } from '../../constants/nav.js';
import { PageLoader, EmptyState, Badge } from '../../components/ui.jsx';
import { notificationService } from '../../services/api.js';
import { useAuth } from '../../context/AuthContext.jsx';

export default function NotificationsPage() {
  const { user } = useAuth();
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const navItems = useMemo(() => {
    if (user?.role === 'employer') return EMPLOYER_NAV;
    return STUDENT_NAV;
  }, [user?.role]);

  const loadNotifications = async () => {
    try {
      const response = await notificationService.getNotifications();
      const data = Array.isArray(response?.data) ? response.data : Array.isArray(response) ? response : [];
      setItems(data);
    } catch (error) {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const handleMarkAllRead = async () => {
    try {
      await notificationService.markAllAsRead();
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    } catch (error) {
      setItems((prev) => prev.map((item) => ({ ...item, isRead: true })));
    }
  };

  const handleDelete = async (id) => {
    try {
      await notificationService.delete(id);
      setItems((prev) => prev.filter((item) => item.id !== id));
    } catch (error) {
      setItems((prev) => prev.filter((item) => item.id !== id));
    }
  };

  if (loading) {
    return (
      <DashboardLayout navItems={navItems} title="Notifications">
        <PageLoader />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout navItems={navItems} title="Notifications">
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-text">Your alerts</h2>
            <p className="text-sm text-text-light">Stay updated on messages, applications, and employer activity.</p>
          </div>
          <button type="button" onClick={handleMarkAllRead} className="btn-secondary text-sm py-2 px-4 flex items-center gap-2">
            <CheckCheck size={14} /> Mark all read
          </button>
        </div>

        {items.length === 0 ? (
          <EmptyState icon={Bell} title="No notifications" description="You’re all caught up for now." />
        ) : (
          <div className="space-y-3">
            {items.map((item) => (
              <div key={item.id} className={`border rounded-xl p-4 ${item.isRead ? 'border-border bg-white' : 'border-primary/30 bg-primary/5'}`}>
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-text">{item.title || 'Notification'}</p>
                      {!item.isRead && <Badge status="pending" label="New" />}
                    </div>
                    <p className="text-sm text-text-light">{item.message || 'No message available.'}</p>
                    <div className="mt-2 flex items-center gap-2 text-xs text-text-light">
                      <Clock3 size={12} />
                      {item.createdAt ? new Date(item.createdAt).toLocaleString() : 'Just now'}
                    </div>
                  </div>
                  <button type="button" onClick={() => handleDelete(item.id)} className="p-2 rounded-lg hover:bg-background text-text-light" aria-label="Delete notification">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
