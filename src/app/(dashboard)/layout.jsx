export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body>
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* ড্যাশবোর্ডের সাইডবার */}
      <aside style={{ width: '250px', background: '#2c3e50', color: '#fff', padding: '20px' }}>
        <h2>Admin Panel</h2>
        <ul>
          <li>Dashboard</li>
          <li>Orders</li>
          <li>Products</li>
        </ul>
      </aside>

      <div style={{ flex: 1 }}>
        {/* ড্যাশবোর্ডের উপরের হেডার */}
        <header style={{ padding: '15px', borderBottom: '1px solid #ddd' }}>
          <span>Welcome, Mohammad!</span>
        </header>

        <main style={{ padding: '20px' }}>
          {children}
        </main>
      </div>
    </div>
    </body>
    </html>
  );
}