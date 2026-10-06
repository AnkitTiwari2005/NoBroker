import React, { useState } from 'react';
import AdminLayout from './AdminLayout';
import { Search, Shield, ShieldAlert, User, MoreVertical } from 'lucide-react';
import { useToast } from '../../ToastContext';
import { User as UserType } from '../../types';

const MOCK_USERS: UserType[] = [
  { id: '1', name: 'Rahul Sharma',  email: 'rahul@example.com',  phone: '9876543210', role: 'seeker', isVerified: true,  avatarUrl: null },
  { id: '2', name: 'Priya Patel',   email: 'priya@example.com',  phone: '9876543211', role: 'owner',  isVerified: true,  avatarUrl: null },
  { id: '3', name: 'Amit Kumar',    email: 'amit@example.com',   phone: '9876543212', role: 'owner',  isVerified: false, avatarUrl: null },
  { id: '4', name: 'Neha Gupta',    email: 'neha@example.com',   phone: '9876543213', role: 'seeker', isVerified: false, avatarUrl: null },
  { id: '5', name: 'Sanjay Singh',  email: 'sanjay@example.com', phone: '9876543214', role: 'owner',  isVerified: true,  avatarUrl: null },
];

export default function AdminUsers() {
  const { showToast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<'All' | 'seeker' | 'owner'>('All');
  const [users, setUsers] = useState<UserType[]>(MOCK_USERS);

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'All' || u.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  const toggleVerification = (id: string, currentStatus: boolean) => {
    setUsers(users.map(u => u.id === id ? { ...u, isVerified: !currentStatus } : u));
    showToast(currentStatus ? 'User verification revoked' : 'User verified successfully');
  };

  const handleSuspend = (id: string) => {
    showToast('User suspended');
  };

  return (
    <AdminLayout>
      <div className="p-4 page-enter">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Users</h2>
        
        <div className="bg-white p-3 rounded-lg shadow-sm mb-4 border border-gray-200">
          <div className="relative mb-3">
            <Search className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search by name or email..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-[#1E3A5F]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex space-x-2">
            {['All', 'seeker', 'owner'].map(role => (
              <button 
                key={role}
                onClick={() => setRoleFilter(role as any)}
                className={`px-3 py-1 rounded-full text-sm font-medium capitalize btn-press ${roleFilter === role ? 'bg-[#1E3A5F] text-white' : 'bg-gray-100 text-gray-600'}`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-3">
          {filteredUsers.map(user => (
            <div key={user.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex items-center">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center text-indigo-700 font-bold text-lg mr-4">
                {user.name.charAt(0)}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold text-gray-800">{user.name}</h3>
                <p className="text-xs text-gray-500">{user.email}</p>
                <div className="flex items-center space-x-2 mt-1">
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${user.role === 'owner' ? 'bg-amber-100 text-amber-700' : 'bg-blue-100 text-blue-700'}`}>
                    {user.role}
                  </span>
                  {user.isVerified ? (
                    <span className="flex items-center text-[10px] text-green-600 bg-green-50 px-2 py-0.5 rounded font-medium">
                      <Shield className="w-3 h-3 mr-1" /> Verified
                    </span>
                  ) : (
                    <span className="flex items-center text-[10px] text-red-600 bg-red-50 px-2 py-0.5 rounded font-medium">
                      <ShieldAlert className="w-3 h-3 mr-1" /> Unverified
                    </span>
                  )}
                </div>
              </div>
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={() => toggleVerification(user.id, user.isVerified || false)}
                  className={`text-xs font-medium px-3 py-1.5 rounded-lg btn-press ${user.isVerified ? 'text-gray-600 bg-gray-100' : 'text-green-600 bg-green-50'}`}
                >
                  {user.isVerified ? 'Revoke' : 'Verify'}
                </button>
                <button onClick={() => handleSuspend(user.id)} className="text-xs font-medium text-red-600 bg-red-50 px-3 py-1.5 rounded-lg btn-press">
                  Suspend
                </button>
              </div>
            </div>
          ))}
          {filteredUsers.length === 0 && (
            <div className="text-center py-10 text-gray-500">
              No users found.
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};
