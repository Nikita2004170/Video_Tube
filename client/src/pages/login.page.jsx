import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import {loginAPI} from "../api/api.js";
export const Login=()=>{
    const navigate = useNavigate();
    const [form,setForm]=useState({
        username:"",
        password:"",
    });
    const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const validate = () => {
    let err = {};

    if (!form.username.trim()) {
      err.username = "Username is required";
    } else if (form.username.length < 3) {
      err.username = "Username must be at least 3 characters";
    }

    if (!form.password.trim()) {
      err.password = "Password is required";
    } else if (form.password.length < 3) {
      err.password = "Password must be at least 3 characters";
    }

    setErrors(err);
    return Object.keys(err).length === 0;
  }
  const handleChange = (e) => {
      setForm({ ...form, [e.target.name]: e.target.value });
    };
    const handleSubmit = async (e) => {
      e.preventDefault();
    if (!validate()) return;
    
     setLoading(true);
      try {
        const res = await loginAPI(form);
        alert("User loggedIn successfully!");
        //console.log(res.data);
        navigate("/");
      }  catch (err) {
    const message = err.response?.data?.message;

    // ❌ Password incorrect
    if (message === "password is not correct") {
      alert("❌ Incorrect password. Please try again.");
    }
    // ❌ Username not found
    else if (message === " user not created") {
      alert("❌ User does not exist.");
    }
    // Other errors
    else {
      alert(message || "Login failed");
    }
  } finally {
        setLoading(false);
      }
    };
    return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-indigo-500 to-purple-600 p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl p-8">
        
        <h2 className="text-3xl font-bold text-gray-800 text-center">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          join us and explore more
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block mb-1 text-sm font-medium">User Name</label>
            <input
  type="text"
  name="username"     // FIXED
  value={form.username}
  onChange={handleChange}
  placeholder="Enter username"
  className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
  required
/>
          </div>

          <div>
            <label className="block mb-1 text-sm font-medium">Password</label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter password"
              className="w-full border px-4 py-2 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none"
              required
            />
          </div>

          <button
  type="submit"
  disabled={loading}
  className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-2 rounded-lg transition-all duration-200"
>
  {loading ? "Logging in..." : "Login"}
</button>
        </form>

        {/* Already have an account */}
        <p className="text-center text-gray-600 mt-4">
          Don't have an account?{" "}
          <Link to="/" className="text-indigo-600 font-semibold hover:underline">
            SignUp
          </Link>
        </p>
        <p className="text-center text-gray-600 mt-4">
          Forgot your password?{" "}
          <Link to="/forgot-password" className="text-indigo-600 font-semibold hover:underline">
            Forgot password
          </Link>
        </p>
      </div>
    </div>
  );
}