import { useState } from 'react';

export function Login({ onLogin }: { onLogin: () => void }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(); // Since it's simulated, any form submission logs us in
  };

  return (
    <div className="flex h-screen bg-surface items-center justify-center p-8 w-full">
      <div className="w-full max-w-4xl h-[600px] bg-card rounded-2xl shadow-xl flex overflow-hidden border border-gray-100">
        
        {/* Left Side: Sage Graphic (FinPlanner style) */}
        <div className="hidden md:flex w-1/2 bg-sage p-12 flex-col justify-between relative">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 bg-olive text-white flex items-center justify-center rounded-full text-xs font-bold">A</div>
            <span className="font-bold text-lg text-olive-dark">AI Predictor</span>
          </div>
          
          <div className="flex-1 flex items-center justify-center">
            {/* Mock abstract illustration matching the Uizard screenshot vibe */}
            <div className="w-64 h-64 bg-sage-light rounded-full flex items-center justify-center relative shadow-inner overflow-hidden">
              {/* Chart lines */}
              <div className="absolute bottom-0 w-full h-1/2 bg-olive-dark/80" style={{ clipPath: 'polygon(0 100%, 0 40%, 25% 20%, 50% 50%, 75% 30%, 100% 60%, 100% 100%)' }}></div>
              <div className="absolute left-1/4 bottom-12 w-2 h-16 bg-white/30 rounded-full"></div>
              <div className="absolute left-1/2 bottom-8 w-2 h-24 bg-white/30 rounded-full"></div>
              <div className="absolute right-1/4 bottom-16 w-2 h-12 bg-white/30 rounded-full"></div>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="w-full md:w-1/2 p-12 lg:p-16 flex flex-col justify-center bg-card">
          <h1 className="text-4xl font-bold text-center mb-12 text-textMain">Log in</h1>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6 max-w-sm mx-auto w-full">
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textMain">Email address</label>
              <input 
                type="email" 
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                required
              />
            </div>
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-textMain">Password</label>
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:border-sage focus:ring-1 focus:ring-sage"
                required
              />
            </div>

            <button 
              type="submit" 
              className="w-full bg-sage hover:bg-sage-dark text-olive-dark font-semibold py-3 rounded-lg mt-4 transition-colors"
            >
              Log in
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
