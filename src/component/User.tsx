// Users.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { User, UserType } from '../constant/type';
import { API_BASE_URL } from '../constant/data';
import axios from 'axios';
import UserForm from './UserForm';
import { useNavigate } from 'react-router-dom';
import { FaUserPlus, FaEdit, FaSpinner } from 'react-icons/fa';

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

// Add loading skeleton for table
const TableLoadingSkeleton = () => (
  <div className="animate-pulse">
    <div className="h-12 bg-gray-200 rounded-t-lg mb-4"></div>
    {[...Array(5)].map((_, index) => (
      <div key={index} className="h-16 bg-gray-100 mb-2"></div>
    ))}
  </div>
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {error && (
        <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900">Users Management</h2>
        <button
          onClick={handleAddClick}
          className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors duration-200"
        >
          <FaUserPlus className="-ml-1 mr-2 h-4 w-4" />
          Add User
        </button>
      </div>

      {isFormOpen && (
        <div className="mb-8">
          <UserForm
            user={editingUser || undefined}
            onSubmit={handleFormSubmit}
            onCancel={handleFormCancel}
          />
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        {isLoading ? (
          <div className="p-4">
            <TableLoadingSkeleton />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    First Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Last Name
                  </th>
                  <th scope="col" className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    User Type
                  </th>
                  <th scope="col" className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {users.map((user, index) => (
                  <tr 
                    key={user._id}
                    className={`hover:bg-gray-50 transition-colors duration-150 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.firstName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {user.lastName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
                        ${user.userType === UserType.ADMIN || user.userType === UserType.SU ? 'bg-purple-100 text-purple-800' : 
                          user.userType === UserType.USER ? 'bg-blue-100 text-blue-800' : 
                          'bg-green-100 text-green-800'}`}>
                        {user.userType}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={() => handleEditClick(user)}
                        className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-150"
                      >
                        <FaEdit className="mr-1.5 h-3 w-3" />
                        Edit
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {users.length === 0 && !isLoading && (
              <div className="text-center py-12">
                <p className="text-sm text-gray-500">No users found</p>
              </div>
            )}
          </div>
        )}
      </div>

      {isLoading && (
        <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center">
          <div className="bg-white p-4 rounded-full">
            <FaSpinner className="h-8 w-8 text-green-500 animate-spin" />
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;