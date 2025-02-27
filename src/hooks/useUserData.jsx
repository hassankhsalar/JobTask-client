import { useState, useEffect } from "react";
import useAxiosPublic from "./useAxiosPublic";
import useAuth from "./useAuth";

const useUserData = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const axiosPublic = useAxiosPublic();
  const { user } = useAuth();

  useEffect(() => {
    if (!user.email) return;

    setLoading(true);
    axiosPublic
      .get(`/users?email=${user.email}`)
      .then((res) => {
        setUserData(res.data);
        setError(null);
      })
      .catch((err) => {
        console.error("Error fetching user data:", err);
        setError(err);
      })
      .finally(() => setLoading(false));

  }, [axiosPublic, user.email]);

  return { userData, loading, error };
};

export default useUserData;
