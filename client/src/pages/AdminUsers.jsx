import { useEffect, useState } from "react";
import { getUsers } from "../api/adminApi";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      const data = await getUsers();

      console.log("ADMIN USERS RESPONSE:", data);

      setUsers(data);
    } catch (error) {
      console.error("Failed to load users:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <h1 className="text-3xl font-bold">Loading Users...</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Manage Users</h1>

      <div className="bg-white shadow rounded overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50">
              <th className="p-3 text-left">Name</th>

              <th className="p-3 text-left">Email</th>

              <th className="p-3 text-left">Role</th>
            </tr>
          </thead>

          <tbody>
            {users.length > 0 ? (
              users.map((user) => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-3">{user.name}</td>

                  <td className="p-3">{user.email}</td>

                  <td className="p-3 capitalize">{user.role}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" className="p-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
