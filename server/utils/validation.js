const validateContact = (data) => {
    const errors = [];
    
    if (!data.firstName) errors.push('First name is required');
    if (!data.surname) errors.push('Surname is required');
    if (!data.birthday) errors.push('Birthday is required');
    if (data.phoneNumber && !/^\d{11}$/.test(data.phoneNumber)) {
      errors.push('Phone number must be 11 digits');
    }
  
    return errors;
  };
  
  const validateHousehold = (data) => {
    const errors = [];
    
    if (!data.householdName) errors.push('Household name is required');
    if (!data.address) errors.push('Address is required');
  
    return errors;
  };
  
  module.exports = { validateContact, validateHousehold };