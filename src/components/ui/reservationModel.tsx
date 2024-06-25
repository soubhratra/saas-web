'use client'

import React, { useState } from 'react';
import { DateRange, Range } from 'react-date-range';
import { Button } from './button';
import {  toast } from 'sonner';
import { addDays } from 'date-fns';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';
import { createReservation } from '@/app/api/actions/createReservation';

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  user: {
    id: string
    given_name: string
    family_name: string
  }
}

const timeSlots = ['5pm', '6pm', '7pm' , "8pm"]

export default function ReservationModal({ isOpen, onClose, user }: ReservationModalProps) {
  const [dateRange, setDateRange] = useState<Range[]>([
    {
      startDate: addDays(new Date(), 1),
      endDate: addDays(new Date(), 2),   
      key: 'selection'
    }
  ])
  const [timeSlot, setTimeSlot] = useState<string>('')
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async (formData: FormData) => {
    if (!dateRange[0].startDate || !dateRange[0].endDate || !timeSlot) {
      setError('Please fill in all fields');
      return;
    }
  
    setIsLoading(true);
    setError(null);

    try {
      formData.append('userId', user.id);
      formData.append('startDate', dateRange[0].startDate.toISOString());
      formData.append('endDate', dateRange[0].endDate.toISOString());
      formData.append('timeSlot', timeSlot);
  
      const result = await createReservation(formData);
      
      if ("error" in result) {
        toast.error(result.error);
      } else {
        toast.success('Reservation confirmed!');
        onClose();
      }
    } catch (error) {
      setError("This slot is already booked");
    } finally {
      setIsLoading(false);
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0  bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg max-w-md w-full">
        <h2 className="text-xl font-bold mb-4 text-black">Book {user.given_name} {user.family_name}</h2>
        {error && (
    <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
      {error}
    </div>
  )}
        <form action={handleConfirm}>
          <div className="mb-4">
            <label className="block mb-2">Select Date Range:</label>
            <DateRange
              editableDateInputs={true}
              onChange={item => setDateRange([item.selection])}
              moveRangeOnFirstSelection={false}
              ranges={dateRange}
              className="w-full"
              minDate={new Date()}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Time Slot:</label>
            <select
              name="timeSlot"
              value={timeSlot}
              onChange={(e) => setTimeSlot(e.target.value)}
              className="border p-2 rounded w-full">
              <option value="">Select a time slot</option>
              {timeSlots.map((slot) => (
                <option key={slot} value={slot}>{slot}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-x-2 justify-end">
            <Button
              type="button"
              onClick={onClose}
              className=""
              disabled={isLoading}
              variant="secondary">
              Cancel
            </Button>
            <Button
              type="submit"
              className="" >
               {isLoading ? 'Processing...' : 'Confirm'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}