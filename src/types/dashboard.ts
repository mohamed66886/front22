export interface DashboardStats {
  totalUsers: number;
  totalFaculties: number;
  totalUniversities: number;
  totalPrograms: number;
  recentActivities: Activity[];
  qualityMetrics: QualityMetric[];
  // Added for dashboard page compatibility
  RecentNotifications: Notification[];
  CompletedTasks: number;
  MyTasks: number;
  UnreadNotifications: number;
  PendingTasks: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'error' | 'success' | 'urgent' | 'meeting' | 'report' | string;
  date: string;
  read: boolean;
  // Added for dashboard page compatibility
  notification_id: number;
  User?: {
    name: string;
    role: string;
  };
}

export interface Activity {
  id: number;
  description: string;
  timestamp: string;
  user: string;
}

export interface QualityMetric {
  name: string;
  value: number;
  target: number;
  status: 'good' | 'warning' | 'critical';
}
