import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: '',
    role: '',
    phone: '',
    address: '',
    email: '',
    status: 'active'
  });
  const [editId, setEditId] = useState(null);
  const [sellerId, setSellerId] = useState('');
  const generateSellerId = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const currentAdmin = JSON.parse(sessionStorage.getItem('user'));


  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    const res = await axios.get('http://localhost:5000/api/admin/users');
    setUsers(res.data);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/admin/users/${id}`);
    fetchUsers();
  };

  const handleEdit = (user) => {
    setForm({
      name: user.name,
      role: user.role,
      phone: user.phone,
      address: user.address || '',
      email: user.email || '',
      status: user.status || 'active'
    });
    setSellerId(user.sellerId || '');
    setEditId(user._id);
    setShowForm(true);
  };

  const handleRoleChange = (role) => {
    setForm((prev) => ({
      ...prev,
      role,
      address: '',
      email: ''
    }));

    if (role === 'seller') {
      setSellerId(generateSellerId());
    } else {
      setSellerId('');
    }
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.role) {
      alert('Please select a role.');
      return;
    }
    if (form.role === 'admin') {
      alert('Cannot create another admin!');
      return;
    }
    let payload = {
      name: form.name,
      role: form.role,
      email: form.email,
      phone: form.phone,
      status: form.status,
      ...(form.role === 'seller' && { address: form.address }),
      ...(form.role === 'seller' && { sellerId }),
      ...(editId === null && { password: 'default@123' }) // 👈 add default password on new user
    };


    let response;
    if (editId) {
      response = await axios.put(`http://localhost:5000/api/admin/users/${editId}`, payload);
    } else {
      response = await axios.post('http://localhost:5000/api/admin/users', payload);
    }
    // If seller, get sellerId from response
    if (response.data.sellerId) setSellerId(response.data.sellerId);
    setShowForm(false);
    setEditId(null);
    setForm({ name: '', role: '', phone: '', address: '', email: '', status: 'active' });
    setSellerId('');
    fetchUsers();
  };

  return (
    <div className="admin-dashboard-container">
      <div className="flex-between mb-6">
        <h2 className="title">Admin Dashboard</h2>
        <button className="btn btn-primary" onClick={() => setShowForm(true)}>Add User</button>
      </div>
      {showForm && (
        <form className="form-card" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={form.name}
            onChange={e => setForm({ ...form, name: e.target.value })}
            required
            className="input"
          />
          <select
            value={form.role}
            onChange={e => handleRoleChange(e.target.value)}
            className="input"
            required
          >
            <option value="">-- Select Role --</option>
            <option value="seller">Seller</option>
            <option value="buyer">Buyer</option>
          </select>
          <select
            value={form.status}
            onChange={e => setForm({ ...form, status: e.target.value })}
            className="input"
            required
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
          <input
            type="text"
            placeholder="Phone"
            value={form.phone}
            onChange={e => setForm({ ...form, phone: e.target.value })}
            required
            className="input"
          />
          {form.role === 'seller' && (
            <input
              type="text"
              placeholder="Address"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              className="input"
            />
          )}

          {form.role === 'seller' && sellerId && (
            <input
              type="text"
              value={sellerId}
              readOnly
              className="input input-grey"
              style={{ background: '#e5e7eb', color: '#6b7280', cursor: 'not-allowed' }}
              placeholder="Seller ID (Auto Generated)"
            />
          )}
          <input
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={e => setForm({ ...form, email: e.target.value })}
            className="input"
            required
          />
          {!editId && (
            <input
              type="text"
              value="default@123"
              readOnly
              className="input input-grey"
              style={{ background: '#e5e7eb', color: '#6b7280', cursor: 'not-allowed' }}
              placeholder="Default Password"
            />
          )}
          <button type="submit" className="btn btn-success">{editId ? 'Update' : 'Create'}</button>
          <button type="button" className="btn btn-secondary" onClick={() => { setShowForm(false); setSellerId(''); }}>Cancel</button>
        </form>
      )}
      <h3 className="subtitle">Registered Users</h3>
      <div className="table-card">
        <table className="user-table">
          <thead>
            <tr>
              <th>User No.</th>
              <th>Name</th>
              <th>Role</th>
              <th>Status</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Email</th>
              <th>Seller ID</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, idx) => (
              <tr key={user._id}>
                <td>{idx + 1}</td>
                <td>{user.name}</td>
                <td>{user.role}</td>
                <td>{user.status || '-'}</td>
                <td>{user.phone}</td>
                <td>{user.address || '-'}</td>
                <td>{user.email || '-'}</td>
                <td>{user.sellerId || '-'}</td>
                <td>
                  {user.role === 'admin' ? (
                    <span style={{ color: 'gray' }}>Protected</span>
                  ) : (
                    <>
                      <button className="btn btn-edit" onClick={() => handleEdit(user)}>Edit</button>
                      <button className="btn btn-delete" onClick={() => handleDelete(user._id)}>Delete</button>
                    </>
                  )}
                </td>


              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminDashboard;
