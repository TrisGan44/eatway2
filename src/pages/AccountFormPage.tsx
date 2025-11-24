import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { createUser, getUser, updateUser } from '../api/users'
import FormField from '../components/common/FormField'
import PageHeading from '../components/common/PageHeading'
import UploadCard from '../components/common/UploadCard'

interface AccountFormPageProps {
  mode: 'add' | 'edit'
}

export default function AccountFormPage({ mode }: AccountFormPageProps) {
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    telp: '',
    role: '',
    image: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      getUser(Number(id))
        .then((res) => {
          const data = res?.data ?? res
          setForm({
            name: data?.username ?? '',
            email: data?.email ?? '',
            username: data?.username ?? '',
            password: data?.password ?? '',
            telp: data?.telp ?? '',
            role: data?.role ?? '',
            image: data?.image ?? '',
          })
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat akun'))
        .finally(() => setLoading(false))
    }
  }, [id, isEdit])

  const updateField = (key: keyof typeof form, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    const payload = {
      email: form.email,
      password: form.password,
      username: form.username || form.name,
      telp: form.telp,
      role: form.role,
      image: form.image,
    }

    try {
      if (isEdit && id) {
        await updateUser(Number(id), payload)
      } else {
        await createUser(payload)
      }
      navigate('/accounts')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan akun')
    } finally {
      setLoading(false)
    }
  }

  const handleFile = (file?: File) => {
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        updateField('image', reader.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <div className='page'>
      <PageHeading
        title={isEdit ? 'Edit Akun' : 'Tambah Akun'}
        dateLabel='Monday 23 Okt 2025'
        actionLabel={isEdit ? 'Simpan Akun' : 'Tambah Akun'}
        onAction={handleSubmit}
      />
      {error && <p className="form-error">{error}</p>}
      <div className='form-grid'>
        <div className='form-grid__body'>
          <div className='form-grid__row'>
            <FormField
              label='Nama'
              placeholder='Masukkan Nama User'
              value={form.name}
              onChange={(e) => updateField('name', e.target.value)}
              disabled={loading}
            />
            <FormField
              label='Email'
              type='email'
              placeholder='Masukkan Email'
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              disabled={loading}
            />
          </div>
          <FormField
            label='Username'
            placeholder='Masukkan Username'
            value={form.username}
            onChange={(e) => updateField('username', e.target.value)}
            disabled={loading}
          />
          <FormField
            label='Password'
            type='password'
            placeholder='Masukkan Password'
            value={form.password}
            onChange={(e) => updateField('password', e.target.value)}
            disabled={loading}
          />
          <div className='form-grid__row'>
            <FormField
              label='Telp'
              type='tel'
              placeholder='Masukkan Telp'
              value={form.telp}
              onChange={(e) => updateField('telp', e.target.value)}
              disabled={loading}
            />
            <FormField
              label='Role'
              type='select'
              options={[
                { label: 'Admin', value: 'Admin' },
                { label: 'Kasir', value: 'Kasir' },
                { label: 'Pengguna', value: 'Pengguna' },
              ]}
              value={form.role}
              onChange={(e) => updateField('role', e.target.value)}
              disabled={loading}
            />
          </div>
          <FormField
            label='Image URL'
            placeholder='https://...'
            value={form.image}
            onChange={(e) => updateField('image', e.target.value)}
            disabled={loading}
          />
        </div>
        <UploadCard
          title='Foto Pengguna'
          onFileSelect={handleFile}
          highlightLabel='Click here'
          description='to upload or drop files here'
        />
      </div>
    </div>
  )
}
