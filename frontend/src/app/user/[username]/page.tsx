"use client";

import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'next/navigation';
import { getGithubAnalysis } from '../../../lib/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Loader2, AlertCircle, Info, Printer, ExternalLink } from 'lucide-react';
import Link from 'next/link';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export default function UserDashboard() {
  const params = useParams();
  const username = params.username as string;
  
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageTimeframe, setLanguageTimeframe] = useState<'all' | 'recent'>('all');
  const [showComparison, setShowComparison] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  useEffect(() => {
    if (!username) return;

    let isMounted = true;
    setLoading(true);
    setError(null);

    getGithubAnalysis(username)
      .then((res) => {
        if (isMounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (isMounted) {
          setError(err.message || 'Failed to analyze developer profile');
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [username]);

  const handlePrint = async () => {
    if (!targetRef.current) return;
    setIsGeneratingPdf(true);
    try {
      const element = targetRef.current;
      const canvas = await html2canvas(element, {
        scale: 2,
        backgroundColor: '#000000',
        useCORS: true,
        logging: false,
        ignoreElements: (el) => el.id === 'hide-in-pdf' || el.classList.contains('hide-in-pdf')
      });
      
      const imgData = canvas.toDataURL('image/png');
      
      // Calculate dimensions to fit exactly on a 1-page PDF
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`GitAnalyzer_${username}.pdf`);
    } catch (error) {
      console.error('Failed to generate PDF:', error);
      // Fallback
      window.print();
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
        <h2 className="text-2xl font-heading italic">Analyzing developer profile...</h2>
        <p className="text-white/60 font-body mt-2">This might take a few moments.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-heading italic text-red-500 mb-2">Analysis Failed</h2>
        <p className="text-white/80 font-body mb-8">{error}</p>
        <Link href="/" className="liquid-glass rounded-full px-6 py-3 flex items-center gap-2 hover:bg-white/10 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { profile, score, repoStats, activityStats, cicdStats, commitStats, busFactorStats, ownershipStats, aiSummary } = data;
  
  // Prepare chart data
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#14b8a6'];
  const languageSource = languageTimeframe === 'recent' ? repoStats.recentLanguageBreakdown : repoStats.languageBreakdown;
  const languageData = Object.entries(languageSource || {}).map(([name, value], index) => {
    const totalLines = Object.values(languageSource || {}).reduce((a: any, b: any) => a + b, 0) as number;
    const percentage = totalLines > 0 ? (((value as number) / totalLines) * 100).toFixed(0) : '0';
    return {
      name: `${name} (${percentage}%)`,
      value,
      color: COLORS[index % COLORS.length]
    };
  });

  return (
    <div ref={targetRef} className="min-h-screen bg-black text-white font-body p-6 md:p-12 lg:p-24 print:bg-white print:text-black print:block print:h-auto print:min-h-0 print:overflow-visible">
      <div id="hide-in-pdf" className="flex justify-between items-center mb-8 print:hidden hide-in-pdf">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="liquid-glass rounded-full px-4 py-2 text-sm font-medium hover:bg-white/10 transition-colors"
          >
            {showComparison ? 'Hide Senior Benchmark' : 'Compare with Sr. Dev'}
          </button>
          <button 
            onClick={handlePrint}
            disabled={isGeneratingPdf}
            className="liquid-glass rounded-full px-4 py-2 flex items-center gap-2 text-sm font-medium hover:bg-white/10 transition-colors disabled:opacity-50"
          >
            {isGeneratingPdf ? <Loader2 className="w-4 h-4 animate-spin" /> : <Printer className="w-4 h-4" />}
            {isGeneratingPdf ? 'Generating PDF...' : 'Download PDF'}
          </button>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header Section */}
        <div className="flex flex-col gap-6 bg-white/5 rounded-3xl p-8 border border-white/10 backdrop-blur-md print:bg-transparent print:border-black/20 print:text-black">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
            <div className="flex items-center gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar_url} alt={`${profile.name}'s avatar`} className="w-24 h-24 rounded-full border-2 border-white/20 print:border-black/20" />
              <div>
                <h1 className="text-4xl font-heading italic tracking-tight">{profile.name || username}</h1>
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-white/60 print:text-black/60 hover:text-white transition-colors">
                  @{profile.login}
                </a>
                <div className="flex gap-4 mt-4 text-sm text-white/80 print:text-black/80">
                  <span><strong>{profile.followers}</strong> Followers</span>
                  <span><strong>{profile.public_repos}</strong> Public Repos</span>
                </div>
              </div>
            </div>
            <div className="text-center">
              <div className="text-sm text-white/60 print:text-black/60 uppercase tracking-widest mb-2 font-medium">Developer Score</div>
              <div className="text-7xl font-heading italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 print:text-blue-600 print:bg-none">
                {score}
                <span className="text-3xl text-white/30 print:text-black/30">/100</span>
              </div>
            </div>
          </div>
          {aiSummary && (
            <div className="pt-6 border-t border-white/10 print:border-black/20 text-white/80 print:text-black/80 font-body leading-relaxed text-lg">
              <span className="font-heading italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 print:text-blue-600 print:bg-none mr-3 border border-white/20 print:border-black/20 px-3 py-1 rounded-full text-sm">AI Summary</span>
              {aiSummary}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 print:grid print:grid-cols-3 print:gap-4 print:mb-8">
          <StatCard title="Total Stars" value={repoStats.totalStars} />
          <StatCard title="Total Commits" value={commitStats?.totalCommitsAnalyzed || 0} />
          <StatCard title="Active Months" value={activityStats.activeMonths} />
          <StatCard title="Curr. Streak" value={`${commitStats?.currentStreak || 0}d`} />
          <StatCard title="Max Streak" value={`${commitStats?.longestStreak || 0}d`} />
          <StatCard title="Archived" value={repoStats.archivedRepos || 0} />
        </div>

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 print:block print:space-y-8">
          
          {/* Engineering Signals */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
            <h3 className="text-xl font-heading italic border-b border-white/10 print:border-black/20 pb-4">Engineering Signals</h3>
            <div className="space-y-4">
              <SignalRow label="CI/CD Repositories" value={cicdStats.cicdRepos} tooltip="Indicates experience with automated testing and deployment pipelines." />
              <SignalRow label="Conventional Commits" value={`${(commitStats.conventionalRatio || 0).toFixed(0)}%`} tooltip="A structured, consistent commit history that's easy to track." />
              <SignalRow label="Documentation" value={`${repoStats.documentationScore || 0}%`} tooltip="Percentage of repositories with documentation (descriptions/wikis)." />
              <SignalRow label="Avg Commit Length" value={`${Math.round(commitStats.avgMessageLength || 0)} chars`} />
            </div>
          </div>

          {/* Collaboration & Ownership */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
            <h3 className="text-xl font-heading italic border-b border-white/10 print:border-black/20 pb-4">Collaboration & Best Work</h3>
            <div className="space-y-4">
              <SignalRow label="Avg Ownership" value={`${(ownershipStats.avgOwnership || 0).toFixed(0)}%`} tooltip="Contribution share within collaborative repositories codebases." />
              <SignalRow label="Team Projects" value={busFactorStats.collaborativeProjects || ownershipStats?.teamProjects} />
              
              <div className="pt-2">
                <div className="text-white/70 print:text-black/70 text-sm mb-2">Top Projects</div>
                {repoStats.topProjects && repoStats.topProjects.map((p: any) => (
                  <a key={p.name} href={p.html_url} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-xl bg-white/5 print:bg-black/5 hover:bg-white/10 transition-colors mb-2">
                    <div className="flex justify-between items-center">
                      <span className="font-semibold text-sm flex items-center gap-1">{p.name} <ExternalLink className="w-3 h-3"/></span>
                      <span className="text-xs text-white/50 print:text-black/50">★ {p.stars}</span>
                    </div>
                    {p.description && <p className="text-xs text-white/60 print:text-black/60 mt-1 line-clamp-1">{p.description}</p>}
                  </a>
                ))}
              </div>
            </div>
          </div>

          {/* Coding Habits */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
            <h3 className="text-xl font-heading italic border-b border-white/10 print:border-black/20 pb-4">Coding Habits</h3>
            <div className="space-y-4">
              <SignalRow 
                label="Most Active Time" 
                value={Object.entries(commitStats?.timeOfDay || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'} 
                valueClassName="capitalize" 
              />
              <SignalRow 
                label="Weekend Activity" 
                value={commitStats?.daysOfWeek && (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday) > 0 ? `${Math.round((commitStats.daysOfWeek.weekend / (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday)) * 100)}%` : '0%'} 
              />
              <SignalRow 
                label="Avg Repo Sync" 
                value={`${repoStats.avgDaysSinceUpdate || 0} days`} 
                tooltip="Average number of days since last commit/update on active repositories" 
              />
            </div>
          </div>

          {/* Commit Typology */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
            <h3 className="text-xl font-heading italic border-b border-white/10 print:border-black/20 pb-4">Commit Typology</h3>
            <div className="space-y-4">
               {Object.entries(commitStats?.typeDistribution || {})
                  .sort((a: any, b: any) => b[1] - a[1])
                  .filter(([, count]) => (count as number) > 0)
                  .slice(0, 4)
                  .map(([type, count]) => (
                  <SignalRow 
                    key={type} 
                    label={type === 'feat' ? 'Features' : type === 'fix' ? 'Bug Fixes' : type === 'docs' ? 'Documentation' : type} 
                    value={String(count)} 
                    valueClassName="capitalize" 
                  />
               ))}
               {Object.keys(commitStats?.typeDistribution || {}).length === 0 && (
                   <div className="text-sm text-white/50 print:text-black/50 text-center py-4">No commit type data</div>
               )}
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-white/5 border border-white/10 rounded-3xl p-6 backdrop-blur-md flex flex-col items-center print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
            <div className="flex justify-between items-center border-b border-white/10 print:border-black/20 w-full pb-4 mb-4">
              <h3 className="text-xl font-heading italic">Language Breakdown</h3>
              <div className="flex bg-black/50 print:bg-white/50 rounded-lg p-1 text-xs">
                 <button onClick={() => setLanguageTimeframe('all')} className={`px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'all' ? 'bg-white/20 print:bg-black/10' : 'opacity-50 text-white hover:text-white print:text-black print:hover:text-black'}`}>All Time</button>
                 <button onClick={() => setLanguageTimeframe('recent')} className={`px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'recent' ? 'bg-white/20 print:bg-black/10' : 'opacity-50 text-white hover:text-white print:text-black print:hover:text-black'}`}>Recent</button>
              </div>
            </div>
            {languageData.length > 0 ? (
              <div className="h-[250px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/50 print:text-black/50">No language data</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, benchmark }: { title: string, value: string | number, benchmark?: string | null }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-md hover:bg-white/10 transition-colors text-center relative print:bg-transparent print:border-black/20 print:text-black print:break-inside-avoid">
      <div className="text-white/60 print:text-black/60 text-sm uppercase tracking-wider mb-2">{title}</div>
      <div className="text-4xl font-heading italic flex items-center justify-center gap-2">
         {value}
      </div>
      {benchmark && (
        <div className="absolute top-2 right-4 text-xs font-heading italic text-green-400 opacity-60 flex items-center gap-1">
           Target: {benchmark}
        </div>
      )}
    </div>
  );
}

function SignalRow({ label, value, tooltip, valueClassName }: { label: string, value: string | number, tooltip?: string, valueClassName?: string }) {
  return (
    <div className="flex justify-between items-center text-sm md:text-base border-b border-white/5 print:border-black/10 pb-2 last:border-0 relative font-body group">
      <div className="flex items-center gap-2">
        <span className="text-white/70 print:text-black/70 cursor-help" title={tooltip}>{label}</span>
        {tooltip && <Info className="w-4 h-4 text-white/40 group-hover:text-white/80 transition-colors print:hidden" title={tooltip} />}
      </div>
      <span className={`font-medium bg-white/10 print:bg-black/10 px-3 py-1 rounded-full ${valueClassName || ''}`}>{value}</span>
    </div>
  );
}
