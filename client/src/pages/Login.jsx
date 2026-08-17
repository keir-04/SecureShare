import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const login = async () => {
    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      toast.success("Login Successful");

      setTimeout(() => {
        navigate("/dashboard");
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.message || "Login Failed");
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex justify-center items-center">
      <Toaster />

      <div className="bg-slate-900 p-10 rounded-xl w-[400px]">

        <h1 className="text-4xl text-center font-bold text-white">
          SecureShare Pro
        </h1>

        <input
          className="w-full mt-8 p-3 rounded bg-slate-800 text-white"
          placeholder="Email"
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full mt-4 p-3 rounded bg-slate-800 text-white"
          placeholder="Password"
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button
          onClick={login}
          className="w-full mt-6 bg-blue-600 p-3 rounded"
        >
          Login
        </button>

      </div>
    </div>
  );
}