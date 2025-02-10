import { useLoginMutation } from "./useQueries";
import { useEffect } from "react";

export const useAuth = () => {
  const { mutateAsync, data, isSuccess, isError } = useLoginMutation();
  
  useEffect(() => {
    if (isSuccess && data) {
      localStorage.setItem("token", data.data.data.access_token);
      localStorage.setItem("refresh_token", data.data.data.refresh_token);
    }
    
    if (isError) {
      localStorage.removeItem("token");
      localStorage.removeItem("refresh_token");
    }
  }, [isSuccess, isError, data]);

  return {
    mutateAsync,
    isAuthenticated: !!localStorage.getItem("token"),
    isSuccess,
    isError
  };
};
