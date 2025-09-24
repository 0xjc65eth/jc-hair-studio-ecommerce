import { writeFileSync, readFileSync, existsSync } from 'fs';
import { join } from 'path';
import logger from '@/lib/logger';

export interface NotificationLog {
  id: string;
  timestamp: Date;
  event: string;
  orderId: string;
  customerEmail: string;
  clientEmail: string;
  companyEmail: string;
  clientSent: boolean;
  companySent: boolean;
  emailData?: any;
  error?: string;
}

const LOGS_FILE = join(process.cwd(), 'notification-logs.json');

class PersistentNotificationLogger {

  private static loadLogs(): NotificationLog[] {
    try {
      if (existsSync(LOGS_FILE)) {
        const data = readFileSync(LOGS_FILE, 'utf8');
        const parsed = JSON.parse(data);
        return Array.isArray(parsed) ? parsed : [];
      }
    } catch (error) {
      logger.error('Error loading logs:', error);
    }
    return [];
  }

  private static saveLogs(logs: NotificationLog[]): void {
    try {
      writeFileSync(LOGS_FILE, JSON.stringify(logs, null, 2));
    } catch (error) {
      logger.error('Error saving logs:', error);
    }
  }

  static addLog(log: Omit<NotificationLog, 'id' | 'timestamp'>): void {
    const logs = this.loadLogs();

    const newLog: NotificationLog = {
      ...log,
      id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    logs.unshift(newLog); // Add to beginning

    // Keep only last 100 logs
    if (logs.length > 100) {
      logs.splice(100);
    }

    this.saveLogs(logs);
    logger.info(`📊 Notification log saved: ${log.event} for order ${log.orderId}`);
  }

  static getLogs(limit: number = 50): NotificationLog[] {
    const logs = this.loadLogs();
    return logs.slice(0, limit);
  }

  static getLogsByEvent(event: string, limit: number = 20): NotificationLog[] {
    const logs = this.loadLogs();
    return logs.filter(log => log.event === event).slice(0, limit);
  }

  static getLogsByOrder(orderId: string): NotificationLog[] {
    const logs = this.loadLogs();
    return logs.filter(log => log.orderId === orderId);
  }

  static getStats(): {
    totalNotifications: number;
    successfulEmails: number;
    failedEmails: number;
    successRate: number;
    eventBreakdown: Record<string, number>;
    recentActivity: NotificationLog[];
  } {
    const logs = this.loadLogs();
    const total = logs.length;
    const successful = logs.filter(log => log.clientSent && log.companySent).length;
    const failed = total - successful;

    const eventBreakdown: Record<string, number> = {};
    logs.forEach(log => {
      eventBreakdown[log.event] = (eventBreakdown[log.event] || 0) + 1;
    });

    return {
      totalNotifications: total,
      successfulEmails: logs.reduce((acc, log) => {
        return acc + (log.clientSent ? 1 : 0) + (log.companySent ? 1 : 0);
      }, 0),
      failedEmails: logs.reduce((acc, log) => {
        return acc + (!log.clientSent ? 1 : 0) + (!log.companySent ? 1 : 0);
      }, 0),
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      eventBreakdown,
      recentActivity: logs.slice(0, 10)
    };
  }

  static clearLogs(): void {
    try {
      this.saveLogs([]);
      logger.info('📊 All notification logs cleared');
    } catch (error) {
      logger.error('Error clearing logs:', error);
    }
  }

  // Get summary for dashboard
  static getDashboardSummary(): {
    todayEmails: number;
    todaySuccess: number;
    todayFailed: number;
    topEvents: Array<{ event: string; count: number }>;
  } {
    const logs = this.loadLogs();
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const todayLogs = logs.filter(log => {
      const logDate = new Date(log.timestamp);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime();
    });

    const todaySuccess = todayLogs.filter(log => log.clientSent && log.companySent).length;
    const todayFailed = todayLogs.length - todaySuccess;

    const eventBreakdown: Record<string, number> = {};
    logs.slice(0, 50).forEach(log => { // Last 50 logs
      eventBreakdown[log.event] = (eventBreakdown[log.event] || 0) + 1;
    });

    const topEvents = Object.entries(eventBreakdown)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([event, count]) => ({ event, count }));

    return {
      todayEmails: todayLogs.reduce((acc, log) => {
        return acc + (log.clientSent ? 1 : 0) + (log.companySent ? 1 : 0);
      }, 0),
      todaySuccess: todaySuccess * 2, // Client + Company
      todayFailed: todayFailed * 2,
      topEvents
    };
  }
}

export default PersistentNotificationLogger;