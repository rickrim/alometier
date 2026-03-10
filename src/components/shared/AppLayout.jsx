import BottomNav from './BottomNav'

export default function AppLayout({ children, title, action }) {
  return (
    <div className="app-container flex flex-col min-h-screen">
      {title && (
        <header className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-lg font-bold text-navy">{title}</h1>
          {action && <div>{action}</div>}
        </header>
      )}
      <main className="flex-1 overflow-y-auto pb-20">
        {children}
      </main>
      <BottomNav />
    </div>
  )
}
