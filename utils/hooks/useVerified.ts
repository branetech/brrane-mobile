import {useMemo} from 'react';

// Custom Hook
export const useIsAnyVerified = (obj: any) => {
  return useMemo(() => {
    return Object.values(typeof obj === 'object' ? obj : {}).includes(true)
  }, [obj]);
};


export const useAddressVerificationStatus = (status: any) => {
  return useMemo(() => {
    if (status === "failed") return null;    
    if (status === "pending") return false;  
    if (status === "completed") return true; 
    return null; 
  }, [status]);
};