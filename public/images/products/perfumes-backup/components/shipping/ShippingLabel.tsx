'use client';

import React from 'react';
import { QRCodeSVG } from 'qrcode.react';

interface ShippingLabelProps {
  order: any;
  label: {
    orderId: string;
    trackingNumber: string;
    carrier: string;
    service: string;
    qrCode: string;
    barcode: string;
    dimensions: {
      weight: number;
      length: number;
      width: number;
      height: number;
    };
    estimatedDelivery: Date;
  };
  format?: 'pdf' | 'print' | 'preview';
}

export const ShippingLabel: React.FC<ShippingLabelProps> = ({
  order,
  label,
  format = 'preview'
}) => {
  const isPrintFormat = format === 'print' || format === 'pdf';

  return (
    <div
      className={`
        bg-white border border-gray-300 font-mono text-sm
        ${isPrintFormat ? 'w-[4in] h-[6in] p-2' : 'w-full max-w-sm p-4 rounded-lg shadow-lg'}
      `}
      style={isPrintFormat ? {
        width: '288px',  // 4 inches at 72 DPI
        height: '432px', // 6 inches at 72 DPI
        fontSize: '10px',
        lineHeight: '1.2'
      } : {}}
    >
      {/* Header */}
      <div className="text-center border-b border-gray-300 pb-2 mb-2">
        <div className="font-bold text-lg">JC HAIR STUDIO</div>
        <div className="text-xs text-gray-600">Professional Hair Care Products</div>
        <div className="font-bold text-lg mt-1">{label.carrier}</div>
        <div className="text-sm">{label.service}</div>
      </div>

      {/* Tracking and QR Code Section */}
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1">
          <div className="text-xs font-bold mb-1">TRACKING NUMBER:</div>
          <div className="font-bold text-base border border-gray-400 p-1 bg-gray-50">
            {label.trackingNumber}
          </div>

          {/* Barcode representation */}
          <div className="mt-2">
            <div className="text-xs mb-1">BARCODE:</div>
            <div className="font-mono text-xs border border-gray-300 p-1 bg-white">
              {/* Simplified barcode representation */}
              <div className="flex">
                {label.trackingNumber.split('').map((char, index) => (
                  <div
                    key={index}
                    className="bg-black h-8 mx-px"
                    style={{ width: Math.random() > 0.5 ? '2px' : '1px' }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* QR Code */}
        <div className="ml-2 text-center">
          <div className="text-xs mb-1">QR CODE</div>
          <div className="border border-gray-300 p-1 bg-white">
            <QRCodeSVG
              value={JSON.stringify({
                orderId: label.orderId,
                trackingNumber: label.trackingNumber,
                carrier: label.carrier
              })}
              size={isPrintFormat ? 60 : 80}
              level="M"
            />
          </div>
        </div>
      </div>

      {/* FROM Address */}
      <div className="border-t border-gray-300 pt-2 mb-3">
        <div className="text-xs font-bold mb-1">FROM:</div>
        <div className="text-xs leading-tight">
          <div className="font-bold">JC HAIR STUDIO</div>
          <div>Rua Example, 123</div>
          <div>1000-001 Lisboa</div>
          <div>PORTUGAL</div>
          <div>Tel: +351 928 375 226</div>
        </div>
      </div>

      {/* TO Address */}
      <div className="border-t border-gray-300 pt-2 mb-3">
        <div className="text-xs font-bold mb-1">TO:</div>
        <div className="text-xs leading-tight">
          <div className="font-bold">
            {order.deliveryAddress.firstName} {order.deliveryAddress.lastName}
          </div>
          {order.deliveryAddress.company && (
            <div>{order.deliveryAddress.company}</div>
          )}
          <div>
            {order.deliveryAddress.street}, {order.deliveryAddress.number}
          </div>
          {order.deliveryAddress.complement && (
            <div>{order.deliveryAddress.complement}</div>
          )}
          <div>{order.deliveryAddress.neighborhood}</div>
          <div>
            {order.deliveryAddress.zipCode} {order.deliveryAddress.city}
          </div>
          <div>
            {order.deliveryAddress.state}, {order.deliveryAddress.country}
          </div>
          {order.deliveryAddress.phone && (
            <div>Tel: {order.deliveryAddress.phone}</div>
          )}
        </div>
      </div>

      {/* Package Details */}
      <div className="border-t border-gray-300 pt-2 mb-2">
        <div className="text-xs font-bold mb-1">PACKAGE DETAILS:</div>
        <div className="text-xs grid grid-cols-2 gap-x-2">
          <div>Weight: {label.dimensions.weight} kg</div>
          <div>Items: {order.products.length}</div>
          <div>
            Size: {label.dimensions.length}×{label.dimensions.width}×{label.dimensions.height} cm
          </div>
          <div>Order: #{order.orderId.slice(-8)}</div>
        </div>
      </div>

      {/* Service Information */}
      <div className="border-t border-gray-300 pt-2 mb-2">
        <div className="text-xs">
          <div className="flex justify-between">
            <span>Service:</span>
            <span className="font-bold">{label.service}</span>
          </div>
          <div className="flex justify-between">
            <span>Est. Delivery:</span>
            <span className="font-bold">
              {new Date(label.estimatedDelivery).toLocaleDateString('pt-PT')}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Order Date:</span>
            <span>
              {new Date(order.timestamps?.createdAt || order.createdAt).toLocaleDateString('pt-PT')}
            </span>
          </div>
        </div>
      </div>

      {/* Special Instructions */}
      {order.specialInstructions && (
        <div className="border-t border-gray-300 pt-2 mb-2">
          <div className="text-xs font-bold mb-1">SPECIAL INSTRUCTIONS:</div>
          <div className="text-xs bg-yellow-50 p-1 border border-yellow-200 rounded">
            {order.specialInstructions}
          </div>
        </div>
      )}

      {/* Products List (for verification) */}
      <div className="border-t border-gray-300 pt-2">
        <div className="text-xs font-bold mb-1">CONTENTS:</div>
        <div className="text-xs">
          {order.products.map((product: any, index: number) => (
            <div key={index} className="flex justify-between">
              <span className="truncate flex-1 mr-1">
                {product.name.substring(0, 20)}...
              </span>
              <span>×{product.quantity}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-gray-300 pt-1 mt-2 text-center">
        <div className="text-xs text-gray-600">
          Track: jchairstudios62.com/track
        </div>
        <div className="text-xs text-gray-600 mt-1">
          Generated: {new Date().toLocaleDateString('pt-PT')} {new Date().toLocaleTimeString('pt-PT')}
        </div>
      </div>
    </div>
  );
};

export default ShippingLabel;