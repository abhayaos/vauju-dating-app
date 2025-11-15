import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdminAuth } from '../context/AdminAuthContext'

// Use environment variable for API URL or fallback to proxy
const ADMIN_API = import.meta.env.VITE_API_URL || '/api'

function ManageUsers() {
  const navigate = useNavigate()
  const { adminToken } = useAdminAuth()
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState({})
  const [token, setToken] = useState(adminToken || '')
  const [error, setError] = useState('')

  useEffect(() => {
    setToken(adminToken || '');
  }, [adminToken]);

  useEffect(() => {
    if (!token) {
      navigate('/admin/login')
      return
    }

    const controller = new AbortController()
    const run = async () => {
      setLoading(true)
      setError('')
      try {
        const res = await fetch(`${ADMIN_API}/admin/users${q ? `?q=${encodeURIComponent(q)}` : ''}`, {
          headers: { 'x-admin-token': token },
          signal: controller.signal,
        })

        // Check if response is OK
        if (!res.ok) {
          let errorMessage = `Server error (status ${res.status})`
          try {
            const contentType = res.headers.get('content-type')
            if (contentType && contentType.includes('application/json')) {
              const data = await res.json()
              errorMessage = data.message || errorMessage
            }
          } catch (e) {
            // Ignore JSON parsing errors
          }
          throw new Error(errorMessage)
        }

        // Parse JSON response
        let data
        try {
          data = await res.json()
        } catch (e) {
          throw new Error('Invalid response format from server')
        }

        if (Array.isArray(data)) {
          setUsers(data)
        } else {
          setUsers([])
          setError('No users found')
        }
      } catch (err) {
        if (err.name === 'AbortError') return
        setUsers([])
        // More descriptive error messages
        if (err.message.includes('Failed to fetch')) {
          setError('Unable to connect to the server. Please check your internet connection and try again.')
        } else {
          setError(err.message || 'Failed to load users')
        }
      } finally {
        setLoading(false)
      }
    }

    run()
    return () => controller.abort()
  }, [q, token, navigate])

  const guardToken = () => {
    if (!token) {
      navigate('/admin/login')
      return false
    }
    return true
  }

  const doDelete = async (id) => {
    if (!guardToken()) return
    if (!window.confirm('Delete this user?')) return
    setBusy((x) => ({ ...x, [id]: true }))
    try {
      const res = await fetch(`${ADMIN_API}/admin/users/${id}`, {
        method: 'DELETE',
        headers: { 'x-admin-token': token },
      })
      if (res.ok) setUsers((list) => list.filter((u) => String(u._id) !== String(id)))
      else setError('Failed to delete user')
    } catch (err) {
      console.error('Delete error:', err)
      setError('Failed to delete user. Please try again.')
    } finally {
      setBusy((x) => ({ ...x, [id]: false }))
    }
  }

  const toggleVerify = async (id, next) => {
    if (!guardToken()) return
    setBusy((x) => ({ ...x, [id]: true }))
    try {
      const res = await fetch(`${ADMIN_API}/admin/verify/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ verified: next }),
      })
      
      if (!res.ok) {
        throw new Error(`Verification failed (status ${res.status})`)
      }
      
      const data = await res.json().catch(() => null)
      if (data && data._id) setUsers((list) => list.map((u) => (u._id === id ? data : u)))
      else setError('Failed to update verification status')
    } catch (err) {
      console.error('Verify error:', err)
      setError('Failed to update verification status. Please try again.')
    } finally {
      setBusy((x) => ({ ...x, [id]: false }))
    }
  }

  const toggleSuspend = async (id, next) => {
    if (!guardToken()) return
    setBusy((x) => ({ ...x, [id]: true }))
    try {
      const res = await fetch(`${ADMIN_API}/admin/suspend/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'x-admin-token': token },
        body: JSON.stringify({ suspended: next }),
      })
      
      if (!res.ok) {
        throw new Error(`Suspend failed (status ${res.status})`)
      }
      
      const data = await res.json().catch(() => null)
      if (data && data._id) setUsers((list) => list.map((u) => (u._id === id ? data : u)))
      else setError('Failed to update suspension status')
    } catch (err) {
      console.error('Suspend error:', err)
      setError('Failed to update suspension status. Please try again.')
    } finally {
      setBusy((x) => ({ ...x, [id]: false }))
    }
  }

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-bold">Manage Users</h1>
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search name or email"
          className="border p-2 rounded flex-1"
        />
      </div>
      {error && <div className="text-red-600 text-sm">{error}</div>}
      {loading ? (
        <div>Loading…</div>
      ) : users.length === 0 ? (
        <div className="text-gray-500 text-center">No users to display</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full border">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-2 text-left">Name</th>
                <th className="p-2 text-left">Email</th>
                <th className="p-2 text-left">Verified</th>
                <th className="p-2 text-left">Visible</th>
                <th className="p-2 text-left">Approved</th>
                <th className="p-2 text-left">Suspended</th>
                <th className="p-2 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id} className="border-t">
                  <td className="p-2">{u.name}</td>
                  <td className="p-2">{u.email}</td>
                  <td className="p-2">{u.isVerified ? 'Yes' : 'No'}</td>
                  <td className="p-2">{u.visible ? 'On' : 'Off'}</td>
                  <td className="p-2">{u.visibilityApproved ? 'Yes' : u.visibilityRequested ? 'Requested' : 'No'}</td>
                  <td className="p-2">{u.suspended ? 'Yes' : 'No'}</td>
                  <td className="p-2 flex flex-wrap gap-2">
                    <button
                      onClick={() => toggleVerify(u._id, !u.isVerified)}
                      disabled={!!busy[u._id]}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      {u.isVerified ? 'Unverify' : 'Verify'}
                    </button>
                    <button
                      onClick={() => toggleSuspend(u._id, !u.suspended)}
                      disabled={!!busy[u._id]}
                      className="px-2 py-1 bg-yellow-600 text-white rounded"
                    >
                      {u.suspended ? 'Unsuspend' : 'Suspend'}
                    </button>
                    <button
                      onClick={() => doDelete(u._id)}
                      disabled={!!busy[u._id]}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => {
                        if (u.username) navigate(`/@${u.username}`)
                        else navigate(`/profile/${u._id}`)
                      }}
                      className="px-2 py-1 bg-gray-200 text-gray-800 rounded"
                    >
                      View Profile
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

export default ManageUsers