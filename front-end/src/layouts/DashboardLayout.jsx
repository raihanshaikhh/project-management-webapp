import Sidebar from "../components/Sidebar"


function DashboardLayout({ children }) {
  return (
    <div className="flex h-screen bg-[#212322]">

      <Sidebar />

      <div className="flex-1 flex flex-col">

     

        <div className="overflow-y-auto">
          {children}
        </div>

      </div>

    </div>
  )
}

export default DashboardLayout