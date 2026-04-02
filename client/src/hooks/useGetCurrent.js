import React from 'react'
import { useEffect,useState } from "react";
import axios from 'axios';
import {useDispatch} from "react-redux"
import {setUserData} from "../redux/userSlice"
function useGetCurrentUser() {
  const dispatch = useDispatch();
    const [loading, setLoading] = useState(true);
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(`${import.meta.env.VITE_SERVER_URL}/api/user/me`,
          { withCredentials: true })
        dispatch(setUserData(res.data.user))
      }
      catch (error) {
        dispatch(setUserData(null))
      }finally {
        setLoading(false); 
      }
    }
    getCurrentUser();

  },[])

  return { loading };
}

export default useGetCurrentUser;

