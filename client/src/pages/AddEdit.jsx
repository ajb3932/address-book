import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';

function AddEdit() {
    const { type, id } = useParams();
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    
    console.log('AddEdit mounted with params:', { type, id });
  
    // Define isEditing based on id existence
    const isEditing = Boolean(id);
  
    // Validate type parameter
    if (!type || (type !== 'household' && type !== 'contact')) {
      console.error('Invalid type:', type);
      navigate('/');
      return null;
    }
  
    // Initialize form data
    const [formData, setFormData] = useState(
      type === 'household' 
        ? {
            householdName: '',
            address: ''
          }
        : {
            firstName: '',
            surname: '',
            birthday: '',
            phoneNumber: '',
            household: ''
          }
    );

  // Fetch households for dropdown
  const { data: households = [] } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const response = await api.get('/households');
      return response.data;
    },
    enabled: type === 'contact'
  });

  // Fetch existing data if editing
  // In AddEdit.jsx, update the useQuery hook
  useQuery({
    queryKey: [type, id],
    queryFn: async () => {
      if (!id) return null;
      const response = await api.get(`/${type}s/${id}`);
      return response.data;
    },
    enabled: isEditing,
    onSuccess: (data) => {
      console.log('Setting form data:', data); // Debug log
      if (data) {
        if (type === 'household') {
          setFormData({
            householdName: data.householdName || '',
            address: data.address || ''
          });
        } else {
          // For contacts
          setFormData({
            firstName: data.firstName || '',
            surname: data.surname || '',
            birthday: data.birthday || '',
            phoneNumber: data.phoneNumber || '',
            household: data.household?._id || data.household || ''
          });
        }
      }
    }
  });

  const mutation = useMutation({
    mutationFn: async (data) => {
      if (isEditing) {
        return api.put(`/${type}s/${id}`, data);
      } else {
        return api.post(`/${type}s`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries([`${type}s`]);
      navigate(type === 'household' ? '/' : '/contacts');
    },
    onError: (error) => {
      console.error('Mutation error:', error);
    }
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await mutation.mutateAsync(formData);
    } catch (error) {
      console.error('Failed to save:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold text-[var(--text-color)] mb-6">
        {isEditing ? `Edit ${type}` : `Add New ${type}`}
      </h1>

      <form onSubmit={handleSubmit} className="bg-[var(--container-bg)] rounded-lg p-6 shadow-lg">
        {type === 'household' ? (
          // Household Form
          <>
            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Household Name
              </label>
              <input
                type="text"
                name="householdName"
                value={formData.householdName}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Address
              </label>
              <textarea
                name="address"
                value={formData.address}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)] h-32"
                required
              />
            </div>
          </>
        ) : (
          // Contact Form
          <>
            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                First Name
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Surname
              </label>
              <input
                type="text"
                name="surname"
                value={formData.surname}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Birthday (DD/MM)
              </label>
              <input
                type="text"
                name="birthday"
                value={formData.birthday}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                pattern="\d{2}/\d{2}"
                placeholder="DD/MM"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                required
              />
            </div>

            <div className="mb-4">
              <label className="block text-[var(--text-color)] mb-2">
                Household
              </label>
              <select
                name="household"
                value={formData.household || ''}
                onChange={handleChange}
                className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                required
              >
                <option value="">Select a household</option>
                {households.map(household => (
                  <option key={household._id} value={household._id}>
                    {household.householdName}
                  </option>
                ))}
              </select>
            </div>
          </>
        )}

        <div className="flex justify-end space-x-2">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-gray-600 text-[var(--text-color)] rounded hover:bg-gray-700"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-[var(--button-bg)] text-[var(--text-color)] rounded hover:bg-[var(--button-hover-bg)]"
          >
            {isEditing ? 'Save Changes' : 'Add New'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEdit;