// app/layout.tsx
import Sidebar from "@/components/Sidebar";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap" rel="stylesheet" />
        <style>{`
          body { 
            margin: 0; 
            font-family: 'Plus Jakarta Sans', sans-serif; 
            background: #f8fafc; 
            color: #0f172a; 
            overflow: hidden; 
            -webkit-font-smoothing: antialiased;
          }

          /* Shimmer Animation */
          .shimmer {
            background: #f1f5f9;
            background-image: linear-gradient(90deg, #f1f5f9 0%, #e2e8f0 50%, #f1f5f9 100%);
            background-size: 200% 100%;
            animation: shimmer 1.5s infinite linear;
          }
          @keyframes shimmer {
            0% { background-position: 200% 0; }
            100% { background-position: -200% 0; }
          }

          /* Entry Animation */
          .fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          ::-webkit-scrollbar { width: 6px; }
          ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        `}</style>
      </head>
      <body>
        <div style={{ display: 'flex', height: '100vh', width: '100vw' }}>
          <Sidebar />
          <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}