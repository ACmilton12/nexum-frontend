import { API_BASE_URL } from '../utils/constants';
import type { PaginatedNotifications, UnreadCountResponse } from '../types/notification.types';

const getToken = () => localStorage.getItem('token') || sessionStorage.getItem('token');

const handleUnauthorized = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  sessionStorage.removeItem('token');
  sessionStorage.removeItem('user');
  window.location.href = '/login';
};

export const getNotifications = async (perPage = 20): Promise<PaginatedNotifications> => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_BASE_URL}/notifications?per_page=${perPage}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    return { data: [], meta: { current_page: 1, per_page: perPage, total: 0 } };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error fetching notifications');
  }

  return data;
};

export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_BASE_URL}/notifications/unread-count`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    return { unread_count: 0 };
  }

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Error fetching unread count');
  }

  return data;
};

export const markAsRead = async (id: string): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_BASE_URL}/notifications/${id}/read`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    return;
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error marking notification as read');
  }
};

export const markAllAsRead = async (): Promise<void> => {
  const token = getToken();
  if (!token) throw new Error('No token found');

  const response = await fetch(`${API_BASE_URL}/notifications/read-all`, {
    method: 'PATCH',
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (response.status === 401) {
    handleUnauthorized();
    return;
  }

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.message || 'Error marking all notifications as read');
  }
};
