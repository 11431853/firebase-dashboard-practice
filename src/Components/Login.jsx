import React from 'react'
import { useState } from 'react'
import "./login.css";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '../firebase';
import {setDoc, doc} from 'firebase/firestore'
import { useNavigate } from 'react-router-dom';
import { UserAuth } from '../Context/AuthContext';



const Login = () => {
    const [loginDetails, setLoginDetails] = useState({
        emailid: "",
        pin: "",
        err: null,
    });

    const [registerDetails, setRegisterDetails] = useState({
        username: "",
        email:"",
        mobile: "",
        password: "",
        error: null,
    });

    const {createUser} = UserAuth();

    const {signIn} = UserAuth();

    const [toggle, setToggle] = useState(true);

    const {emailid, pin, err} = loginDetails;

    const {username, email, mobile, password, error} = registerDetails;
    
    const navigate = useNavigate();


    const handleLoginChange = (e) => {
        setLoginDetails({...loginDetails, [e.target.name]: e.target.value})
    }

    const handleRegisterChange = (e) => {
        setRegisterDetails({...registerDetails, [e.target.name]: e.target.value});
    }

    const togglelogin = () => {
        setLoginDetails({
            emailid: "",
            pin: "",
            err: null,
        });
        setRegisterDetails({
            username: "",
            emailid:"",
            mobile: "",
            pin: "",
            error: null,
        })
        setToggle(false);
    }

    

    
    const loginSubmit = async (e) => {
        localStorage.removeItem("id")
        e.preventDefault();
        if (!emailid || !pin) {
            setLoginDetails({...loginDetails, err: "All fields are required"});
        }
        try {
            // const res = await signInWithEmailAndPassword(auth, emailid, pin);
            const res = await signIn(emailid, pin);
            setLoginDetails({
                emailid: "",
                pin: "",
                err: null,
            })
            navigate("/profile")
        }
        catch(err) {
            if (err.message === "Firebase: Error (auth/user-not-found).") {
                setLoginDetails({...loginDetails,err: "user id doesnot exist"})
            }
            else if (err.message === "Firebase: Error (auth/invalid-email).") {
                setLoginDetails({...loginDetails,err: "email id is not valid"})
            }
            else if (err.message === "Firebase: Error (auth/wrong-password).") {
                setLoginDetails({...loginDetails,err: "Please enter correct password"})
            }
            else {
                console.log(err.message)
            }
            
        }
        

    }


    const registerSubmit = async (e) => {
        e.preventDefault();
        if (!username || !email || !mobile || !password) {
            setRegisterDetails({...registerDetails, error: "All fields are required"});
        }
        else if (mobile.length!==10) {
            setRegisterDetails({...registerDetails, error: "Please enter valid 10 digit mobile number"});
        }
        else {
            try {
                // const result = await createUserWithEmailAndPassword(auth, email, password);

                const result = await createUser(email, password);
                
                await setDoc(doc(db, 'users', result.user.uid), {
                    uid: result.user.uid,
                    username,
                    email,
                    mobile,
                    password,
                });
                setRegisterDetails({
                    username: "",
                    email:"",
                    mobile: "",
                    password: "",
                    error: null,
                })
                setToggle(true)
    
            }
            catch (err) {
                if (err.message === "Firebase: Error (auth/email-already-in-use).") {
                    setRegisterDetails({...registerDetails, error: "user already exist"});
                } 
                else if (err.message === "Firebase: Error (auth/invalid-email).") {
                    setRegisterDetails({...registerDetails, error: "please enter valid email id"});
                } 
                else if (err.message === "Firebase: Password should be at least 6 characters (auth/weak-password).") {
                    setRegisterDetails({...registerDetails, error: "password should be atleast 6 characters"});
                }
                else {
                    setRegisterDetails({...registerDetails, error: err.message});
                console.log(err.message);
                }
            }
        }
        
        
    }

   



  return (
    <div>
      {toggle ? <section className='login'>
        <h3>Login</h3>
        <form onSubmit={loginSubmit}>
            <div className='input_container'>
                <label htmlFor="email">User Id / Name</label>
                <input type="text" id='email' name='emailid' value={emailid} onChange={handleLoginChange}  />
            </div>
            <div className='input_container'>
                <label htmlFor="password">Password</label>
                <input type="password" id='password' name='pin' value={pin} onChange={handleLoginChange}  />
            </div>
            {err ? <p className='error'>{err}</p>: null}
            <div className='button_container'>
                <button className='btn' type='submit'>Login</button>
            </div>
        </form>
        <div className='togglediv'>
        <h5>First time ? <span className='togglechange' onClick={togglelogin}>Register Here</span></h5>
        </div>
    </section> :
    <section className='register'>
        <h3>Registration</h3>
        <form onSubmit={registerSubmit}>
        <div className='input_container'>
                <label htmlFor="name">Users Name</label>
                <input type="text" id='name' name='username' onChange={handleRegisterChange}  />
            </div>
            <div className='input_container'>
                <label htmlFor="email">Email id</label>
                <input type="email" id='email' name='email' onChange={handleRegisterChange} />
            </div>
            <div className='input_container'>
                <label htmlFor="mobile">mobile no</label>
                <input type="number" id='mobile' name='mobile' onChange={handleRegisterChange} />
            </div>
            <div className='input_container'>
                <label htmlFor="password">Password</label>
                <input type="password" id='password' name='password' onChange={handleRegisterChange} />
            </div>
            {error ? <p className='error'>{error}</p>: null}
            <div className='button_container'>
                <button className='btn' type='submit'>SIGN UP</button>
            </div>
        </form>
        <div className='togglediv'>
        <h5>Already have an account ? <span className='togglechange' onClick={() => setToggle(true)}>Login Here</span></h5>
        </div>
    </section>} 
    </div>
  )
}

export default Login
