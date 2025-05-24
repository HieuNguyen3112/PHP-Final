import { createContext, useContext, useState } from "react";
import useGetCabins from "../api/useGetCabins";

const CabinContext = createContext();

export function CabinProvider({ children }) {
  const { cabins, isLoading, error, refreshCabins } = useGetCabins();
  
  return (
    <CabinContext.Provider value={{ cabins, isLoading, error, refreshCabins }}>
      {children}
    </CabinContext.Provider>
  );
}

export function useCabinContext() {
  const context = useContext(CabinContext);
  if (context === undefined) {
    throw new Error("useCabinContext must be used within a CabinProvider");
  }
  return context;
}