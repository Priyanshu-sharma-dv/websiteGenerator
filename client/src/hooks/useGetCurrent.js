import React from 'react'
import { useEffect } from "react";
import { serverUrl } from '../App';
import axios from 'axios';
import {useDispatch} from "react-redux"
import {setUserData} from "../redux/userSlice"
function useGetCurrentUser() {
  const dispatch = useDispatch();
  useEffect(() => {
    const getCurrentUser = async () => {
      try {
        const res = await axios.get(`${serverUrl}/api/user/me`,
          { withCredentials: true })
        dispatch(setUserData(res.data.user))
      }
      catch (error ) {
        dispatch(setUserData(null))
      }
    }
    getCurrentUser();

  }, [])
}

export default useGetCurrentUser;

