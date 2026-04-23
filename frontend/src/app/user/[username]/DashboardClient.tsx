"use client";

import React, { useEffect, useState, useRef } from 'react';
import { getGithubAnalysis } from '../../../lib/api';
import { PieChart, Pie, Cell, Tooltip as RechartsTooltip, ResponsiveContainer, Legend } from 'recharts';
import { ArrowLeft, Loader2, AlertCircle, Info, Share2, ExternalLink, CheckCircle2, Zap, Target, ShieldCheck } from 'lucide-react';
import Link from 'next/link';
import ShareModal from '../../../components/ShareModal';

export function DashboardClient({ username }: { username: string }) {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [languageTimeframe, setLanguageTimeframe] = useState<'all' | 'recent'>('all');
  const [showComparison, setShowComparison] = useState(false);
  const targetRef = useRef<HTMLDivElement>(null);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

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


  if (loading) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center">
        <Loader2 className="w-12 h-12 text-zinc-500 animate-spin mb-4" />
        <h2 className="text-2xl font-bold">Analyzing developer profile...</h2>
        <p className="text-zinc-400 font-body mt-2">This might take a few moments.</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col items-center justify-center">
        <AlertCircle className="w-12 h-12 text-red-500 mb-4" />
        <h2 className="text-2xl font-bold text-red-500 mb-2">Analysis Failed</h2>
        <p className="text-zinc-400 font-body mb-8">{error}</p>
        <Link href="/" className="rounded-md border border-zinc-700 bg-zinc-800 px-6 py-2 flex items-center gap-2 hover:bg-zinc-700 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
      </div>
    );
  }

  if (!data) return null;

  const { profile, score, repoStats, activityStats, cicdStats, commitStats, busFactorStats, ownershipStats, aiSummary, recruiterSignals } = data;
  
  // Prepare chart data
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#a855f7', '#ec4899', '#14b8a6'];
  const languageSource = languageTimeframe === 'recent' ? repoStats.recentLanguageBreakdown : repoStats.languageBreakdown;
  const languageData = Object.entries(languageSource || {})
    .sort((a: any, b: any) => b[1] - a[1]) // Sort largest to smallest for consistent coloring
    .map(([name, value], index) => {
      const totalLines = Object.values(languageSource || {}).reduce((a: any, b: any) => a + b, 0) as number;
      const percentage = totalLines > 0 ? (((value as number) / totalLines) * 100).toFixed(0) : '0';
      return {
        name: `${name} (${percentage}%)`,
        value,
        color: COLORS[index % COLORS.length]
      };
    });

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 font-body px-4 pb-4 pt-24 sm:px-6 sm:pb-6 md:px-8 md:pb-8 lg:px-12 lg:pb-12 print:bg-white print:text-black print:p-8 print:block print:h-auto print:min-h-0 print:overflow-visible overflow-x-hidden">
      
      <div id="hide-in-pdf" className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 print:hidden hide-in-pdf max-w-7xl mx-auto">
        <Link href="/" className="inline-flex items-center gap-2 text-zinc-400 hover:text-zinc-100 transition-colors text-sm font-medium">
          <ArrowLeft className="w-4 h-4" /> Back to Search
        </Link>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="border border-zinc-800 bg-zinc-900 rounded-md px-4 py-2 text-xs sm:text-sm font-medium hover:bg-zinc-800 text-zinc-300 transition-colors flex-1 sm:flex-none shadow-sm"
          >
            {showComparison ? 'Hide Senior Benchmark' : 'Compare with Sr. Dev'}
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="border border-zinc-800 bg-zinc-900 rounded-md px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium hover:bg-zinc-800 text-zinc-300 transition-colors flex-1 sm:flex-none shadow-sm"
          >
            <Share2 className="w-4 h-4" />
            Share Report
          </button>
        </div>
      </div>
      
      <div ref={targetRef} className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        {/* Printable Title - only visible in PDF */}
        <div className="hidden print:block pdf-report-mode:block mb-10 border-b-2 border-black pb-6 text-center">
            <h1 className="text-4xl font-bold uppercase tracking-tighter">Developer Engineering Report</h1>
            <p className="text-gray-500 mt-2">Professional Scorecard generated by GitAnalyzer</p>
        </div>

        {/* Header Section */}
        <div className="flex flex-col gap-6 bg-zinc-900 border border-zinc-800/80 rounded-xl p-5 sm:p-6 shadow-sm print:bg-transparent print:border-black/20 print:text-black print:rounded-none print:border-0 print:p-0 print:pb-8 print:mb-8 print:border-b">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar_url} alt={`${profile.name}'s avatar`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-lg border border-zinc-700/50 object-cover print:border-black/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight print:text-black">{profile.name || username}</h1>
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-zinc-400 print:text-black/60 hover:text-zinc-200 transition-colors block sm:inline mt-1 text-sm">
                  @{profile.login}
                </a>
                <div className="flex justify-center md:justify-start gap-4 mt-3 text-xs sm:text-sm text-zinc-300 print:text-black/80">
                  <span><strong className="text-zinc-100 print:text-black">{profile.followers}</strong> Followers</span>
                  <span><strong className="text-zinc-100 print:text-black">{profile.public_repos}</strong> Public Repos</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right flex flex-col items-center md:items-end">
              <div className="text-xs text-zinc-500 print:text-black/60 uppercase tracking-widest mb-1 font-semibold flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5" /> Developer Rank
              </div>
              <div className="text-2xl sm:text-4xl font-bold tracking-tight text-zinc-100 print:text-black py-1">
                {Number(score) < 30 ? 'Code Explorer' : Number(score) < 60 ? 'Consistent Coder' : Number(score) < 85 ? 'Full Stack Builder' : 'Product Engineer'}
              </div>
              <div className="text-[10px] sm:text-xs text-zinc-400 print:text-black/40 bg-zinc-950/50 px-2.5 py-1 rounded-md border border-zinc-800/50 w-max mt-2">
                Top {Math.max(1, 100 - score)}% globally
              </div>
            </div>
          </div>
          {aiSummary && (
            <div className="pt-5 mt-2 border-t border-zinc-800/80 print:border-black/20 text-zinc-300 print:text-black/80 font-body leading-relaxed text-sm sm:text-base print:text-base bg-zinc-950/20 -mx-5 -mb-5 px-5 pb-5 sm:-mx-6 sm:-mb-6 sm:px-6 sm:pb-6 rounded-b-xl border-t-zinc-800/80">
              <span className="font-bold text-zinc-200 print:text-black print:border-black mr-3 border border-zinc-700/50 print:border-black/20 px-2 py-0.5 rounded textxs inline-block mb-2 sm:mb-0 bg-zinc-800/50">AI Summary</span>
              {aiSummary}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 print:grid print:grid-cols-3 print:gap-4 print:mb-8">
          <StatCard title="Total Stars" value={repoStats.totalStars} tooltip="Collective stars earned across all your repositories." showComparison={showComparison} benchmark="250+" />
          <StatCard title="Total Commits" value={commitStats?.totalCommitsAnalyzed || 0} tooltip="Total git commits analyzed in your active repositories." showComparison={showComparison} benchmark="500+" />
          <StatCard title="Active Months" value={activityStats.activeMonths} tooltip="Number of unique months you have been active on GitHub." showComparison={showComparison} benchmark="24" />
          <StatCard title="Curr. Streak" value={`${commitStats?.currentStreak || 0}d`} tooltip="Your current ongoing streak of consecutive coding days." showComparison={showComparison} benchmark="14d" />
          <StatCard title="Max Streak" value={`${commitStats?.longestStreak || 0}d`} tooltip="Your longest uninterrupted coding streak." showComparison={showComparison} benchmark="30d" />
          <StatCard title="Archived" value={repoStats.archivedRepos || 0} tooltip="Number of your repositories that are marked as archived/read-only." showComparison={showComparison} benchmark="N/A" />
        </div>

        {/* Recruiter Shortlist Banner */}
        <div className={`rounded-xl p-5 flex flex-col sm:flex-row items-center justify-between gap-4 border shadow-sm print:bg-transparent print:border-black/20 print:text-black
           ${score > 60 ? 'bg-green-950/20 border-green-900/50' : score > 40 ? 'bg-amber-950/20 border-amber-900/50' : 'bg-red-950/20 border-red-900/50'}
        `}>
           <div className="flex items-center gap-4 text-center sm:text-left">
              <div className={`p-3 rounded-full hidden sm:block ${score > 60 ? 'bg-green-500/20 text-green-400' : score > 40 ? 'bg-amber-500/20 text-amber-400' : 'bg-red-500/20 text-red-400'}`}>
                 <Target className="w-6 h-6" />
              </div>
              <div>
                 <h3 className="font-bold text-lg text-zinc-100 print:text-black">Would a Recruiter Shortlist You?</h3>
                 <p className="text-xs sm:text-sm text-zinc-400 print:text-black/70 mt-1 max-w-lg">
                    {score > 60 ? "Based on repository depth, commit consistency, and professional workflows, you present a highly hirable signal." : score > 40 ? "You show promise but need more fully documented, deployed projects and a tighter git commit history." : "Your profile lacks enough documented project depth and consistent git activity to stand out to a recruiter."}
                 </p>
              </div>
           </div>
           <div className={`text-2xl sm:text-3xl font-black tracking-tighter ${score > 60 ? 'text-green-400' : score > 40 ? 'text-amber-400' : 'text-red-400'}`}>
              {score > 60 ? "YES" : score > 40 ? "MAYBE" : "NOT YET"}
           </div>
        </div>

        {/* Recruiter Scorecard */}
        {recruiterSignals && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 print:grid print:grid-cols-2 print:gap-8 print:space-y-0">
            {/* The Good - Signals Recruits Appreciate */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm print:bg-transparent print:border-black/10 print:text-black">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 border-b border-white/10 pb-4 print:border-black/10">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 print:text-green-600" />
                <h3 className="text-lg sm:text-2xl font-bold print:text-black">Recruiter Signals</h3>
              </div>
              <div className="space-y-5 sm:space-y-6">
                {recruiterSignals.pros.map((pro: any, i: number) => (
                  <div key={i} className="flex gap-3 sm:gap-4">
                    <div className="mt-1 flex-shrink-0">
                      <div className="w-2 h-2 rounded-full bg-green-400 mt-2 print:bg-green-600" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold text-sm sm:text-base text-white/90 print:text-black/90">{pro.title}</span>
                        <span className={`text-[8px] sm:text-[10px] px-2 py-0.5 rounded-full border ${
                          pro.impact === 'High' ? 'border-green-500/50 text-green-400 print:border-green-600 print:text-green-700' : 
                          pro.impact === 'Medium' ? 'border-blue-500/50 text-blue-400 print:border-blue-600 print:text-blue-700' : 
                          'border-white/20 text-white/40 print:border-black/20 print:text-black/40'
                        }`}>{pro.impact} Impact</span>
                      </div>
                      <p className="text-xs sm:text-sm text-white/60 print:text-black/60 mt-1">{pro.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Areas - Optimization Opportunities */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm print:bg-transparent print:border-black/10 print:text-black">
              <div className="flex items-center gap-3 mb-5 border-b border-zinc-800 pb-4 print:border-black/10">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 print:text-amber-600" />
                <h3 className="text-lg sm:text-2xl font-bold print:text-black">Optimization Areas</h3>
              </div>
              <div className="space-y-5 sm:space-y-6">
                {recruiterSignals.cons.map((con: any, i: number) => (
                  <div key={i} className="flex gap-3 sm:gap-4">
                    <div className="mt-1 flex-shrink-0">
                       <AlertCircle className="w-4 h-4 text-amber-400/60 print:text-amber-600" />
                    </div>
                    <div>
                      <span className="font-bold text-sm sm:text-base text-white/90 print:text-black/90">{con.title}</span>
                      <p className="text-xs sm:text-sm text-white/60 print:text-black/60 mt-1">{con.description}</p>
                      {con.repos && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {con.repos.map((repo: string) => (
                            <span key={repo} className="px-2 py-0.5 bg-white/5 border border-white/10 rounded-md text-[10px] text-white/40 print:text-black/40">
                              {repo}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="mt-2 text-[10px] sm:text-xs bg-amber-400/10 border border-amber-400/20 text-amber-300 print:bg-amber-50 print:border-amber-200 print:text-amber-800 px-2 sm:px-3 py-1 rounded-lg inline-block">
                        <span className="font-semibold mr-1">Pro-tip:</span> {con.suggestion}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Breakdown Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 print:grid print:grid-cols-2 print:gap-8">
          
          {/* Engineering Signals */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-bold border-b border-zinc-800 print:border-black/10 print:text-black pb-4">Engineering Breakdown</h3>
            <div className="space-y-4">
              <SignalRow label="CI/CD Repositories" value={cicdStats.cicdRepos} tooltip="Automated testing/deployment." showComparison={showComparison} benchmark="3+" />
              <SignalRow label="Documentation Score" value={`${repoStats.documentationScore || 0}%`} tooltip="Percentage of repos with high quality READMEs." showComparison={showComparison} benchmark="85%" />
              <SignalRow label="Code Modularity Score" value={`${repoStats.architectureScore || 0}%`} tooltip="Use of professional architectural patterns (src, models, controllers)." showComparison={showComparison} benchmark="80%" />
              <SignalRow label="Testing Code Score" value={`${repoStats.testingScore || 0}%`} tooltip="Presence of automated tests (Jest, Cypress, test runners)." showComparison={showComparison} benchmark="60%" />
              <SignalRow label="Deployment Score" value={`${repoStats.deploymentScore || 0}%`} tooltip="Live projects or deployed demonstration links." showComparison={showComparison} benchmark="60%" />
              <SignalRow label="Conventional Commits" value={`${(commitStats.conventionalRatio || 0).toFixed(0)}%`} tooltip="Ratio of commits following conventional commits." showComparison={showComparison} benchmark="85%" />
            </div>
          </div>

          {/* Collaboration & Ownership */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-bold border-b border-zinc-800 print:border-black/10 print:text-black pb-4">Collaboration</h3>
            <div className="space-y-4">
              <SignalRow label="Avg Ownership" value={`${(ownershipStats.avgOwnership || 0).toFixed(0)}%`} showComparison={showComparison} benchmark="60%" />
              <SignalRow label="Team Projects" value={busFactorStats.collaborativeProjects || ownershipStats?.teamProjects} showComparison={showComparison} benchmark="5+" />
              <SignalRow label="Total Releases" value={repoStats.workflowStats?.reposWithReleases || activityStats.releases} showComparison={showComparison} benchmark="15+" />
              <SignalRow label="Open Source PRs" value={activityStats.ossActivity?.externalPRs || 0} tooltip="Pull Requests made to repositories you do not own." showComparison={showComparison} benchmark="10+" />
              <SignalRow label="Forks" value={activityStats.ossActivity?.forks || 0} tooltip="Repositories forked indicating external exploration." showComparison={showComparison} benchmark="5+" />
              <SignalRow label="Issue Activity" value={activityStats.issues} tooltip="Engagement with issues (opening, commenting, closing)." showComparison={showComparison} benchmark="50+" />
              <SignalRow label="Branching Flow" value={repoStats.workflowStats?.reposWithMultipleBranches > 0 ? "Active" : "Main-only"} showComparison={showComparison} benchmark="Active" />
              
              <div className="pt-2">
                <div className="text-white/70 print:text-black/70 text-[10px] sm:text-xs mb-2 uppercase tracking-wider font-semibold">Top Projects</div>
                <div className="space-y-2">
                  {repoStats.topProjects && repoStats.topProjects.map((p: any) => (
                    <div key={p.name} className="block p-3 rounded-lg bg-zinc-950/50 border border-zinc-800/50 print:bg-gray-50 print:border print:border-gray-200">
                      <div className="flex justify-between items-center text-zinc-300">
                        <span className="font-semibold text-xs sm:text-sm">{p.name}</span>
                        <span className="text-[10px] text-zinc-500 print:text-black/50">★ {p.stars}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coding Habits */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-bold border-b border-zinc-800 print:border-black/10 print:text-black pb-4">Coding Habits</h3>
            <div className="space-y-4">
              <SignalRow 
                label="Peak Activity" 
                value={Object.entries(commitStats?.timeOfDay || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'} 
                valueClassName="capitalize" 
                showComparison={showComparison} benchmark="Morning"
              />
              <SignalRow 
                label="Weekend Work" 
                value={commitStats?.daysOfWeek && (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday) > 0 ? `${Math.round((commitStats.daysOfWeek.weekend / (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday)) * 100)}%` : '0%'} 
                showComparison={showComparison} benchmark="< 20%"
              />
              <SignalRow 
                label="Maintenance" 
                value={`${repoStats.avgDaysSinceUpdate || 0} days`} 
                showComparison={showComparison} benchmark="< 14 days"
              />
            </div>
          </div>

          {/* Commit Typology */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:break-inside-avoid signal-block">
            <h3 className="text-lg sm:text-xl font-bold border-b border-zinc-800 print:border-black/10 print:text-black pb-4">Commit Typology</h3>
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
                   <div className="text-xs sm:text-sm text-white/50 print:text-black/50 text-center py-4">No commit type data</div>
               )}
            </div>
          </div>

          {/* Language Breakdown */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm flex flex-col items-center print:bg-transparent print:border-black/10 print:text-black print:break-inside-avoid signal-block">
            <div className="flex justify-between items-center border-b border-zinc-800 print:border-black/10 w-full pb-4 mb-4">
              <h3 className="text-lg sm:text-xl font-bold print:text-black">Languages</h3>
              <div className="flex bg-zinc-950 print:hidden rounded-lg p-1 text-[10px] border border-zinc-800/50">
                 <button onClick={() => setLanguageTimeframe('all')} className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'all' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>All</button>
                 <button onClick={() => setLanguageTimeframe('recent')} className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'recent' ? 'bg-zinc-800 text-zinc-100' : 'text-zinc-500 hover:text-zinc-300'}`}>Recent</button>
              </div>
            </div>
            {languageData.length > 0 ? (
              <div className="h-[180px] sm:h-[200px] w-full print:h-[150px]">
                <ResponsiveContainer key={languageTimeframe} width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={languageData}
                      cx="50%"
                      cy="50%"
                      innerRadius={45}
                      outerRadius={65}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {languageData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <RechartsTooltip 
                      contentStyle={{ backgroundColor: '#111', border: '1px solid #333', borderRadius: '8px', fontSize: '12px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            ) : (
              <div className="flex-1 flex items-center justify-center text-white/50 text-xs">No data</div>
            )}
            <div className="grid grid-cols-2 gap-x-4 gap-y-1 w-full mt-4">
                {languageData.slice(0, 4).map((lang) => (
                    <div key={lang.name} className="flex items-center gap-2 text-[10px] sm:text-xs">
                        <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full flex-shrink-0" style={{ backgroundColor: lang.color }} />
                        <span className="truncate">{lang.name}</span>
                    </div>
                ))}
            </div>
          </div>
        </div>

        {/* Roadmap to 100/100 */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-5 sm:p-6 shadow-sm print:bg-transparent print:border-black/10 print:text-black signal-block">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b border-zinc-800 pb-4 print:border-black/10">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-400 print:text-indigo-600" />
            <h3 className="text-lg sm:text-2xl font-bold print:text-black">Roadmap to Perfection: 100/100</h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 lg:gap-x-12 gap-y-6 sm:gap-y-8">
            <RoadmapProgress 
              title="Engineering Volume" 
              current={commitStats?.totalCommitsAnalyzed || 0} 
              target={500} 
              unit="Commits" 
              description="Reach 500+ commits to maximize your activity signal." 
            />
            <RoadmapProgress 
              title="Portfolio Depth" 
              current={repoStats.activeRepos} 
              target={20} 
              unit="Active Repos" 
              description="Maintain 20+ active, documented public repositories." 
            />
            <RoadmapProgress 
              title="Technical Versatility" 
              current={repoStats.languages.length} 
              target={8} 
              unit="Languages" 
              description="Showcase proficiency in 8 or more different programming languages." 
            />
            <RoadmapProgress 
              title="Industry Impact" 
              current={repoStats.totalStars} 
              target={200} 
              unit="Stars" 
              description="Build public tools that help others—aim for 200+ collective stars." 
            />
            <RoadmapProgress 
              title="Engineering Longevity" 
              current={activityStats.activeMonths} 
              target={12} 
              unit="Active Months" 
              description="Keep a consistent presence on GitHub for at least 12 months." 
            />
            <RoadmapProgress 
              title="Professional Collaboration" 
              current={busFactorStats.collaborativeProjects || 0} 
              target={5} 
              unit="Team Projects" 
              description="Engage in collaborative projects to prove team-readiness." 
            />
          </div>
        </div>
      </div>

      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        username={username}
        score={score}
        data={data}
        targetRef={targetRef}
      />
    </div>
  );
}

function RoadmapProgress({ title, current, target, unit, description }: { title: string, current: number, target: number, unit: string, description: string }) {
  const percentage = Math.min(Math.round((current / target) * 100), 100);
  
  return (
    <div className="space-y-2 sm:space-y-3">
      <div className="flex flex-col sm:flex-row justify-between sm:items-end gap-2 sm:gap-4">
        <div className="flex-1">
          <div className="text-xs sm:text-sm font-bold text-zinc-100 print:text-black/90">{title}</div>
          <div className="text-[8px] sm:text-[10px] text-zinc-400 print:text-black/40 uppercase tracking-wider leading-relaxed mt-0.5">{description}</div>
        </div>
        <div className="text-left sm:text-right flex-shrink-0">
          <span className="text-xs sm:text-sm font-bold text-indigo-400 print:text-indigo-600">{current}</span>
          <span className="text-[8px] sm:text-[10px] text-zinc-500 print:text-black/30 ml-1">/ {target} {unit}</span>
        </div>
      </div>
      <div className="h-1 sm:h-1.5 w-full bg-zinc-800 print:bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-indigo-500 print:bg-indigo-600 transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value, tooltip, showComparison, benchmark }: { title: string, value: string | number, tooltip?: string, showComparison?: boolean, benchmark?: string | number }) {
  return (
    <div className="bg-zinc-900 border border-zinc-800 rounded-lg p-4 sm:p-5 shadow-sm text-center print:bg-transparent print:border-black/10 print:text-black stat-card relative group/tooltip">
      <div className="text-zinc-400 print:text-black/60 text-[8px] sm:text-[10px] uppercase tracking-widest mb-1 font-semibold flex items-center justify-center gap-1 cursor-help">
        {title}
        {tooltip && <Info className="w-3 h-3 text-zinc-500 group-hover/tooltip:text-zinc-300 transition-colors hidden sm:block" />}
        {tooltip && (
          <div className="absolute left-1/2 -translate-x-1/2 bottom-[100%] mb-3 w-40 sm:w-48 p-2 bg-zinc-950 border border-zinc-800 text-zinc-200 text-[10px] sm:text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 font-normal normal-case tracking-normal text-center">
            {tooltip}
          </div>
        )}
      </div>
      <div className="text-xl sm:text-3xl font-bold text-zinc-100 print:text-black">
         {value}
      </div>
      {showComparison && benchmark && (
         <div className="text-[10px] sm:text-[11px] text-zinc-500 font-semibold mt-1 print:text-indigo-600">
           Sr. Benchmark: <span className="text-indigo-400">{benchmark}</span>
         </div>
      )}
    </div>
  );
}

function SignalRow({ label, value, tooltip, valueClassName, showComparison, benchmark }: { label: string, value: string | number, tooltip?: string, valueClassName?: string, showComparison?: boolean, benchmark?: string | number }) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-1.5 sm:gap-4 text-[10px] sm:text-sm border-b border-zinc-800/50 print:border-black/5 pb-2 last:border-0 relative font-body group/tooltip">
      <div className="flex items-center gap-1.5 cursor-help">
        <span className="text-zinc-400 print:text-black/70 group-hover/tooltip:text-zinc-200 transition-colors border-b border-dashed border-zinc-700">{label}</span>
        {tooltip && <Info className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-zinc-600 group-hover/tooltip:text-zinc-400 transition-colors hidden sm:block" />}
        {tooltip && (
          <div className="absolute left-0 bottom-full mb-1 sm:mb-2 w-48 sm:w-64 p-2 sm:p-3 bg-zinc-950 border border-zinc-800 text-zinc-300 text-[10px] sm:text-xs rounded-lg shadow-xl opacity-0 invisible group-hover/tooltip:opacity-100 group-hover/tooltip:visible transition-all z-20 font-normal leading-relaxed text-left">
            {tooltip}
          </div>
        )}
      </div>
      <div className="text-right flex items-center">
        <span className={`font-semibold text-zinc-200 print:text-black px-1 ${valueClassName || ''}`}>{value}</span>
        {showComparison && benchmark && (
          <span className="text-[10px] text-zinc-400 font-medium ml-2 bg-zinc-800/50 px-1.5 py-0.5 rounded border border-zinc-700/50 whitespace-nowrap">
            <span className="text-zinc-500 mr-1">Sr:</span><span className="text-indigo-400">{benchmark}</span>
          </span>
        )}
      </div>
    </div>
  );
}
