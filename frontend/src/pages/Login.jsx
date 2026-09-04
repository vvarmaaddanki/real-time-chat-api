import { useState } from "react";
import axios from "axios";

// Login component for user authentication.
// It takes callbacks `onLogin`, `onShowRegister`, and `onShowContact` as props to handle successful login and navigation.
export default function Login({ onLogin, onShowRegister, onShowContact }) {
  // State to hold the username input.
  const [username, setUsername] = useState("");
  // State to hold the password input.
  const [password, setPassword] = useState("");
  // State for storing and displaying login errors.
  const [error, setError] = useState("");

  // Handles the form submission for logging in.
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.
    setError(""); // Clears any previous errors.

    try {
      // Sends a POST request to the login API endpoint with username and password.
      const res = await axios.post("https://yashgarje31.pythonanywhere.com/api/login/", {
        username,
        password,
      });

      // On successful login, store the access and refresh tokens in localStorage.
      localStorage.setItem("access", res.data.access);
      localStorage.setItem("refresh", res.data.refresh);

      // Call the onLogin prop function to notify the parent component (App.jsx) that login was successful.
      onLogin();
    } catch (err) {
      // If there's an error (e.g., wrong credentials), set an error message.
      setError("Invalid username or password");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "350px" }}>
        <h3 className="text-center mb-3">Login</h3>

        {/* Display an error message if it exists. */}
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleLogin}>
          {/* Username input field */}
          <input
            type="text"
            className="form-control mb-3"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          {/* Password input field */}
          <input
            type="password"
            className="form-control mb-3"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button className="btn btn-primary w-100">Login</button>
        </form>

        <div className="d-flex justify-content-between mt-3">
          {/* Button to switch to the Register view. */}
          <button
            className="btn btn-link p-0"
            onClick={onShowRegister}
          >
            New user? Register
          </button>
        </div>
      </div>
    </div>
  );
}
