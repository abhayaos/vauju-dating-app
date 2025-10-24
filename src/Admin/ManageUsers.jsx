import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

const ADMIN_API = 'https://backend-vauju-1.onrender.com'

function ManageUsers() {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [q, setQ] = useState('')
  const [loading, setLoading] = useState(true)
  const [busy, setBusy] = useState({})
  const [token, setToken] = useState(() => localStorage.getItem('adminToken') || '')
  const [error, setError] = useState('')

  useEffect(() => {
    const syncToken = () => setToken(localStorage.getItem('adminToken') || '')
    window.addEventListener('storage', syncToken)
    window.addEventListener('adminLogin', syncToken)
    window.addEventListener('adminLogout', syncToken)
    return () => {
      window.removeEventListener('storage', syncToken)
      window.removeEventListener('adminLogin', syncToken)
      window.removeEventListener('adminLogout', syncToken)
    }
  }, [])

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

        const contentType = res.headers.get('content-type') || ''
        const data = contentType.includes('application/json') ? await res.json().catch(() => null) : null

        if (!res.ok) {
          const message = data && typeof data === 'object' ? data.message : null
          throw new Error(message || `Server error (status ${res.status})`)
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
        setError(err.message || 'Failed to load users')
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
      const data = await res.json().catch(() => null)
      if (res.ok && data && data._id) setUsers((list) => list.map((u) => (u._id === id ? data : u)))
      else setError('Failed to update verification status')
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
      const data = await res.json().catch(() => null)
      if (res.ok && data && data._id) setUsers((list) => list.map((u) => (u._id === id ? data : u)))
      else setError('Failed to update suspension status')
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
