import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import DataTable from '../components/common/DataTable'
import PageHeading from '../components/common/PageHeading'
import { deleteUser, getUsers } from '../api/users'
import { systemIcons } from '../data/mock'
import { useOutletContext } from 'react-router-dom'

interface ApiUser {
  user_id: number
  email: string
  password: string
  username: string
  telp: string
  role: string
  image?: string
}

export default function AccountsPage() {
  const navigate = useNavigate()
  const [users, setUsers] = useState<ApiUser[]>([])
  const outletContext = useOutletContext<{ search?: string }>()
  const search = outletContext?.search ?? ''
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const loadUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await getUsers()
      const rows = Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []
      setUsers(rows)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal memuat akun')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void loadUsers()
  }, [])

  const handleDelete = async (id: number) => {
    const confirmDelete = window.confirm('Hapus akun ini?')
    if (!confirmDelete) return
    try {
      await deleteUser(id)
      await loadUsers()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menghapus akun')
    }
  }

  const filtered = users.filter((u) => {
    const term = search.toLowerCase()
    return (
      u.username?.toLowerCase().includes(term) ||
      u.email?.toLowerCase().includes(term) ||
      u.role?.toLowerCase().includes(term)
    )
  })

  const columns = useMemo(
    () => [
      { label: 'ID', key: 'user_id', width: '80px' },
      { label: 'Email', key: 'email' },
      { label: 'Username', key: 'username' },
      { label: 'Password', key: 'password' },
      { label: 'Telp', key: 'telp' },
      { label: 'Image', key: 'image', render: (row: ApiUser) => row.image || '-' },
      { label: 'Role', key: 'role' },
      {
        label: 'Aksi',
        key: 'actions',
        render: (row: ApiUser) => (
          <div className="table-actions">
            <img
              src={systemIcons.delete}
              alt='Delete'
              onClick={() => handleDelete(row.user_id)}
            />
            <img
              src={systemIcons.edit}
              alt='Edit'
              onClick={() => navigate(`/accounts/${row.user_id}/edit`)}
            />
          </div>
        ),
      },
    ],
    [navigate],
  )

  return (
    <div className='page'>
      <PageHeading
        title='Akun'
        dateLabel='Monday 23 Okt 2025'
        actionLabel='Tambah Akun'
        onAction={() => navigate('/accounts/add')}
      />
      <h3>Tabel Akun</h3>
      {error && <p className="form-error">{error}</p>}
      {loading ? <p>Memuat data...</p> : <DataTable columns={columns} rows={filtered} zebra />}
      {!loading && filtered.length === 0 && <p>Tidak ada data akun.</p>}
    </div>
  )
}
