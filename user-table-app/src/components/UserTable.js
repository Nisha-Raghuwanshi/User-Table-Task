import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { FaArrowUp, FaArrowDown } from 'react-icons/fa';


const UserTable = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('id');
  const [sortOrder, setSortOrder] = useState('asc')
  const [searchInput, setSearchInput] = useState(''); 
  const [debouncedValue, setDebouncedValue] = useState('');


  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('https://jsonplaceholder.typicode.com/users');
        setUsers(response?.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load users');
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

   useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedValue(searchInput);
    }, 300); 

    return () => clearTimeout(timer); 
  }, [searchInput]);

  const handleSort = (key) => {
   const order = sortBy === key && sortOrder === 'asc' ? 'desc' : 'asc';
    setSortBy(key);
    setSortOrder(order);
  }


  const sortIcon = (key) => {
    if (sortBy !== key) return null;
    return sortOrder === 'asc' ? <FaArrowUp className="ms-1" /> : <FaArrowDown className="ms-1" />;
  }

   const sortedUsers = [...users]?.sort((a, b) => {
    const valA = a[sortBy];
    const valB = b[sortBy];

    if (typeof valA === 'string') {
      return sortOrder === 'asc'
        ? valA.localeCompare(valB)
        : valB.localeCompare(valA);
    }
    return sortOrder === 'asc' ? valA - valB : valB - valA;
  });

  const filteredUsers = sortedUsers?.filter((user) => {
    const term = debouncedValue.toLowerCase();
    return (
      user?.name?.toLowerCase().includes(term) ||
      user?.id?.toString().includes(term)
    );
  });


  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Table</h2>

       <div className="mb-3">
        <div className='col-md-3'>
        <input
          type="text"
          placeholder="Search by ID or Name..."
          className="form-control"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
        </div>
      </div>

      {loading && (
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && (
        <div className="alert alert-danger text-center" role="alert">
          {error}
        </div>
      )}

      {!loading && !error && (
        <div className="table-responsive">
        <table className="table table-bordered table-striped">
          <thead className="table-dark">
            <tr>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('id')}>
                ID {sortIcon('id')}
              </th>
              <th style={{ cursor: 'pointer' }} onClick={() => handleSort('name')}>
                Name {sortIcon('name')}
              </th>
              <th>Address (City & Zipcode)</th>
              <th>Company</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers?.length > 0 ? (
            filteredUsers?.map((user) => (
              <tr key={user?.id}>
                <td>{user?.id}</td>
                <td>{user?.name}</td>
                <td>
                  {user?.address?.city}, {user?.address?.zipcode}
                </td>
                <td>{user?.company?.name}</td>
              </tr>
            ))
          ) : (
            <tr>
                <td colSpan="4" className="text-center">
                  No matching users found.
                </td>
              </tr>
          )
        }
          </tbody>
        </table>
        </div>
      )}
    </div>
  );
};

export default UserTable;
