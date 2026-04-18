'use client'
import { useState } from 'react'
import Sidebar from '@/components/admin/Sidebar'

const initialDishes = [
  { id: 'D01', name: 'Butter Chicken', category: 'Main Course', price: 320, veg: false, available: true, description: 'Creamy tomato curry with tender chicken' },
  { id: 'D02', name: 'Paneer Tikka Masala', category: 'Main Course', price: 280, veg: true, available: true, description: 'Grilled paneer in rich spiced gravy' },
  { id: 'D03', name: 'Garlic Naan', category: 'Breads', price: 60, veg: true, available: true, description: 'Tandoor baked bread' },
  { id: 'D04', name: 'Caesar Salad', category: 'Starters', price: 180, veg: true, available: true, description: 'Fresh lettuce with croutons' },
  { id: 'D05', name: 'Seekh Kebab', category: 'Starters', price: 350, veg: false, available: false, description: 'Minced meat kebabs' },
  { id: 'D06', name: 'Gulab Jamun', category: 'Desserts', price: 120, veg: true, available: true, description: 'Sweet milk dumplings' },
]

export default function DishesPage() {
  const [dishes, setDishes] = useState(initialDishes)
  const [showForm, setShowForm] = useState(false)
  const [editDish, setEditDish] = useState(null)
  const [form, setForm] = useState({ name: '', category: 'Main Course', price: '', veg: true, available: true, description: '' })

  function openAdd() { setForm({ name: '', category: 'Main Course', price: '', veg: true, available: true, description: '' }); setEditDish(null); setShowForm(true) }
  function openEdit(dish) { setForm({ ...dish }); setEditDish(dish); setShowForm(true) }
  function handleSave() {
    if (editDish) setDishes(dishes.map(d => d.id === editDish.id ? { ...form, id: editDish.id } : d))
    else setDishes([...dishes, { ...form, id: `D0${dishes.length + 1}` }])
    setShowForm(false)
  }
  function toggleAvailable(id) { setDishes(dishes.map(d => d.id === id ? { ...d, available: !d.available } : d)) }
  function handleDelete(id) { if (confirm('Remove this dish?')) setDishes(dishes.filter(d => d.id !== id)) }

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: '#0d0d0d' }}>
      <Sidebar />
      <main className="flex-1 p-10">
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="font-serif text-3xl font-semibold text-white mb-1">Menu Management</h1>
            <p className="text-sm" style={{ color: '#6B6560' }}>Control what dishes the AI assistant presents to customers</p>
          </div>
          <button onClick={openAdd}
            className="px-6 py-2.5 text-xs font-medium tracking-widest uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.1em' }}>
            Add Dish
          </button>
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
            <div className="w-full max-w-lg mx-4 p-8" style={{ backgroundColor: '#161616', border: '1px solid #333' }}>
              <h2 className="font-serif text-2xl font-semibold text-white mb-6">{editDish ? 'Edit Dish' : 'Add New Dish'}</h2>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Dish Name</label>
                    <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                      className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="Butter Chicken"
                      style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }} />
                  </div>
                  <div>
                    <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Price (Rs.)</label>
                    <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })}
                      className="w-full px-4 py-3 text-sm focus:outline-none" placeholder="320"
                      style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }} />
                  </div>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Category</label>
                  <select value={form.category} onChange={e => setForm({ ...form, category: e.target.value })}
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }}>
                    {['Starters', 'Main Course', 'Breads', 'Rice & Biryani', 'Desserts', 'Drinks'].map(c => <option key={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>Description</label>
                  <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2}
                    className="w-full px-4 py-3 text-sm focus:outline-none"
                    style={{ backgroundColor: '#222', border: '1px solid #333', color: '#fff', fontFamily: 'DM Sans, sans-serif' }} />
                </div>
                <div className="flex gap-6">
                  <label className="flex items-center gap-2 text-sm" style={{ color: '#6B6560' }}>
                    <input type="checkbox" checked={form.veg} onChange={e => setForm({ ...form, veg: e.target.checked })} />
                    Vegetarian
                  </label>
                  <label className="flex items-center gap-2 text-sm" style={{ color: '#6B6560' }}>
                    <input type="checkbox" checked={form.available} onChange={e => setForm({ ...form, available: e.target.checked })} />
                    Available
                  </label>
                </div>
                <div className="flex gap-3 pt-2">
                  <button onClick={() => setShowForm(false)} className="flex-1 py-3 text-sm font-medium transition-all" style={{ border: '1px solid #333', color: '#6B6560' }}>Cancel</button>
                  <button onClick={handleSave} className="flex-1 py-3 text-sm font-medium transition-all hover:opacity-80" style={{ backgroundColor: '#C4973A', color: '#1a1a1a' }}>
                    {editDish ? 'Update' : 'Add Dish'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div style={{ backgroundColor: '#161616', border: '1px solid #222' }}>
          <table className="w-full">
            <thead>
              <tr style={{ borderBottom: '1px solid #222' }}>
                {['Name', 'Category', 'Price', 'Type', 'Status', 'Actions'].map(h => (
                  <th key={h} className="text-left px-6 py-4 text-xs font-medium tracking-widest uppercase" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y" style={{ borderColor: '#1f1f1f' }}>
              {dishes.map(dish => (
                <tr key={dish.id} className="transition-colors hover:bg-opacity-50" style={{ borderColor: '#1f1f1f' }}>
                  <td className="px-6 py-4 text-sm font-medium text-white">{dish.name}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{dish.category}</td>
                  <td className="px-6 py-4 text-sm font-medium" style={{ color: '#C4973A' }}>Rs. {dish.price}</td>
                  <td className="px-6 py-4 text-sm" style={{ color: '#6B6560' }}>{dish.veg ? 'Vegetarian' : 'Non-Veg'}</td>
                  <td className="px-6 py-4">
                    <button onClick={() => toggleAvailable(dish.id)}
                      className="text-xs px-3 py-1 font-medium"
                      style={{
                        backgroundColor: dish.available ? '#0f1f0f' : '#1f0f0f',
                        color: dish.available ? '#4CAF50' : '#EF5350',
                        border: `1px solid ${dish.available ? '#1a3a1a' : '#3a1a1a'}`
                      }}>
                      {dish.available ? 'Available' : 'Unavailable'}
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <button onClick={() => openEdit(dish)} className="text-xs mr-4 transition-colors hover:text-white" style={{ color: '#6B6560' }}>Edit</button>
                    <button onClick={() => handleDelete(dish.id)} className="text-xs transition-colors" style={{ color: '#EF5350' }}>Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
