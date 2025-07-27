import React, { createContext, useContext, useState, useEffect } from 'react';

const DashboardFilterContext = createContext(null);

export const DashboardFilterProvider = ({ children }) => {
  const [selectedDays, setSelectedDays] = useState(30); // Default to last 30 days

  return (
    <DashboardFilterContext.Provider value={{ selectedDays, setSelectedDays }}>
      {children}
    </DashboardFilterContext.Provider>
  );
};

export const useDashboardFilter = () => useContext(DashboardFilterContext);
