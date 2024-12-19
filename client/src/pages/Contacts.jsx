import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import api from '../services/api';
import EditableContactCard from '../components/EditableContactCard';

function Contacts() {
  const [searchTerm, setSearchTerm] = useState('');
  
  const { data: contacts = [], isLoading, error } = useQuery({
    queryKey: ['contacts'],
    queryFn: async () => {
      const response = await api.get('/contacts');
      return response.data;
    }
  });

  const filteredContacts = contacts.filter(contact => 
    contact.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.surname.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.phoneNumber.includes(searchTerm)
  );

  if (isLoading) return <div className="text-center text-[var(--text-color)]">Loading...</div>;
  if (error) return <div className="text-center text-red-500">Error: {error.message}</div>;

  return (
    <div className="container mx-auto px-4">
      <div className="my-4">
        <input
          type="text"
          placeholder="Search contacts..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full p-2 rounded border border-[var(--border-color)] bg-gray-700 text-[var(--text-color)]"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {filteredContacts.map(contact => (
          <EditableContactCard key={contact._id} contact={contact} />
        ))}
      </div>
    </div>
  );
}

export default Contacts;