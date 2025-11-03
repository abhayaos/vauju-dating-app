import React, { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

const ADMIN_API = 'https://backend-vauju-1.onrender.com'

function SuspendUsers() {
  const navigate = useNavigate()
  const { adminToken } = useAdminAuth()
  const token = adminToken
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!token) return navigate('/admin/login')
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${ADMIN_API}/admin/users`, { headers: { 'x-admin-token': token } })
        
        if (!res.ok) {
          throw new Error(`Failed to fetch users (status ${res.status})`)
        }
        
        const data = await res.json()
        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          setUsers([])
          setError('No users found')
        }
      } catch (err) {
        console.error('Fetch error:', err)
        setUsers([])
        if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Please check your internet connection.')
        } else {
          setError(err.message || 'Failed to load users')
        }
      }
      setLoading(false)
    }
    run()
  }, [token, navigate])

  const toggle = async (id, next) => {
    try {
      const res = await fetch(`${ADMIN_API}/admin/suspend/${id}`, {
        method: 'POST', 
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ suspended: next })
      })
      
      if (!res.ok) {
        throw new Error(`Suspend failed (status ${res.status})`)
      }
      
      const data = await res.json()
      if (data && data._id) setUsers(list => list.map(u => u._id === id ? data : u))
    } catch (err) {
      console.error('Suspend error:', err)
      alert('Failed to update suspend status. Please try again.')
    }
  }

  return (
    <div className="p-6 space-y-4">
      <h1 className="text-2xl font-bold">Suspend Users</h1>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : (
        <ul className="space-y-2">
          {users.map(u => (
            <li key={u._id} className="border rounded p-3 flex items-center justify-between">
              <div>
                <div className="font-medium">{u.name}</div>
                <div className="text-sm text-gray-600">{u.email}</div>
              </div>
              <button onClick={() => toggle(u._id, !u.suspended)} className={`px-3 py-1 rounded text-white ${u.suspended ? 'bg-green-600' : 'bg-yellow-600'}`}>
                {u.suspended ? 'Unsuspend' : 'Suspend'}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default SuspendUsers