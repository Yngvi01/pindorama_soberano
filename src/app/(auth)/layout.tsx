export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-yellow-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-green-800 mb-2">
            Pindorama Soberano
          </h1>
          <p className="text-gray-600">
            Sistema de Autenticação
          </p>
        </div>
        {children}
      </div>
    </div>
  )
}