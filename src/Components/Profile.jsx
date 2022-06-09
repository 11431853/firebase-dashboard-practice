import { collection, query, where, onSnapshot, QuerySnapshot, doc, getDocs, getDoc } from 'firebase/firestore';
import React, { useEffect } from 'react'
import { useState } from 'react';
import { auth, db } from '../firebase'
import { UserAuth } from '../Context/AuthContext';
import { useNavigate } from 'react-router-dom'
import "./login.css"
import { deleteUser, signOut } from 'firebase/auth';


const Profile = () => {
    const {user} = UserAuth();
    const [profile, setProfile] = useState();
    const navigate = useNavigate();
    
    
    const value = (key) => {
        const saved = localStorage.getItem(key);
        const initial = JSON.parse(saved);
        if (initial === null || initial === undefined) {
            return key
        } else {
            console.log("initial",initial)
            return initial;
        }

    }

    useEffect(() => {
        
        if (localStorage.getItem("id") !==null) {
            getDoc(doc(db, 'users', value("id"))).then(docSnap => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            })
        }
        else {
            localStorage.setItem("id",JSON.stringify(auth.currentUser.uid));
            getDoc(doc(db, 'users', value("id"))).then(docSnap => {
                if (docSnap.exists()) {
                    setProfile(docSnap.data());
                }
            })
        }

    },[]);

    const handleLogout = (id) => {
        
        signOut(auth).then(() => {
            navigate("/")
        }).catch((err) => {
            console.log(err.message)
        }) 
    }

    
  return (

    <div>
      {profile ? <div>
          <button onClick={() => navigate("/userdetails")} style={{float: 'right'}}>All the details of users</button>
          <button onClick={() => handleLogout(profile.uid)} style={{float: 'right', background:'red', border: 'none'}}>LogOut</button>
          <h3>Welcome <span style={{color: "rgb(64, 223, 239)"}}>{profile.username}</span></h3>
          <p>Mobile: {profile.mobile}</p>
          <table>
              <tr>
                  <th>Name:</th>
                  <td>{profile.username}</td>
              </tr>
              <tr>
                  <th>mobile:</th>
                  <td>{profile.mobile}</td>
              </tr>
              <tr>
                  <th>Email:</th>
                  <td>{profile.email}</td>
              </tr>
              <tr>
                  <th>password:</th>
                  <td>{profile.password}</td>
              </tr>
          </table>
          </div>
      : <h3>Loading</h3>}
    </div>
  )
}

export default Profile
