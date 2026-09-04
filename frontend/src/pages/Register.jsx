import { useState } from "react";
import axios from "axios";

// Register component for user registration.
// It takes callbacks `onRegistered`, `onShowLogin`, and `onShowContact` as props to handle navigation.
export default function Register({ onRegistered, onShowLogin, onShowContact }) {
  // State to hold the form data (username, email, password, secret code).
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    secret: "",
  });
  // State for storing and displaying registration errors.
  const [error, setError] = useState("");
  // State for displaying a success message upon successful registration.
  const [success, setSuccess] = useState("");

  // Handles changes in form inputs and updates the form state.
  const handleChange = (e) => {
    const {name, value} = e.target;
    
    setForm({
      ...form,
      [name]: value,
    });
  };

  // Handles the form submission for registration.
  const handleRegister = async (e) => {
    e.preventDefault(); // Prevents the default form submission behavior.
    setError(""); // Clears any previous errors.
    setSuccess(""); // Clears any previous success messages.

    try {
      // Sends a POST request to the registration API endpoint with the form data.
      const res = await axios.post(
        "https://yashgarje31.pythonanywhere.com/api/register/", 
        form
      );

      // On successful registration, set a success message.
      setSuccess("Account created successfully. You can now log in.");
      // Reset the form fields.
      setForm({ username: "", email: "", password: "", secret: "" });

      // Automatically switch to the login view after a 1.5-second delay.
      setTimeout(() => {
        // Calls the onRegistered prop function if it exists.
        onRegistered && onRegistered();
      }, 1500);
    } catch (err) {
      // If there's an error, handle it here.
      if (err.response && err.response.data) {
        setError(
          err.response.data.detail ||
            JSON.stringify(err.response.data)
        );
      } else {
        setError("Registration failed. Check fields and secret code.");
      }
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="card p-4 shadow" style={{ width: "380px" }}>
        <h3 className="text-center mb-3">Register</h3>

        {/* Display error or success messages if they exist. */}
        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleRegister}>
          {/* Username input field */}
          <div className="mb-3">
            <label className="form-label">Username</label>
            <input
              name="username"
              type="text"
              className="form-control"
              value={form.username}
              onChange={handleChange}
              required
            />
          </div>

          {/* Email input field (optional) */}
          <div className="mb-3">
            <label className="form-label">Email (optional)</label>
            <input
              name="email"
              type="email"
              className="form-control"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password input field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              name="password"
              type="password"
              className="form-control"
              value={form.password}
              onChange={handleChange}
              required
            />
          </div>

          {/* Secret Code input field */}
          <div className="mb-3">
            <label className="form-label">
              Secret Code <span className="text-danger">*</span>
            </label>
            <input
              name="secret"
              type="text"
              className="form-control"
              value={form.secret}
              onChange={handleChange}
              required
            />
            <div className="form-text">
              Ask the admin to get this code.
            </div>
          </div>

          <button className="btn btn-primary w-100 mb-2">Register</button>
        </form>

        <div className="d-flex justify-content-between mt-2">
          {/* Button to switch to the Login view. */}
          <button
            className="btn btn-link p-0"
            onClick={onShowLogin}
          >
            Already have an account? Login
          </button>
          {/* Button to switch to the Contact view to get the secret code. */}
          <button
            className="btn btn-link p-0"
            onClick={onShowContact}
          >
            Don&apos;t know secret code? Contact
          </button>
        </div>
      </div>
    </div>
  );
}
