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

// Global singleton para persistir entre requests
let globalLogs: NotificationLog[] = [];

class NotificationLogger {
  private static get logs(): NotificationLog[] {
    return globalLogs;
  }

  private static set logs(value: NotificationLog[]) {
    globalLogs = value;
  }

  static addLog(log: Omit<NotificationLog, 'id' | 'timestamp'>): void {
    const newLog: NotificationLog = {
      ...log,
      id: `LOG_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date()
    };

    this.logs.unshift(newLog); // Add to beginning

    // Keep only last 100 logs
    if (this.logs.length > 100) {
      this.logs = this.logs.slice(0, 100);
    }

    logger.info(`📊 Notification log added: ${log.event} for order ${log.orderId}`);
  }

  static getLogs(limit: number = 50): NotificationLog[] {
    return this.logs.slice(0, limit);
  }

  static getLogsByEvent(event: string, limit: number = 20): NotificationLog[] {
    return this.logs.filter(log => log.event === event).slice(0, limit);
  }

  static getLogsByOrder(orderId: string): NotificationLog[] {
    return this.logs.filter(log => log.orderId === orderId);
  }

  static getStats(): {
    totalNotifications: number;
    successfulEmails: number;
    failedEmails: number;
    successRate: number;
    eventBreakdown: Record<string, number>;
  } {
    const total = this.logs.length;
    const successful = this.logs.filter(log => log.clientSent || log.companySent).length;
    const failed = total - successful;

    const eventBreakdown: Record<string, number> = {};
    this.logs.forEach(log => {
      eventBreakdown[log.event] = (eventBreakdown[log.event] || 0) + 1;
    });

    return {
      totalNotifications: total,
      successfulEmails: this.logs.reduce((acc, log) => {
        return acc + (log.clientSent ? 1 : 0) + (log.companySent ? 1 : 0);
      }, 0),
      failedEmails: this.logs.reduce((acc, log) => {
        return acc + (!log.clientSent ? 1 : 0) + (!log.companySent ? 1 : 0);
      }, 0),
      successRate: total > 0 ? Math.round((successful / total) * 100) : 0,
      eventBreakdown
    };
  }

  static clearLogs(): void {
    this.logs = [];
    logger.info('📊 All notification logs cleared');
  }
}

export default NotificationLogger;