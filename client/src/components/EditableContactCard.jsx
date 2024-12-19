import React, { useState } from 'react';
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query';
import api from '../services/api';
import { Pencil, Check, X } from 'lucide-react';

const EditableContactCard = ({ contact: initialContact }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialContact);
  const queryClient = useQueryClient();

  // Fetch households for dropdown
  const { data: households = [] } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const response = await api.get('/households');
      return response.data;
    }
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

  return (
    <div className="bg-[var(--container-bg)] rounded-lg shadow-lg p-4">
      <div className="flex justify-between items-center mb-4">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="w-24 p-1 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            />
            <input
              type="text"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              className="w-24 p-1 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            />
          </div>
        ) : (
          <h2 className="text-xl font-bold text-[var(--text-color)]">
            {formData.firstName} {formData.surname}
          </h2>
        )}
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <button
                onClick={handleSubmit}
                className="bg-green-600 text-white p-1 rounded hover:bg-green-700"
                disabled={mutation.isPending}
              >
                <Check size={20} />
              </button>
              <button
                onClick={handleCancel}
                className="bg-red-600 text-white p-1 rounded hover:bg-red-700"
              >
                <X size={20} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[var(--button-bg)] text-[var(--text-color)] p-1 rounded hover:bg-[var(--button-hover-bg)]"
            >
              <Pencil size={20} />
            </button>
          )}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center">
          <span className="font-semibold text-[var(--text-color)] w-24">Birthday:</span>
          {isEditing ? (
            <input
              type="text"
              name="birthday"
              value={formData.birthday}
              onChange={handleChange}
              pattern="\d{2}/\d{2}"
              placeholder="DD/MM"
              className="w-24 p-1 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            />
          ) : (
            <span className="text-[var(--text-color)]">{formData.birthday}</span>
          )}
        </div>

        <div className="flex items-center">
          <span className="font-semibold text-[var(--text-color)] w-24">Phone:</span>
          {isEditing ? (
            <input
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="w-32 p-1 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            />
          ) : (
            <span className="text-[var(--text-color)]">{formData.phoneNumber}</span>
          )}
        </div>

        <div className="flex items-center">
          <span className="font-semibold text-[var(--text-color)] w-24">Household:</span>
          {isEditing ? (
            <select
              name="household"
              value={formData.household?._id || formData.household || ''}
              onChange={handleChange}
              className="w-48 p-1 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            >
              <option value="">Select a household</option>
              {households.map(h => (
                <option key={h._id} value={h._id}>
                  {h.householdName}
                </option>
              ))}
            </select>
          ) : (
            <span className="text-[var(--text-color)]">
              {formData.household?.householdName}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default EditableContactCard;
