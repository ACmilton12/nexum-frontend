import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Bell, Check, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { 
  getNotifications, 
  getUnreadCount, 
  markAsRead, 
  markAllAsRead 
} from '../../services/notifications.service';
import type { Notification } from '../../types/notification.types';

const NotificationBell = () => {
  const { t } = useTranslation();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const fetchUnreadCount = async () => {
    try {
      const data = await getUnreadCount();
      setUnreadCount(data.unread_count);
    } catch (error) {
      console.error('Error fetching unread count:', error);
    }
  };

  const fetchNotifications = async () => {
    setIsLoading(true);
    try {
      const data = await getNotifications(10);
      setNotifications(data.data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUnreadCount();
    
    // Polling cada 60 segundos
    const interval = setInterval(fetchUnreadCount, 60000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (isOpen) {
      fetchNotifications();
    }
  }, [isOpen]);

  // Cerrar el dropdown al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleMarkAsRead = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    try {
      await markAsRead(id);
      setNotifications(prev => 
        prev.map(notif => 
          notif.id === id 
            ? { ...notif, read_at: new Date().toISOString() }
            : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
      setNotifications(prev => 
        prev.map(notif => ({ ...notif, read_at: new Date().toISOString() }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  const getMappedAction = (url: string | null) => {
    if (!url) return { pathname: '#' };
    
    if (url.includes('/admin/skill-suggestions') || url.includes('/admin/skill_suggestions')) {
      return { pathname: '/admin', state: { modal: 'skills' } };
    }
    if (url.includes('/admin/category-suggestions') || url.includes('/admin/category_suggestions')) {
      return { pathname: '/admin', state: { modal: 'categories' } };
    }
    if (url.includes('/portfolio/skills')) {
      return { pathname: '/profile/habilidades' };
    }
    if (url.includes('/portfolio/stats')) {
      return { pathname: '/visitantes' };
    }
    if (url.includes('/projects/')) {
      return { pathname: '/proyectos' };
    }
    return { pathname: url };
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-white/80 hover:text-white transition-colors rounded-full hover:bg-white/10"
        aria-label="Notificaciones"
      >
        <Bell size={22} />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-600 rounded-full transform translate-x-1/4 -translate-y-1/4">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white dark:bg-slate-800 rounded-lg shadow-xl border border-gray-200 dark:border-slate-700 z-50 overflow-hidden">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-slate-700">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200">
              {t('notifications_dropdown.title', 'Notificaciones')}
            </h3>
            {unreadCount > 0 && (
              <button
                onClick={handleMarkAllAsRead}
                className="text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors"
              >
                {t('notifications_dropdown.mark_all_read', 'Marcar todas como leídas')}
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto">
            {isLoading ? (
              <div className="p-4 text-center text-sm text-gray-500">
                {t('notifications_dropdown.loading', 'Cargando...')}
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-sm text-gray-500 flex flex-col items-center">
                <Bell size={32} className="text-gray-300 mb-2" />
                {t('notifications_dropdown.empty', 'No tienes notificaciones nuevas')}
              </div>
            ) : (
              <ul className="divide-y divide-gray-100 dark:divide-slate-700">
                {notifications.map((notif) => (
                  <li 
                    key={notif.id} 
                    className={`p-4 transition-colors ${
                      notif.read_at 
                        ? 'bg-white dark:bg-slate-800' 
                        : 'bg-blue-50 dark:bg-blue-900/20'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-medium ${notif.read_at ? 'text-gray-700 dark:text-gray-300' : 'text-gray-900 dark:text-white'}`}>
                          {notif.title}
                        </p>
                        <p className={`text-sm mt-1 ${notif.read_at ? 'text-gray-500 dark:text-gray-400' : 'text-gray-700 dark:text-gray-300'}`}>
                          {notif.body}
                        </p>
                        <p className="text-xs text-gray-400 dark:text-gray-500 mt-2">
                          {formatDate(notif.created_at)}
                        </p>
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        {!notif.read_at && (
                          <button 
                            onClick={(e) => handleMarkAsRead(e, notif.id)}
                            className="p-1.5 text-blue-600 hover:bg-blue-100 rounded-full transition-colors tooltip"
                            title={t('notifications_dropdown.mark_read', 'Marcar como leída')}
                          >
                            <Check size={16} />
                          </button>
                        )}
                        {notif.action_url && (() => {
                          const action = getMappedAction(notif.action_url);
                          return (
                            <Link 
                              to={action.pathname}
                              state={action.state}
                              className="p-1.5 text-gray-500 hover:bg-gray-100 rounded-full transition-colors"
                              title={t('notifications_dropdown.view', 'Ver detalles')}
                              onClick={(e) => {
                                e.stopPropagation();
                                setIsOpen(false);
                              }}
                            >
                              <ExternalLink size={16} />
                            </Link>
                          );
                        })()}
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
