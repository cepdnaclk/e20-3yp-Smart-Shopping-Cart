// components/admin/RegisterManagerForm.tsx
import React, { useState } from "react";

const RegisterManagerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [status, setStatus] = useState<"idle" | "success" | "error" | "loading">("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");

    try {
      const res = await fetch("/api/admin/register-manager", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to register");

      setStatus("success");
      setFormData({ username: "", email: "", password: "" });
    } catch {
      setStatus("error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <input
        type="text"
        name="username"
        placeholder="Username"
        className="border p-2 w-full rounded"
        value={formData.username}
        onChange={handleChange}
        required
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        className="border p-2 w-full rounded"
        value={formData.email}
        onChange={handleChange}
        required
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        className="border p-2 w-full rounded"
        value={formData.password}
        onChange={handleChange}
        required
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded"
        disabled={status === "loading"}
      >
        {status === "loading" ? "Registering..." : "Register Manager"}
      </button>

      {status === "success" && <p className="text-green-600">Manager registered successfully!</p>}
      {status === "error" && <p className="text-red-600">Error registering manager.</p>}
    </form>
  );
};

export default RegisterManagerForm;
