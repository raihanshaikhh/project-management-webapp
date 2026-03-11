import { useState } from "react"
import API from "../services/api.js"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"

function Login() {

  const navigate = useNavigate()

  const [form, setForm] = useState({
    email: "",
    password: ""
  })

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

 const handleSubmit = async (e) => {
  e.preventDefault()
  console.log("form submitted");
  

  try {
    const res = await API.post("/auth/login", form)

    localStorage.setItem("token", res.data.token)

    navigate("/dashboard")
  } catch (err) {
    console.log(err)
  }
}

  return (
    <div className="relative min-h-screen w-full flex items-center justify-center overflow-hidden bg-slate-950">
      
      {/* Animated Mesh Background */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[70%] h-[70%] rounded-full bg-purple-600/30 blur-[120px] animate-mesh" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[60%] h-[60%] rounded-full bg-blue-600/20 blur-[100px] animate-mesh [animation-delay:2s]" />
        <div className="absolute top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-pink-500/20 blur-[110px] animate-mesh [animation-delay:4s]" />
      </div>

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-md p-8 mx-4 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-white tracking-tight">Welcome back</h1>
          <p className="text-slate-400 mt-2">Please enter your details to sign in.</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Email Address</label>
            <input 
              type="email" 
              name="email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white transition-all"
              placeholder="name@company.com"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-200 mb-2">Password</label>
            <input 
              type="password" 
              name="password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none text-white transition-all"
              placeholder="••••••••"
            />
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center text-slate-300">
              <input type="checkbox" className="mr-2 rounded border-white/10 bg-white/5 text-purple-600" />
              Remember me
            </label>
            <a href="#" className="text-purple-400 hover:text-purple-300 transition-colors">Forgot password?</a>
          </div>

          <button className="w-full py-3 px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white font-semibold rounded-lg shadow-lg transform transition-all active:scale-[0.98]">
            Sign in
          </button>
        </form>

        <p className="text-center text-slate-400 mt-8 text-sm">
          Don't have an account? 
          <a href="#" className="text-white font-medium hover:underline ml-1"><Link to="/register">Create one</Link></a>
        </p>
      </div>
    </div>
  )
}

export default Login
