import React, { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Pencil, Check, X, Trash2 } from 'lucide-react';
import api from '../services/api';

function EditableContactCard({ contact: initialContact }) {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialContact);
  const queryClient = useQueryClient();

  // Fetch households for dropdown
  const { data: households = [] } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const response = await api.get('/households');
      return response.data;
    },
    enabled: isEditing // Only fetch when editing
  });

  const mutation = useMutation({
    mutationFn: async (updatedContact) => {
      const response = await api.put(`/contacts/${updatedContact._id}`, updatedContact);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
      setIsEditing(false);
    }
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return await api.delete(`/contacts/${initialContact._id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
      console.error('Delete failed:', error);
    }
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to update contact:', error);
    }
  };

  const handleCancel = () => {
    setFormData(initialContact);
    setIsEditing(false);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this contact?')) {
      try {
        await deleteMutation.mutateAsync();
      } catch (error) {
        console.error('Failed to delete contact:', error);
      }
    }
  };

  return (
    <div className="bg-[var(--container-bg)] p-4 rounded-lg shadow-lg">
      <div className="flex justify-between items-start mb-4">
        <div className="flex-grow">
          {isEditing ? (
            <div className="space-y-2">
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                placeholder="First Name"
              />
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                placeholder="Surname"
              />
              <input
                type="text"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                placeholder="Birthday (DD/MM)"
                pattern="\d{2}/\d{2}"
              />
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                placeholder="Phone Number"
              />
              <select
                name="household"
                value={formData.household?._id || formData.household || ''}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
              >
                <option value="">No Household</option>
                {households.map(household => (
                  <option key={household._id} value={household._id}>
                    {household.householdName}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <>
              <h3 className="text-lg font-semibold text-[var(--text-color)]">
                {formData.firstName} {formData.surname}
              </h3>
              <div className="mt-1 space-y-1 text-sm">
                <p className="text-[var(--text-color)] opacity-75">
                  Birthday: {formData.birthday}
                </p>
                <p className="text-[var(--text-color)] opacity-75">
                  Phone: {formData.phoneNumber}
                </p>
                <p className="text-[var(--text-color)] opacity-75">
                  Household: {formData.household?.householdName || 'None'}
                </p>
              </div>
            </>
          )}
        </div>
        
        <div className="flex space-x-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSubmit}
                className="p-1 hover:bg-green-700 bg-green-600 rounded"
                disabled={mutation.isPending}
              >
                <Check className="w-5 h-5 text-white" />
              </button>
              <button
                onClick={handleCancel}
                className="p-1 hover:bg-red-700 bg-red-600 rounded"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </>
          ) : (
            <>
              <button
                onClick={() => setIsEditing(true)}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Pencil className="w-5 h-5 text-[var(--text-color)]" />
              </button>
              <button
                onClick={handleDelete}
                className="p-1 hover:bg-gray-700 rounded"
              >
                <Trash2 className="w-5 h-5 text-red-500" />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default EditableContactCard;