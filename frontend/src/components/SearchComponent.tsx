"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUpRight } from 'lucide-react';

export function SearchComponent() {
  const [username, setUsername] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim()) {
      router.push(`/user/${username.trim()}`);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex flex-col sm:flex-row items-center gap-4">
      <div className="relative">
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="GitHub Username"
          className="liquid-glass rounded-full px-6 py-4 font-body text-sm text-white placeholder-white/50 outline-none w-[250px] focus:ring-2 focus:ring-white/20 transition-all shadow-xl"
        />
      </div>
      <button 
        type="submit" 
        disabled={!username.trim()}
        className="liquid-glass-strong rounded-full px-8 py-4 font-body font-medium flex items-center gap-2 hover:scale-105 transition-transform text-sm shadow-xl disabled:opacity-50 disabled:hover:scale-100 disabled:cursor-not-allowed"
      >
        Analyze <ArrowUpRight className="w-4 h-4" />
      </button>
    </form>
  );
}
