import React, { useState } from 'react';
import { DateRange } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface ReservationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (startDate: Date, endDate: Date, time: string) => void;
  userName: string;
}

export default function ReservationModal({ isOpen, onClose, onConfirm, userName }: ReservationModalProps) {
  const [dateRange, setDateRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  });
  const [time, setTime] = useState('');

  const handleSelect = (ranges: any) => {
    setDateRange(ranges.selection);
  };

  const handleConfirm = () => {
    onConfirm(dateRange.startDate, dateRange.endDate, time);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Book a Reservation with {userName}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            &times;
          </button>
        </div>
        <div className="space-y-4">
          <DateRange
            ranges={[dateRange]}
            onChange={handleSelect}
            months={1}
            direction="vertical"
            className="w-full"
          />
          <input
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            placeholder="Select time"
            className="w-full p-2 border border-gray-300 rounded"
          />
          <button
            onClick={handleConfirm}
            className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
          >
            Confirm Reservation
          </button>
        </div>
      </div>
    </div>
  );
}
