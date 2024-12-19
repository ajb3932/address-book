const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit'
    });
  };
  
  const sortByName = (a, b) => {
    return a.firstName.localeCompare(b.firstName);
  };
  
  module.exports = { formatDate, sortByName };