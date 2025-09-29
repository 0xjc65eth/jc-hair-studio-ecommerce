'use client';

import React from 'react';
import {
  Package,
  Truck,
  MapPin,
  CheckCircle,
  Clock,
  AlertTriangle,
  ArrowRight,
  Calendar,
  User,
  Building,
  Plane,
  Ship,
  Home
} from 'lucide-react';

interface TrackingEvent {
  status: string;
  description: string;
  location?: string;
  timestamp: Date;
  carrier?: string;
  notes?: string;
}

interface TrackingTimelineProps {
  events: TrackingEvent[];
  currentStatus: string;
  trackingNumber: string;
  carrier: string;
  estimatedDelivery?: Date;
  actualDelivery?: Date;
  compact?: boolean;
}

export const TrackingTimeline: React.FC<TrackingTimelineProps> = ({
  events,
  currentStatus,
  trackingNumber,
  carrier,
  estimatedDelivery,
  actualDelivery,
  compact = false
}) => {
  const getStatusIcon = (status: string, isCompleted: boolean) => {
    const iconProps = {
      className: `w-5 h-5 ${isCompleted ? 'text-white' : 'text-gray-400'}`,
    };

    switch (status.toLowerCase()) {
      case 'label_created':
      case 'created':
        return <Package {...iconProps} />;
      case 'picked_up':
      case 'collected':
        return <Truck {...iconProps} />;
      case 'shipped':
      case 'dispatched':
        return <Plane {...iconProps} />;
      case 'in_transit':
      case 'transit':
        return <ArrowRight {...iconProps} />;
      case 'out_for_delivery':
        return <Truck {...iconProps} />;
      case 'delivered':
        return <Home {...iconProps} />;
      case 'delivery_failed':
      case 'failed':
        return <AlertTriangle {...iconProps} />;
      case 'returned':
        return <Package {...iconProps} />;
      default:
        return <MapPin {...iconProps} />;
    }
  };

  const getStatusColor = (status: string, isCompleted: boolean) => {
    if (!isCompleted) return 'bg-gray-300';

    switch (status.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500';
      case 'delivery_failed':
      case 'failed':
      case 'returned':
        return 'bg-red-500';
      case 'out_for_delivery':
        return 'bg-orange-500';
      case 'shipped':
      case 'in_transit':
        return 'bg-blue-500';
      default:
        return 'bg-blue-500';
    }
  };

  const getStatusDisplay = (status: string) => {
    const statusMap: { [key: string]: string } = {
      'label_created': 'Label Created',
      'picked_up': 'Picked Up',
      'shipped': 'Shipped',
      'in_transit': 'In Transit',
      'out_for_delivery': 'Out for Delivery',
      'delivered': 'Delivered',
      'delivery_failed': 'Delivery Failed',
      'delivery_attempted': 'Delivery Attempted',
      'returned': 'Returned to Sender',
      'cancelled': 'Cancelled'
    };
    return statusMap[status.toLowerCase()] || status;
  };

  const formatDateTime = (date: Date) => {
    return {
      date: date.toLocaleDateString('pt-PT', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }),
      time: date.toLocaleTimeString('pt-PT', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  // Sort events by timestamp (most recent first for display)
  const sortedEvents = [...events].sort((a, b) =>
    new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
  );

  const isDelivered = currentStatus.toLowerCase() === 'delivered';
  const isFailed = ['delivery_failed', 'returned', 'cancelled'].includes(currentStatus.toLowerCase());

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="p-6 border-b border-gray-200 bg-gray-50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-500" />
              Package Tracking
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              {trackingNumber} • {carrier}
            </p>
          </div>

          {/* Current Status Badge */}
          <div className={`px-3 py-1 rounded-full text-sm font-medium ${
            isDelivered ? 'bg-green-100 text-green-800' :
            isFailed ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {getStatusDisplay(currentStatus)}
          </div>
        </div>

        {/* Delivery Information */}
        {(estimatedDelivery || actualDelivery) && (
          <div className="mt-4 p-3 bg-white rounded-lg border border-gray-200">
            <div className="flex items-center gap-4 text-sm">
              {estimatedDelivery && !actualDelivery && (
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-500" />
                  <span className="text-gray-600">Expected:</span>
                  <span className="font-medium">
                    {formatDateTime(estimatedDelivery).date}
                  </span>
                </div>
              )}
              {actualDelivery && (
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-500" />
                  <span className="text-gray-600">Delivered:</span>
                  <span className="font-medium">
                    {formatDateTime(actualDelivery).date} at {formatDateTime(actualDelivery).time}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Timeline */}
      <div className="p-6">
        {sortedEvents.length === 0 ? (
          <div className="text-center py-8">
            <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No tracking events available yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {sortedEvents.map((event, index) => {
              const isLatest = index === 0;
              const isCompleted = true; // All events in the list have already happened
              const statusColor = getStatusColor(event.status, isCompleted);
              const { date, time } = formatDateTime(new Date(event.timestamp));

              return (
                <div
                  key={index}
                  className={`flex items-start gap-4 ${
                    compact ? 'pb-2' : 'pb-4'
                  } ${index !== sortedEvents.length - 1 ? 'border-b border-gray-100' : ''}`}
                >
                  {/* Timeline Icon */}
                  <div className="flex flex-col items-center">
                    <div
                      className={`
                        w-10 h-10 rounded-full flex items-center justify-center
                        ${statusColor} ${isLatest ? 'ring-4 ring-blue-100' : ''}
                      `}
                    >
                      {getStatusIcon(event.status, isCompleted)}
                    </div>
                    {index !== sortedEvents.length - 1 && !compact && (
                      <div className="w-px h-8 bg-gray-200 mt-2" />
                    )}
                  </div>

                  {/* Event Details */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className={`font-medium ${isLatest ? 'text-blue-900' : 'text-gray-900'}`}>
                          {getStatusDisplay(event.status)}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {event.description}
                        </p>

                        {/* Location */}
                        {event.location && (
                          <div className="flex items-center gap-1 mt-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {event.location}
                            </span>
                          </div>
                        )}

                        {/* Notes */}
                        {event.notes && (
                          <div className="mt-2 p-2 bg-gray-50 rounded-lg border border-gray-200">
                            <p className="text-xs text-gray-600">
                              <strong>Note:</strong> {event.notes}
                            </p>
                          </div>
                        )}

                        {/* Carrier info */}
                        {event.carrier && event.carrier !== carrier && (
                          <div className="flex items-center gap-1 mt-1">
                            <Building className="w-3 h-3 text-gray-400" />
                            <span className="text-xs text-gray-500">
                              {event.carrier}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Timestamp */}
                      <div className="text-right ml-4">
                        <div className={`text-sm font-medium ${isLatest ? 'text-blue-900' : 'text-gray-900'}`}>
                          {date}
                        </div>
                        <div className="text-xs text-gray-500">
                          {time}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 bg-gray-50 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <div className="text-gray-600">
            Last updated: {sortedEvents.length > 0 ?
              formatDateTime(new Date(sortedEvents[0].timestamp)).date + ' at ' +
              formatDateTime(new Date(sortedEvents[0].timestamp)).time :
              'Never'
            }
          </div>
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-400" />
            <span className="text-gray-600">
              {sortedEvents.length} event{sortedEvents.length !== 1 ? 's' : ''}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrackingTimeline;