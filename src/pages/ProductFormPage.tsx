import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import { createProduct, getProduct, updateProduct } from '../api/produk'
import FormField from '../components/common/FormField'
import PageHeading from '../components/common/PageHeading'
import UploadCard from '../components/common/UploadCard'

interface ProductFormPageProps {
  mode: 'add' | 'edit'
}

export default function ProductFormPage({ mode }: ProductFormPageProps) {
  const isEdit = mode === 'edit'
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [form, setForm] = useState({
    nama_produk: '',
    deskripsi: '',
    price: '',
    stock: '',
    image_url: '',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (isEdit && id) {
      setLoading(true)
      getProduct(Number(id))
        .then((res) => {
          const data = res?.data ?? res
          setForm({
            nama_produk: data?.nama_produk ?? '',
            deskripsi: data?.deskripsi ?? '',
            price: String(data?.price ?? ''),
            stock: String(data?.stock ?? ''),
            image_url: data?.image_url ?? '',
          })
        })
        .catch((err) => setError(err instanceof Error ? err.message : 'Gagal memuat produk'))
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
      ...form,
      price: Number(form.price),
      stock: Number(form.stock),
    }
    try {
      if (isEdit && id) {
        await updateProduct(Number(id), payload)
      } else {
        await createProduct(payload)
      }
      navigate('/products')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Gagal menyimpan produk')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page">
      <PageHeading
        title={isEdit ? 'Edit Produk' : 'Tambah Produk'}
        dateLabel='Monday 23 Okt 2025'
        actionLabel={isEdit ? 'Simpan Produk' : 'Tambah Produk'}
        onAction={handleSubmit}
      />
      {error && <p className="form-error">{error}</p>}
      <div className="form-grid">
        <div className="form-grid__body">
          <FormField
            label='Nama Produk'
            placeholder='Masukkan Nama Produk'
            value={form.nama_produk}
            onChange={(e) => updateField('nama_produk', e.target.value)}
            disabled={loading}
          />
          <FormField
            label='Deskripsi Produk'
            type='textarea'
            placeholder='Masukkan Deskripsi Produk'
            rows={5}
            value={form.deskripsi}
            onChange={(e) => updateField('deskripsi', e.target.value)}
            disabled={loading}
          />
          <div className='form-grid__row'>
            <FormField
              label='Harga'
              placeholder='Rp.'
              type='number'
              value={form.price}
              onChange={(e) => updateField('price', e.target.value)}
              disabled={loading}
            />
            <FormField
              label='Stok'
              placeholder='0'
              type='number'
              value={form.stock}
              onChange={(e) => updateField('stock', e.target.value)}
              disabled={loading}
            />
          </div>
          <FormField
            label='Image URL'
            placeholder='https://...'
            value={form.image_url}
            onChange={(e) => updateField('image_url', e.target.value)}
            disabled={loading}
          />
        </div>
        <UploadCard title='Gambar Produk' />
      </div>
    </div>
  )
}
