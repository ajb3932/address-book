import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import EditableHouseholdCard from '../components/EditableHouseholdCard';

function Households() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: households = [], isLoading } = useQuery({
    queryKey: ['households'],
    queryFn: async () => {
      const response = await api.get('/households');
      return response.data;
    }
  });

  const filteredHouseholds = households.filter(household => 
    household.householdName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div>
      {/* Search Box */}
      <div className="mb-6">
        <input
          type="text"
          placeholder="Search households..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full max-w-xl p-3 rounded-lg border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
        />
      </div>

      {/* Households Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredHouseholds.map(household => (
          <EditableHouseholdCard key={household._id} household={household} />
        ))}
      </div>

      {isLoading && (
        <div className="text-center text-[var(--text-color)]">Loading...</div>
      )}

      {filteredHouseholds.length === 0 && !isLoading && (
        <div className="text-center text-[var(--text-color)]">
          No households found
        </div>
      )}
    </div>
  );
}

export default Households;