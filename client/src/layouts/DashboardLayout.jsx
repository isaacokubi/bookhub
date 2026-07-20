import Navbar from "../components/common/Navbar";

export default function DashboardLayout({ children }) {
  return (
    <div>
      <Navbar />

      <div
        className="
container
mx-auto
px-4
py-8
"
      >
        {children}
      </div>
    </div>
  );
}
