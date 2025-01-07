// Users.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { User } from '../constant/type';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios'
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';

interface UsersProps {
  users: User[];
}

axios.interceptors.response.use(
    response => response,
    error => {
        if (error.response?.status === 401 || error.response?.status === 403) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

const Users: React.FC<UsersProps> = () => {
    const navigate = useNavigate();
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);


    const fetchUsers = useCallback(async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching users...');
            const token = localStorage.getItem('token');
            console.log('Token:', token);
            if (!token) {
                navigate('/login');
                return;
            }
            const response = await axios.get<User[]>(`${API_BASE_URL}/users`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                validateStatus: (status) => status === 200
            });
            console.log('Response:', response);
            setUsers(response.data);
        } catch (error) {
            setUsers([]);
            if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
                navigate('/login');
                localStorage.removeItem('token');
                return;
            }
        } finally {
            setIsLoading(false);
        }
    }, [navigate]);

      useEffect(() => {
        fetchUsers();
    }, [fetchUsers]); 
    
      const handleAddUser = async (userData: Omit<User, '_id'>) => {
        const token = localStorage.getItem('token');
        if (!token) {
            navigate('/login');
            return;
        }
        try {
          const response = await axios.post<User>(`${API_BASE_URL}/users`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          });
          setUsers([...users, response.data]);
        } catch (error) {
          if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            navigate('/login');
            localStorage.removeItem('token');
            return;
          } else {
            console.error('Error adding user:', error);
            setError('Failed to add user. Please try again.');
          }
        }
      };
    
      const handleEditUser = async (userId: string, userData: Omit<User, '_id'>) => {
        const token = localStorage.getItem('token');  
        if (!token) {
            navigate('/login');
            return;
        }
        try {
          const response = await axios.put<User>(`${API_BASE_URL}/users/${userId}`, userData, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
          });
          setUsers(users.map(user => user._id === userId ? response.data : user));
        } catch (error) {
          if (axios.isAxiosError(error) && (error.response?.status === 401 || error.response?.status === 403)) {
            navigate('/login');
            localStorage.removeItem('token');
            return;
          } else {
            console.error('Error updating user:', error);
            setError('Failed to update user. Please try again.');
          }
        }
      };


      const handleAddClick = () => {
        setEditingUser(null);
        setIsFormOpen(true);
      };

      const handleEditClick = (user: User) => {
        setEditingUser(user);
        setIsFormOpen(true);
      };

      const handleFormSubmit = (userData: Omit<User, '_id'>) => {
        if (editingUser) {
          handleEditUser(editingUser._id, userData);
        } else {
            handleAddUser(userData);
        }
        setIsFormOpen(false);
      };
    
      const handleFormCancel = () => {
        setIsFormOpen(false);
      };


  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-green-600">Users</h2>
        <button
          onClick={handleAddClick}
          className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
        >
          Add User
        </button>
      </div>
      {isFormOpen && (
        <div className="mb-4">
          <UserForm
            user={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white">
          <thead className="bg-green-100 text-green-700">
            <tr>
              <th className="py-2 px-4 text-left">Email</th>
              <th className="py-2 px-4 text-left">First Name</th>
              <th className="py-2 px-4 text-left">Last Name</th>
              <th className="py-2 px-4 text-left">User Type</th>
              <th className="py-2 px-4 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id} className="border-b border-gray-200 hover:bg-gray-50">
                <td className="py-2 px-4 text-gray-800">{user.email}</td>
                <td className="py-2 px-4 text-gray-800">{user.firstName}</td>
                <td className="py-2 px-4 text-gray-800">{user.lastName}</td>
                <td className="py-2 px-4 text-gray-800">{user.userType}</td>
                <td className="py-2 px-4">
                  <button
                    onClick={() => handleEditClick(user)}
                    className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-1 px-2 rounded text-sm"
                  >
                    Edit
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {isLoading && <div>Loading...</div>}
      {error && <div className="text-red-500">{error}</div>}
    </div>
  );
};

export default Users;