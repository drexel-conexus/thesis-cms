// Users.tsx
import React, { useEffect, useState } from 'react';
import { User } from '../constant/type';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios'
import UserForm from './UserForm';
interface UsersProps {
  users: User[];
}

const Users: React.FC<UsersProps> = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);

    useEffect(() => {
          fetchUsers();
      }, []);

    const fetchUsers = async () => {
        setIsLoading(true);
        setError(null);
        try {
          const response = await axios.get<User[]>(`${API_BASE_URL}/users`);
          setUsers(response.data);
        } catch (error) {
          console.error('Error fetching users:', error);
          setError('Failed to fetch users. Please try again later.');
        } finally {
          setIsLoading(false);
        }
      };
    
      const handleAddUser = async (userData: Omit<User, '_id'>) => {
        try {
          const response = await axios.post<User>(`${API_BASE_URL}/users`, userData);
          setUsers([...users, response.data]);
        } catch (error) {
          console.error('Error adding user:', error);
          setError('Failed to add user. Please try again.');
        }
      };
    
      const handleEditUser = async (userId: string, userData: Omit<User, '_id'>) => {
        try {
          const response = await axios.put<User>(`${API_BASE_URL}/users/${userId}`, userData);
          setUsers(users.map(user => user._id === userId ? response.data : user));
        } catch (error) {
          console.error('Error updating user:', error);
          setError('Failed to update user. Please try again.');
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
    </div>
  );
};

export default Users;