import React, { SyntheticEvent, useContext, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import "./style.css";
import { UserErrors } from "../../models/errors";


export const AuthPage = () => {
    return (
        <div className="auth">
          <Register />
          <Login />
        </div>
      );
};


// The Register component is a functional component that is used to register a new user.
const Register = () => {
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    // SyntheticEvent is a type of event that is used in React applications to handle events like form submission, button click, etc.
    const handleSubmit = async (event: SyntheticEvent) => { 
        event.preventDefault(); // Prevent the default form submission
        try {
                await axios.post("http://localhost:3001/user/register", {
                        username,
                        password,
                });
                alert("Registration Completed! Now login.");
        } catch (err) {
                if (err.response.data.type === UserErrors.USER_NOT_FOUND) { // If the error type is USER_NOT_FOUND
                        alert("ERROR: No user found");
                    } else {
                        alert("ERROR: Something went wrong");
                    }
        }
  };

    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>Register</h2>
                
                <div className="form-group">
                    <label htmlFor="username">UserName : </label>
                    <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password : </label>
                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} /> 
                </div>

                <button type="submit">Register</button>
            </form>
        </div>
    );

};

const Login = () => {
    const [_, setCookies] = useCookies(["access_token"]); // it
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");

    const navigate = useNavigate();

    const handleSubmit = async (event: SyntheticEvent) => {
        
        event.preventDefault();
        try {
                const result = await axios.post("http://localhost:3001/user/login", {
                        username,
                        password,
                });
                setCookies("access_token", result.data.token); // Set the access token in the cookies
                localStorage.setItem("userID", result.data.userID); // Set the user ID in the local storage
                // setIsAuthenticated(true);
                navigate("/");
                

        } catch (err) {
            let errorMessage: string = "";
            switch (err?.response?.data?.type) {
              case UserErrors.USER_NOT_FOUND:
                errorMessage = "User doesn't exists";
                break;
              case UserErrors.WRONG_CREDENTIALS:
                errorMessage = "Wrong username/password combination";
                break;
              default:
                errorMessage = "Something went wrong";
            }
      
            alert("ERROR: " + errorMessage);
          }
  };


  
    return (
        <div className="auth-container">
            <form onSubmit={handleSubmit}>
                <h2>Login</h2>
                <div className="form-group">
                    <label htmlFor="username">UserName : </label>
                    <input type="text" id="username" value={username} onChange={(event) => setUsername(event.target.value)}/>
                </div>

                <div className="form-group">
                    <label htmlFor="password">Password : </label>
                    <input type="password" id="password" value={password} onChange={(event) => setPassword(event.target.value)} /> 
                </div>
                <button type="submit">Login</button>
            </form>
        </div>
    );


};

