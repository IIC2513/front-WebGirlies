import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../auth/AuthContext";
import Navbar from '../common/Navbar';
import './adminUserList.css';

const AdminUserList = () => {
  const { token } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token) {
      axios({
        method: "get",
        url: `${import.meta.env.VITE_BACKEND_URL}/users`,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
        .then((response) => {
          setUsers(response.data);
        })
        .catch((error) => {
          setError(error.response?.data?.message || "Error fetching users");
        });
    }
  }, [token]);

  const handleDelete = (userId) => {
    // Llamada a la API para eliminar al usuario (deberías implementar esta ruta en el backend)
    axios({
      method: "delete",
      url: `${import.meta.env.VITE_BACKEND_URL}/users/${userId}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(() => {
        setUsers(users.filter(user => user.userId !== userId));
      })
      .catch((error) => {
        setError(error.response?.data?.message || "Error deleting user");
      });
  };

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="admin-user-list">
      <Navbar />
      <main className='MainAdmin'>
        <h2 id="titulo-admin">User List</h2>
        {users.length > 0 ? (
            <table className="user-table">
            <thead>
                <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Mail</th>
                <th>Username</th>
                <th>Admin</th>
                <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user) => (
                <tr key={user.userId}>
                    <td>{user.userId}</td>
                    <td>{user.name}</td>
                    <td>{user.email}</td>
                    <td>{user.username}</td>
                    <td>{user.admin ? "Yes" : "No"}</td>
                    <td>
                        {!user.admin && (
                            <button
                                className="delete-button"
                                onClick={() => handleDelete(user.userId)}
                            >
                                Delete User
                            </button>
                        )}
                    </td>
                </tr>
                ))}
            </tbody>
            </table>
        ) : (
            <p>No hay usuarios disponibles.</p>
        )}
      </main>
    </div>
  );
};

export default AdminUserList;

