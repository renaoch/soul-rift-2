"use client";
import AdminLayout from '@/components/layout/AdminLayout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

import { 
  Users,
  Search,
  Shield,
  Sparkles,
  CheckCircle2,
  User,
  Palette,
  Crown,
  Trash2,
  Edit,
  X,
  Calendar,
  Mail,
  DollarSign,
  Ban,
  Key
} from 'lucide-react';
import { toast } from 'sonner';

interface UserData {
  id: string;
  email: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  avatar_url: string;
  role: string;
  created_at: string;
  artist_profiles?: {
    id: string;
    display_name: string;
    is_verified: boolean;
    is_active: boolean;
    total_earnings: number;
    total_sales: number;
  }[];
}

interface Stats {
  total: number;
  customers: number;
  artists: number;
  admins: number;
}

export default function AdminUsersPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);
  const [stats, setStats] = useState<Stats | null>(null);
  const [roleFilter, setRoleFilter] = useState<'all' | 'customer' | 'artist' | 'admin'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showBanModal, setShowBanModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
  const [newRole, setNewRole] = useState('');
  const [adminSecret, setAdminSecret] = useState('');

  useEffect(() => {
    fetchUsers();
  }, [roleFilter]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const url = `/api/admin/users?role=${roleFilter}${searchQuery ? `&search=${searchQuery}` : ''}`;
      
      const response = await fetch(url);
      const result = await response.json();

      if (result.success) {
        setUsers(result.users);
        setStats(result.stats);
      } else {
        if (result.error?.message.includes('Unauthorized')) {
          toast.error('Access denied - Admin only');
          router.push('/');
        } else {
          toast.error('Failed to load users');
        }
      }
    } catch (error) {
      toast.error('Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  const openRoleModal = (user: UserData) => {
    setSelectedUser(user);
    setNewRole(user.role);
    setAdminSecret('');
    setShowRoleModal(true);
  };

  const handleUpdateRole = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          userId: selectedUser.id, 
          role: newRole,
          adminSecret: newRole === 'admin' ? adminSecret : undefined
        }),
      });

      const result = await response.json();

      if (result.success) {
        toast.success('Role updated successfully!');
        fetchUsers();
        setShowRoleModal(false);
        setSelectedUser(null);
        setAdminSecret('');
      } else {
        toast.error(result.error?.message || 'Failed to update role');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const openBanModal = (user: UserData) => {
    setSelectedUser(user);
    setShowBanModal(true);
  };

  const handleBanUser = async () => {
    if (!selectedUser) return;

    try {
      const response = await fetch(`/api/admin/users?id=${selectedUser.id}`, {
        method: 'DELETE',
      });

      const result = await response.json();

      if (result.success) {
        toast.success('User banned successfully');
        fetchUsers();
        setShowBanModal(false);
        setSelectedUser(null);
      } else {
        toast.error(result.error?.message || 'Failed to ban user');
      }
    } catch (error) {
      toast.error('Something went wrong');
    }
  };

  const handleSearch = () => {
    fetchUsers();
  };

  const getRoleBadge = (role: string) => {
    const badges: Record<string, { icon: any; color: string; label: string; bg: string }> = {
      admin: { icon: Crown, color: '#ff6b35', label: 'Admin', bg: 'bg-[#ff6b35]/10' },
      artist: { icon: Palette, color: '#a855f7', label: 'Artist', bg: 'bg-purple-500/10' },
      customer: { icon: User, color: '#00d9ff', label: 'Customer', bg: 'bg-cyan-500/10' },
      banned: { icon: Ban, color: '#ef4444', label: 'Banned', bg: 'bg-red-500/10' },
    };

    const badge = badges[role] || badges.customer;
    const Icon = badge.icon;

    return (

        
      <div 
        className="px-3 py-1.5 rounded-full flex items-center gap-1.5 border"
        style={{
          background: `${badge.color}15`,
          borderColor: `${badge.color}30`,
        }}
      >
        <Icon className="w-3.5 h-3.5" style={{ color: badge.color }} />
        <span className="text-xs font-bold" style={{ color: badge.color }}>{badge.label}</span>
      </div>
    );
  };

  if (loading) {
    return (
      <>


        <div className="min-h-screen bg-black flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-[#ff6b35] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
            <p className="text-white text-lg">Loading users...</p>
          </div>
        </div>

      </>
    );
  }

  return (
    <>
<AdminLayout>
      
      <main className="relative w-full bg-black min-h-screen pt-20 pb-16">
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: 'radial-gradient(circle at 1px 1px, #ff6b35 1px, transparent 0)',
              backgroundSize: '40px 40px',
            }}
          />
        </div>

        <div className="absolute top-32 left-16 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#ff6b35]" />
        <div className="absolute bottom-32 right-16 w-72 h-72 rounded-full blur-[120px] opacity-15 bg-[#00d9ff]" />

        <div className="max-w-[1600px] mx-auto px-6 relative z-10">
          {/* Header */}
          <div className="mb-8">
            <div 
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl backdrop-blur-2xl border shadow-xl mb-6 hover:scale-105 transition-all"
              style={{
                background: 'linear-gradient(135deg, #ff6b3515, #ff313110)',
                borderColor: '#ff6b3530',
              }}
            >
              <div className="w-2 h-2 rounded-full animate-pulse bg-[#ff6b35]" />
              <span className="text-xs font-bold tracking-wider text-white uppercase">User Management</span>
              <Sparkles className="w-3 h-3 text-white opacity-60" />
            </div>

            <h1 className="text-5xl font-black text-white mb-3">Manage Users</h1>
            <p className="text-base text-gray-400">Control user roles and permissions</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4 mb-6">
            {[
              { icon: Users, label: 'Total', value: stats?.total || 0, color: '#ff6b35' },
              { icon: User, label: 'Customers', value: stats?.customers || 0, color: '#00d9ff' },
              { icon: Palette, label: 'Artists', value: stats?.artists || 0, color: '#a855f7' },
              { icon: Crown, label: 'Admins', value: stats?.admins || 0, color: '#39ff14' },
            ].map((stat, idx) => (
              <div 
                key={idx}
                className="rounded-xl backdrop-blur-2xl border p-5 shadow-lg hover:scale-105 transition-all"
                style={{
                  background: `linear-gradient(135deg, ${stat.color}08, transparent)`,
                  borderColor: `${stat.color}20`,
                }}
              >
                <stat.icon className="w-7 h-7 mb-2" style={{ color: stat.color }} />
                <p className="text-4xl font-black text-white mb-1">{stat.value}</p>
                <p className="text-xs text-gray-400 uppercase tracking-wider font-bold">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Filters */}
          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Search by username or email..."
                className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white text-sm placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
              />
            </div>

            <button
              onClick={handleSearch}
              className="px-5 py-3 rounded-xl bg-[#ff6b35] text-white text-sm font-bold hover:bg-[#ff5525] transition-all hover:scale-105"
            >
              Search
            </button>

            {['all', 'customer', 'artist', 'admin'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role as any)}
                className={`px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                  roleFilter === role
                    ? 'bg-[#ff6b35] text-white scale-105'
                    : 'bg-black/40 text-gray-400 hover:bg-white/5 hover:scale-105'
                }`}
              >
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </button>
            ))}
          </div>

          {/* Users Table */}
          {users.length > 0 ? (
            <div 
              className="rounded-2xl backdrop-blur-2xl border overflow-hidden shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ff6b3508, transparent)',
                borderColor: '#ff6b3520',
              }}
            >
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Contact</th>
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Role</th>
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Performance</th>
                      <th className="text-left p-5 text-xs font-bold text-gray-400 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map((user) => {
                      const artistProfile = user.artist_profiles?.[0];
                      return (
                        <tr key={user.id} className="border-b border-white/5 hover:bg-white/[0.02] transition-all group">
                          <td className="p-5">
                            <div className="flex items-center gap-3">
                              <div className="relative">
                                {user.avatar_url ? (
                                  <div className="relative w-12 h-12 rounded-xl overflow-hidden border border-white/10 group-hover:border-[#ff6b35]/30 transition-all">
                                    <Image src={user.avatar_url} alt={user.username} fill className="object-cover" />
                                  </div>
                                ) : (
                                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff3131]/20 border border-[#ff6b35]/30 flex items-center justify-center group-hover:scale-110 transition-all">
                                    <User className="w-6 h-6 text-[#ff6b35]" />
                                  </div>
                                )}
                                {artistProfile?.is_verified && (
                                  <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-blue-500 border-2 border-black flex items-center justify-center">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                )}
                              </div>
                              <div>
                                <p className="text-white font-bold text-sm">{user.username}</p>
                                <p className="text-gray-500 text-xs">
                                  {user.first_name || user.last_name ? `${user.first_name || ''} ${user.last_name || ''}`.trim() : 'No name'}
                                </p>
                              </div>
                            </div>
                          </td>
                          <td className="p-5">
                            <div className="space-y-1">
                              <p className="text-gray-300 text-sm flex items-center gap-2">
                                <Mail className="w-3 h-3 text-gray-500" />
                                {user.email}
                              </p>
                              {user.phone && (
                                <p className="text-gray-500 text-xs flex items-center gap-2">
                                  <span className="w-3" />
                                  {user.phone}
                                </p>
                              )}
                            </div>
                          </td>
                          <td className="p-5">
                            {getRoleBadge(user.role)}
                          </td>
                          <td className="p-5">
                            <p className="text-gray-400 text-sm flex items-center gap-2">
                              <Calendar className="w-3.5 h-3.5" />
                              {new Date(user.created_at).toLocaleDateString('en-US', { 
                                month: 'short', 
                                day: 'numeric', 
                                year: 'numeric' 
                              })}
                            </p>
                          </td>
                          <td className="p-5">
                            {artistProfile ? (
                              <div className="space-y-1">
                                <p className="text-white text-sm font-bold flex items-center gap-1.5">
                                  <DollarSign className="w-3.5 h-3.5 text-green-400" />
                                  ₹{artistProfile.total_earnings?.toFixed(2) || '0.00'}
                                </p>
                                <p className="text-gray-500 text-xs">{artistProfile.total_sales || 0} sales</p>
                              </div>
                            ) : (
                              <p className="text-gray-600 text-xs">No data</p>
                            )}
                          </td>
                          <td className="p-5">
                            <div className="flex gap-2">
                              <button
                                onClick={() => openRoleModal(user)}
                                className="px-4 py-2 rounded-lg bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold hover:bg-blue-500/30 transition-all hover:scale-105 flex items-center gap-1.5"
                              >
                                <Edit className="w-3.5 h-3.5" />
                                Role
                              </button>
                              {user.role !== 'banned' && (
                                <button
                                  onClick={() => openBanModal(user)}
                                  className="px-4 py-2 rounded-lg bg-red-500/20 border border-red-500/40 text-red-400 text-xs font-bold hover:bg-red-500/30 transition-all hover:scale-105 flex items-center gap-1.5"
                                >
                                  <Ban className="w-3.5 h-3.5" />
                                  Ban
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          ) : (
            <div className="text-center py-20">
              <Users className="w-20 h-20 text-gray-600 mx-auto mb-6" />
              <h3 className="text-2xl font-bold text-white mb-2">No users found</h3>
              <p className="text-gray-400 text-sm">
                {searchQuery ? 'Try a different search term' : `No ${roleFilter} users found`}
              </p>
            </div>
          )}
        </div>

        {/* Role Change Modal */}
        {showRoleModal && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
            onClick={() => setShowRoleModal(false)}
          >
            <div 
              className="max-w-md w-full rounded-2xl border p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #3b82f608, #1e40af08)',
                borderColor: '#3b82f630',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/20 border border-blue-500/40 flex items-center justify-center">
                    <Shield className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Change Role</h3>
                    <p className="text-sm text-gray-400">@{selectedUser.username}</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-400 mb-3 uppercase tracking-wider">
                    Select New Role
                  </label>
                  <select
                    value={newRole}
                    onChange={(e) => setNewRole(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white focus:outline-none focus:border-blue-500/50 transition-all"
                  >
                    <option value="customer">Customer</option>
                    <option value="artist">Artist</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>

                {newRole === 'admin' && (
                  <div className="p-4 rounded-xl bg-[#ff6b35]/10 border border-[#ff6b35]/30">
                    <div className="flex items-center gap-2 mb-3">
                      <Key className="w-4 h-4 text-[#ff6b35]" />
                      <label className="text-xs font-bold text-[#ff6b35] uppercase tracking-wider">
                        Admin Secret Code *
                      </label>
                    </div>
                    <input
                      type="password"
                      value={adminSecret}
                      onChange={(e) => setAdminSecret(e.target.value)}
                      placeholder="Enter admin secret code"
                      className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/10 text-white placeholder-gray-600 focus:outline-none focus:border-[#ff6b35]/50 transition-all"
                    />
                    <p className="text-xs text-gray-400 mt-2">🔒 Required for admin promotion</p>
                  </div>
                )}
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowRoleModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateRole}
                  className="flex-1 py-3 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 text-sm font-bold hover:bg-blue-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Update Role
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Ban Modal */}
        {showBanModal && selectedUser && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm z-[70] flex items-center justify-center p-6"
            onClick={() => setShowBanModal(false)}
          >
            <div 
              className="max-w-md w-full rounded-2xl border p-6 shadow-2xl"
              style={{
                background: 'linear-gradient(135deg, #ef444408, #7f1d1d08)',
                borderColor: '#ef444430',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-14 h-14 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center">
                    <Ban className="w-7 h-7 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-xl font-black text-white">Ban User</h3>
                    <p className="text-sm text-gray-400">This action is reversible</p>
                  </div>
                </div>
                <button
                  onClick={() => setShowBanModal(false)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 flex items-center justify-center transition-all"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-black/40 border border-white/10">
                <div className="flex items-center gap-3">
                  {selectedUser.avatar_url ? (
                    <div className="relative w-14 h-14 rounded-xl overflow-hidden border border-white/10">
                      <Image src={selectedUser.avatar_url} alt={selectedUser.username} fill className="object-cover" />
                    </div>
                  ) : (
                    <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#ff6b35]/20 to-[#ff3131]/20 border border-[#ff6b35]/30 flex items-center justify-center">
                      <User className="w-7 h-7 text-[#ff6b35]" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-white font-bold mb-1">{selectedUser.username}</p>
                    <p className="text-xs text-gray-500 mb-2">{selectedUser.email}</p>
                    {getRoleBadge(selectedUser.role)}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 mb-6">
                <p className="text-sm text-gray-300">
                  This will ban the user and prevent them from accessing the platform. You can unban them later by changing their role.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowBanModal(false)}
                  className="flex-1 py-3 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-bold hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleBanUser}
                  className="flex-1 py-3 rounded-xl bg-red-500/20 border border-red-500/40 text-red-400 text-sm font-bold hover:bg-red-500/30 transition-all flex items-center justify-center gap-2"
                >
                  <Ban className="w-4 h-4" />
                  Ban User
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
      </AdminLayout>
    </>
  );
}
