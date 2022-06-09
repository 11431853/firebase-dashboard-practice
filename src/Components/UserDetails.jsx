
import { async } from '@firebase/util';
import { deleteUser } from 'firebase/auth';
import { collection, deleteDoc, doc, getDocs, setDoc, updateDoc } from 'firebase/firestore';
import React, { useEffect, useState } from 'react'
import { auth, db } from '../firebase';
import "./login.css";
import { useNavigate } from 'react-router-dom';



const UserDetails = () => {
    const [text, setText] = useState({
        uid:"",
        username: "",
        email: "",
        password: "",
        mobile: "",
    });

    const {username,email,password,mobile} = text;

    const [users, setUsers] = useState([]);
    const usersCollectionRef = collection(db,"users");
    const [edit, setEdit] = useState(false);

    const navigate = useNavigate()


    useEffect(() => {
        const getUsers = async () => {
            const data = await getDocs(usersCollectionRef);
            setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
          }
          getUsers()
        
    },[users]);

    const handleEdit = (id,user) => {
        console.log("user", user);
        setEdit(true);

        setText({
            ...text,
            ...user,
        })
    }

    const handleEditChange = (e) => {
        const {name,value} = e.target;
    setText({...text, [name]: value});
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!text.username || !text.email || !text.mobile || !text.password) {
            alert("Please fill all the details")
        }
        else if (text.mobile.length !==10) {
            alert("Your mobile is not valid")
        }
        else if(text.password.length<6) {
            alert("your password should contain atleast 6 charecters")
        };
        const userDoc = doc(db, "users", text.uid);
        await updateDoc(userDoc,{...text});
        setEdit(false)
   
    }

    const handleDelete = async (id) => {
        await deleteDoc(doc(db,"users",id));
        deleteUser(auth.currentUser).then(() => {
            navigate("/")
        }).catch((err) => {
            console.log(err.message)
        })
    }
    

  return (
    <div>
        {edit ? 
        <form onSubmit={handleSubmit}>
        <span>Name: <input type="text" value={username ||""} name='username' className='editinput' onChange={handleEditChange} /></span>
        <span>Email: <input type="email" value={email ||""} name='email' className='editinput email' onChange={handleEditChange} /></span>
        <span>Password: <input type="password" value={password ||""} name='password' className='editinput' onChange={handleEditChange} /></span>
        <span>Mobile: <input type="number" value={mobile ||""} name='mobile' className='editinput' onChange={handleEditChange} /></span>
        <button type='submit'>Edit</button>
        </form> : null
        }
      <table>
          <thead>
              <th>S.No</th>
              <th>Name</th>
              <th>Email Id</th>
              <th>Password</th>
              <th>mobile no</th>
              <th>Action</th>
          </thead>
          <tbody>
          { 

          users.map((user, index) => {
              return (
              <tr>
                  <td>{index+1}</td>
                  <td>{user.username}</td>
                  <td>{user.email}</td>
                  <td>{user.password}</td>
                  <td>{user.mobile}</td>
                  <td>
                      <button className={edit ? "disable" : ""} onClick={() => handleEdit(user.id,user) } disabled={edit}>Edit</button>
                      <button className={edit ? "disabledel" : "del"} onClick={() => handleDelete(user.id)} disabled={edit}>Delete</button>
                  </td>
              </tr>
              )
          })
              }
        </tbody>
      </table>
    </div>
  )
}

export default UserDetails
