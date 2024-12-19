import React, { useState } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { Pencil, Check, X, UserPlus } from 'lucide-react';

const EditableHouseholdCard = ({ household: initialHousehold }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(initialHousehold);
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const mutation = useMutation({
    mutationFn: async (updatedHousehold) => {
      const response = await api.put(`/households/${updatedHousehold._id}`, updatedHousehold);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['households']);
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
      console.error('Failed to update household:', error);
    }
  };

  const handleCancel = () => {
    setFormData(initialHousehold);
    setIsEditing(false);
  };

  const handleAddResident = () => {
    navigate(`/add/contact?household=${formData._id}`);
  };

  return (
    <div className="bg-[var(--container-bg)] rounded-lg shadow-lg overflow-hidden">
      {/* Card Header */}
      <div className="p-4 bg-[var(--button-bg)]">
        <div className="flex justify-between items-center">
          {isEditing ? (
            <input
              type="text"
              name="householdName"
              value={formData.householdName}
              onChange={handleChange}
              className="w-48 p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
            />
          ) : (
            <h2 className="text-xl font-bold text-[var(--text-color)]">
              {formData.householdName}
            </h2>
          )}
          
          <div className="flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSubmit}
                  className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                  disabled={mutation.isPending}
                >
                  <Check size={20} />
                </button>
                <button
                  onClick={handleCancel}
                  className="px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  <X size={20} />
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="px-3 py-1 bg-[var(--container-bg)] text-[var(--text-color)] rounded hover:opacity-80"
              >
                <Pencil size={20} />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4">
        <div className="mb-4">
          <h3 className="font-semibold text-[var(--text-color)] mb-2">Address</h3>
          {isEditing ? (
            <textarea
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)] h-24"
            />
          ) : (
            <p className="text-[var(--text-color)]">{formData.address}</p>
          )}
        </div>

        <div>
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-[var(--text-color)]">Residents</h3>
          </div>
          
          <ul className="space-y-2">
            {formData.contacts?.map(contact => (
              <li 
                key={contact._id}
                className="p-2 bg-opacity-50 bg-gray-700 rounded"
              >
                <div className="text-[var(--text-color)]">
                  {contact.firstName} {contact.surname}
                </div>
                <div className="text-sm text-[var(--text-color)] opacity-75">
                  {contact.birthday} • {contact.phoneNumber}
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EditableHouseholdCard;