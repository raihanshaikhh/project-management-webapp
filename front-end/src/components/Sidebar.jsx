import { NavLink } from "react-router-dom"

function Sidebar() {

  const links = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "Projects", path: "/projects" },
    { name: "Tasks", path: "/tasks" }
  ]

  return (
    <div className="w-64 h-screen bg-gray-900 text-white p-5">

      <h1 className="text-xl font-bold mb-8">
        PM System
      </h1>

      <nav className="flex flex-col gap-4">

        {links.map(link => (
          <NavLink
            key={link.path}
            to={link.path}
            className={({ isActive }) =>
              isActive
                ? "text-blue-400 font-bold"
                : "text-white"
            }
          >
            {link.name}
          </NavLink>
        ))}

      </nav>

    </div>
  )
}

export default Sidebar