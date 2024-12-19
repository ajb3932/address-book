import { useEffect, useState } from 'react';

function EditModal({ isOpen, onClose, onSave, data, type }) {
  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (data) {
      setFormData(data);
    }
  }, [data]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-[var(--container-bg)] rounded-lg p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-[var(--text-color)] mb-4">
          Edit {type}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {type === 'household' ? (
            // Household Form Fields
            <>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  Household Name
                </label>
                <input
                  type="text"
                  value={formData.householdName || ''}
                  onChange={(e) => setFormData({...formData, householdName: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  Address
                </label>
                <textarea
                  value={formData.address || ''}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                />
              </div>
            </>
          ) : (
            // Contact Form Fields
            <>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  First Name
                </label>
                <input
                  type="text"
                  value={formData.firstName || ''}
                  onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  Surname
                </label>
                <input
                  type="text"
                  value={formData.surname || ''}
                  onChange={(e) => setFormData({...formData, surname: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                />
              </div>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  Birthday (DD/MM)
                </label>
                <input
                  type="text"
                  value={formData.birthday || ''}
                  onChange={(e) => setFormData({...formData, birthday: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                  pattern="\d{2}/\d{2}"
                  placeholder="DD/MM"
                />
              </div>
              <div>
                <label className="block text-[var(--text-color)] mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phoneNumber || ''}
                  onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                  className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
                  required
                />
              </div>
            </>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-[var(--text-color)] rounded hover:bg-gray-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-[var(--button-bg)] text-[var(--text-color)] rounded hover:bg-[var(--button-hover-bg)]"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditModal;