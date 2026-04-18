import Link from 'next/link'

export default function HomePage() {
  return (
    <div className="min-h-screen" style={{ backgroundColor: '#FAF7F2' }}>

      {/* Navbar */}
      <nav style={{ backgroundColor: '#FFFFFF', borderBottom: '1px solid #E8E0D5' }}
        className="px-10 py-5 flex justify-between items-center sticky top-0 z-50">
        <div>
          <p className="font-serif text-xl font-semibold tracking-wide" style={{ color: '#1a1a1a' }}>Spice Garden</p>
          <p className="text-xs tracking-widest uppercase" style={{ color: '#C4973A', letterSpacing: '0.15em' }}>Fine Dining Restaurant</p>
        </div>
        <div className="hidden md:flex items-center gap-8">
          {['Menu', 'Tables', 'About', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`}
              className="text-sm font-medium tracking-wide transition-colors hover:text-amber-700"
              style={{ color: '#6B6560' }}>{item}</a>
          ))}
        </div>
        <Link href="/chat"
          className="px-6 py-2.5 text-sm font-medium tracking-wide transition-all hover:opacity-90"
          style={{ backgroundColor: '#1a1a1a', color: '#FAF7F2', letterSpacing: '0.05em' }}>
          Reserve a Table
        </Link>
      </nav>

      {/* Hero */}
      <section style={{ backgroundColor: '#1a1a1a', minHeight: '92vh', position: 'relative', overflow: 'hidden' }}
        className="flex flex-col items-center justify-center text-center px-6">
        {/* Decorative lines */}
        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, opacity: 0.04,
          backgroundImage: 'repeating-linear-gradient(0deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px), repeating-linear-gradient(90deg, #fff 0px, #fff 1px, transparent 1px, transparent 60px)' }} />

        <p className="text-xs tracking-widest uppercase mb-6" style={{ color: '#C4973A', letterSpacing: '0.3em' }}>
          Est. 2018 · Mumbai, India
        </p>
        <h1 className="font-serif text-7xl font-semibold text-white mb-6 leading-tight" style={{ maxWidth: '800px' }}>
          Where Every Meal <br />Tells a Story
        </h1>
        <div className="w-12 h-px mb-6" style={{ backgroundColor: '#C4973A' }} />
        <p className="text-lg mb-12" style={{ color: '#9E9890', maxWidth: '480px', lineHeight: '1.8' }}>
          Authentic Indian cuisine crafted with tradition, served with modern elegance.
        </p>
        <div className="flex gap-4">
          <Link href="/chat"
            className="px-8 py-4 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-90"
            style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.15em' }}>
            Book a Table
          </Link>
          <a href="#menu"
            className="px-8 py-4 text-sm font-medium tracking-widest uppercase border transition-all hover:bg-white hover:text-black"
            style={{ borderColor: 'rgba(255,255,255,0.3)', color: 'rgba(255,255,255,0.8)', letterSpacing: '0.15em' }}>
            View Menu
          </a>
        </div>

        {/* Stats */}
        <div className="absolute bottom-12 flex gap-16">
          {[['15+', 'Years Experience'], ['200+', 'Menu Items'], ['50,000+', 'Happy Guests']].map(([num, label]) => (
            <div key={label} className="text-center">
              <p className="font-serif text-3xl font-semibold text-white">{num}</p>
              <p className="text-xs tracking-widest uppercase mt-1" style={{ color: '#6B6560', letterSpacing: '0.1em' }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-28 px-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
        <div>
          <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C4973A', letterSpacing: '0.2em' }}>Our Story</p>
          <h2 className="font-serif text-5xl font-semibold mb-6 leading-tight" style={{ color: '#1a1a1a' }}>
            A Legacy of Authentic Flavors
          </h2>
          <div className="w-10 h-0.5 mb-8" style={{ backgroundColor: '#C4973A' }} />
          <p className="text-base leading-relaxed mb-6" style={{ color: '#6B6560' }}>
            For over 15 years, Spice Garden has been a destination for those who appreciate the depth of Indian cuisine. Our chefs draw from regional traditions across India to create dishes that are both authentic and refined.
          </p>
          <p className="text-base leading-relaxed" style={{ color: '#6B6560' }}>
            Every dish is prepared with fresh, locally sourced ingredients and spices imported directly from their places of origin.
          </p>
          <Link href="/chat" className="inline-block mt-10 px-8 py-3.5 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-80"
            style={{ backgroundColor: '#1a1a1a', color: '#FAF7F2', letterSpacing: '0.1em' }}>
            Reserve Your Table
          </Link>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {[
            { num: '8', label: 'Private Tables' },
            { num: '12:00', label: 'Opens Daily' },
            { num: '100%', label: 'Fresh Ingredients' },
            { num: '4.9', label: 'Guest Rating' },
          ].map(item => (
            <div key={item.label} className="p-8 text-center" style={{ backgroundColor: '#F5EFE6', border: '1px solid #E8E0D5' }}>
              <p className="font-serif text-4xl font-semibold mb-2" style={{ color: '#1a1a1a' }}>{item.num}</p>
              <p className="text-xs tracking-widest uppercase" style={{ color: '#8B6914', letterSpacing: '0.1em' }}>{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Divider */}
      <div style={{ borderTop: '1px solid #E8E0D5' }} />

      {/* Menu Section */}
      <section id="menu" className="py-28 px-10">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C4973A', letterSpacing: '0.2em' }}>Culinary Excellence</p>
            <h2 className="font-serif text-5xl font-semibold" style={{ color: '#1a1a1a' }}>Our Signature Menu</h2>
            <div className="w-10 h-0.5 mx-auto mt-6" style={{ backgroundColor: '#C4973A' }} />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {menuItems.map(item => (
              <div key={item.name} className="group" style={{ backgroundColor: '#FFFFFF', border: '1px solid #E8E0D5' }}>
                <div className="h-48 flex items-center justify-center" style={{ backgroundColor: '#F5EFE6' }}>
                  <div className="text-center">
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#C4973A', letterSpacing: '0.15em' }}>{item.category}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="font-serif text-xl font-semibold" style={{ color: '#1a1a1a' }}>{item.name}</h3>
                    <span className="font-medium text-sm" style={{ color: '#8B6914' }}>Rs. {item.price}</span>
                  </div>
                  <p className="text-sm leading-relaxed mb-4" style={{ color: '#6B6560' }}>{item.description}</p>
                  <div className="flex items-center gap-3">
                    <span className="text-xs px-2.5 py-1 tracking-wide" style={{ backgroundColor: '#F5EFE6', color: '#8B6914', border: '1px solid #E8E0D5' }}>
                      {item.category}
                    </span>
                    <span className="text-xs px-2.5 py-1 tracking-wide" style={{
                      backgroundColor: item.veg ? '#F0F7F0' : '#FDF5F5',
                      color: item.veg ? '#2D6A2D' : '#8B2D2D',
                      border: `1px solid ${item.veg ? '#C5DEC5' : '#DEC5C5'}`
                    }}>
                      {item.veg ? 'Vegetarian' : 'Non-Vegetarian'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/chat"
              className="inline-block px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-80"
              style={{ border: '1px solid #1a1a1a', color: '#1a1a1a', letterSpacing: '0.15em' }}>
              Explore Full Menu via AI Assistant
            </Link>
          </div>
        </div>
      </section>

      {/* Reservation CTA */}
      <section id="tables" style={{ backgroundColor: '#1a1a1a' }} className="py-28 px-10 text-center">
        <p className="text-xs tracking-widest uppercase mb-4" style={{ color: '#C4973A', letterSpacing: '0.3em' }}>Reservations</p>
        <h2 className="font-serif text-5xl font-semibold text-white mb-6">Reserve Your Table</h2>
        <div className="w-10 h-0.5 mx-auto mb-8" style={{ backgroundColor: '#C4973A' }} />
        <p className="text-base mb-12" style={{ color: '#9E9890', maxWidth: '480px', margin: '0 auto 48px', lineHeight: '1.8' }}>
          Chat with our AI assistant to check availability and make a reservation in seconds.
        </p>
        <Link href="/chat"
          className="inline-block px-10 py-4 text-sm font-medium tracking-widest uppercase transition-all hover:opacity-90"
          style={{ backgroundColor: '#C4973A', color: '#1a1a1a', letterSpacing: '0.15em' }}>
          Start Reservation
        </Link>
      </section>

      {/* Contact */}
      <section id="contact" className="py-20 px-10" style={{ backgroundColor: '#FFFFFF', borderTop: '1px solid #E8E0D5' }}>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
          {[
            { label: 'Address', value: '123 Food Street\nMumbai, Maharashtra 400001' },
            { label: 'Hours', value: 'Monday – Sunday\n12:00 PM – 11:00 PM' },
            { label: 'Contact', value: '+91 98765 43210\ninfo@spicegarden.com' },
          ].map(item => (
            <div key={item.label}>
              <p className="text-xs tracking-widest uppercase mb-3" style={{ color: '#C4973A', letterSpacing: '0.2em' }}>{item.label}</p>
              <p className="text-sm leading-relaxed whitespace-pre-line" style={{ color: '#6B6560' }}>{item.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-10 flex justify-between items-center" style={{ backgroundColor: '#1a1a1a', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
        <p className="font-serif text-white text-sm">Spice Garden</p>
        <p className="text-xs" style={{ color: '#6B6560' }}>© 2026 Spice Garden Restaurant. All rights reserved.</p>
      </footer>
    </div>
  )
}

const menuItems = [
  { name: 'Butter Chicken', price: 320, description: 'Tender chicken in a rich, creamy tomato-based sauce with aromatic spices', category: 'Main Course', veg: false },
  { name: 'Paneer Tikka Masala', price: 280, description: 'Char-grilled cottage cheese in a bold, spiced tomato gravy', category: 'Main Course', veg: true },
  { name: 'Garlic Naan', price: 60, description: 'Hand-stretched bread baked in a traditional tandoor with garlic butter', category: 'Breads', veg: true },
  { name: 'Seekh Kebab', price: 350, description: 'Minced lamb kebabs seasoned with herbs and grilled over charcoal', category: 'Starters', veg: false },
  { name: 'Dal Makhani', price: 220, description: 'Slow-cooked black lentils simmered overnight in cream and butter', category: 'Main Course', veg: true },
  { name: 'Gulab Jamun', price: 120, description: 'Soft milk-solid dumplings soaked in rose-scented sugar syrup', category: 'Desserts', veg: true },
]
