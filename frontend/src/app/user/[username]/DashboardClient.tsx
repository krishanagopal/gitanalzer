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

  const { profile, score, repoStats, activityStats, cicdStats, commitStats, busFactorStats, ownershipStats, aiSummary, recruiterSignals } = data;
  
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
    <div className="min-h-screen bg-black text-white font-body p-4 sm:p-6 md:p-12 lg:p-24 print:bg-white print:text-black print:p-8 print:block print:h-auto print:min-h-0 print:overflow-visible overflow-x-hidden">
      
      <div id="hide-in-pdf" className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 mb-8 print:hidden hide-in-pdf">
        <Link href="/" className="inline-flex items-center gap-2 text-white/60 hover:text-white transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
        <div className="flex flex-wrap gap-3">
          <button 
            onClick={() => setShowComparison(!showComparison)}
            className="liquid-glass rounded-full px-4 py-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors flex-1 sm:flex-none"
          >
            {showComparison ? 'Hide Senior Benchmark' : 'Compare with Sr. Dev'}
          </button>
          <button 
            onClick={() => setIsShareModalOpen(true)}
            className="liquid-glass rounded-full px-4 py-2 flex items-center justify-center gap-2 text-xs sm:text-sm font-medium hover:bg-white/10 transition-colors flex-1 sm:flex-none"
          >
            <Share2 className="w-4 h-4" />
            Share Scorecard
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
        <div className="flex flex-col gap-6 bg-white/5 rounded-2xl sm:rounded-3xl p-5 sm:p-8 border border-white/10 backdrop-blur-md print:bg-transparent print:border-black/20 print:text-black print:rounded-none print:border-0 print:p-0 print:pb-8 print:mb-8 print:border-b">
          <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-8 text-center md:text-left">
            <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={profile.avatar_url} alt={`${profile.name}'s avatar`} className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-2 border-white/20 print:border-black/20" />
              <div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-heading italic tracking-tight print:not-italic print:font-bold">{profile.name || username}</h1>
                <a href={profile.html_url} target="_blank" rel="noopener noreferrer" className="text-white/60 print:text-black/60 hover:text-white transition-colors block sm:inline mt-1">
                  @{profile.login}
                </a>
                <div className="flex justify-center md:justify-start gap-4 mt-4 text-xs sm:text-sm text-white/80 print:text-black/80">
                  <span><strong>{profile.followers}</strong> Followers</span>
                  <span><strong>{profile.public_repos}</strong> Public Repos</span>
                </div>
              </div>
            </div>
            <div className="text-center md:text-right">
              <div className="text-[10px] sm:text-sm text-white/60 print:text-black/60 uppercase tracking-widest mb-1 sm:mb-2 font-medium">Developer Score</div>
              <div className="text-5xl sm:text-7xl font-heading italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 print:text-black print:bg-none print:not-italic print:font-bold">
                {score}
                <span className="text-2xl sm:text-3xl text-white/30 print:text-black/30">/100</span>
              </div>
            </div>
          </div>
          {aiSummary && (
            <div className="pt-6 border-t border-white/10 print:border-black/20 text-white/80 print:text-black/80 font-body leading-relaxed text-sm sm:text-base md:text-lg print:text-base">
              <span className="font-heading italic text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 print:text-black print:font-bold print:border-black print:bg-none mr-3 border border-white/20 print:border-black/20 px-2 sm:px-3 py-0.5 sm:py-1 rounded-full text-[10px] sm:text-sm inline-block mb-2 sm:mb-0">AI Summary</span>
              {aiSummary}
            </div>
          )}
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4 print:grid print:grid-cols-3 print:gap-4 print:mb-8">
          <StatCard title="Total Stars" value={repoStats.totalStars} />
          <StatCard title="Total Commits" value={commitStats?.totalCommitsAnalyzed || 0} />
          <StatCard title="Active Months" value={activityStats.activeMonths} />
          <StatCard title="Curr. Streak" value={`${commitStats?.currentStreak || 0}d`} />
          <StatCard title="Max Streak" value={`${commitStats?.longestStreak || 0}d`} />
          <StatCard title="Archived" value={repoStats.archivedRepos || 0} />
        </div>

        {/* Recruiter Scorecard */}
        {recruiterSignals && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-8 print:grid print:grid-cols-2 print:gap-8 print:space-y-0">
            {/* The Good - Signals Recruits Appreciate */}
            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-md print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 border-b border-white/10 pb-4 print:border-black/10">
                <CheckCircle2 className="w-5 h-5 sm:w-6 sm:h-6 text-green-400 print:text-green-600" />
                <h3 className="text-lg sm:text-2xl font-heading italic print:not-italic print:font-bold">Recruiter Signals</h3>
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
            <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-md print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl">
              <div className="flex items-center gap-3 mb-5 sm:mb-6 border-b border-white/10 pb-4 print:border-black/10">
                <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-amber-400 print:text-amber-600" />
                <h3 className="text-lg sm:text-2xl font-heading italic print:not-italic print:font-bold">Optimization Areas</h3>
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
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-heading italic border-b border-white/10 print:border-black/10 print:not-italic print:font-bold pb-4">Engineering Signals</h3>
            <div className="space-y-4">
              <SignalRow label="CI/CD Repositories" value={cicdStats.cicdRepos} tooltip="Automated testing/deployment." />
              <SignalRow label="Conventional Commits" value={`${(commitStats.conventionalRatio || 0).toFixed(0)}%`} />
              <SignalRow label="Documentation" value={`${repoStats.documentationScore || 0}%`} />
              <SignalRow label="Avg Commit Msg" value={`${Math.round(commitStats.avgMessageLength || 0)} chars`} />
            </div>
          </div>

          {/* Collaboration & Ownership */}
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-heading italic border-b border-white/10 print:border-black/10 print:not-italic print:font-bold pb-4">Collaboration</h3>
            <div className="space-y-4">
              <SignalRow label="Avg Ownership" value={`${(ownershipStats.avgOwnership || 0).toFixed(0)}%`} />
              <SignalRow label="Team Projects" value={busFactorStats.collaborativeProjects || ownershipStats?.teamProjects} />
              
              <div className="pt-2">
                <div className="text-white/70 print:text-black/70 text-[10px] sm:text-xs mb-2 uppercase tracking-wider font-semibold">Top Projects</div>
                <div className="space-y-2">
                  {repoStats.topProjects && repoStats.topProjects.map((p: any) => (
                    <div key={p.name} className="block p-3 rounded-xl bg-white/5 print:bg-gray-50 print:border print:border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-semibold text-xs sm:text-sm">{p.name}</span>
                        <span className="text-[10px] text-white/50 print:text-black/50">★ {p.stars}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Coding Habits */}
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl print:break-inside-avoid">
            <h3 className="text-lg sm:text-xl font-heading italic border-b border-white/10 print:border-black/10 print:not-italic print:font-bold pb-4">Coding Habits</h3>
            <div className="space-y-4">
              <SignalRow 
                label="Peak Activity" 
                value={Object.entries(commitStats?.timeOfDay || {}).sort((a: any, b: any) => b[1] - a[1])[0]?.[0] || 'N/A'} 
                valueClassName="capitalize" 
              />
              <SignalRow 
                label="Weekend Work" 
                value={commitStats?.daysOfWeek && (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday) > 0 ? `${Math.round((commitStats.daysOfWeek.weekend / (commitStats.daysOfWeek.weekend + commitStats.daysOfWeek.weekday)) * 100)}%` : '0%'} 
              />
              <SignalRow 
                label="Maintenance" 
                value={`${repoStats.avgDaysSinceUpdate || 0} days`} 
              />
            </div>
          </div>

          {/* Commit Typology */}
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col gap-6 print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl print:break-inside-avoid signal-block">
            <h3 className="text-lg sm:text-xl font-heading italic border-b border-white/10 print:border-black/10 print:not-italic print:font-bold pb-4">Commit Typology</h3>
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
          <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-6 backdrop-blur-md flex flex-col items-center print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl print:break-inside-avoid signal-block">
            <div className="flex justify-between items-center border-b border-white/10 print:border-black/10 w-full pb-4 mb-4">
              <h3 className="text-lg sm:text-xl font-heading italic print:not-italic print:font-bold">Languages</h3>
              <div className="flex bg-black/50 print:hidden rounded-lg p-1 text-[10px]">
                 <button onClick={() => setLanguageTimeframe('all')} className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'all' ? 'bg-white/20' : 'opacity-50'}`}>All</button>
                 <button onClick={() => setLanguageTimeframe('recent')} className={`px-2 sm:px-3 py-1 rounded-md transition-colors ${languageTimeframe === 'recent' ? 'bg-white/20' : 'opacity-50'}`}>Recent</button>
              </div>
            </div>
            {languageData.length > 0 ? (
              <div className="h-[180px] sm:h-[200px] w-full print:h-[150px]">
                <ResponsiveContainer width="100%" height="100%">
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
        <div className="bg-white/5 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-8 backdrop-blur-md print:bg-transparent print:border-black/10 print:text-black print:rounded-2xl signal-block">
          <div className="flex items-center gap-3 mb-6 sm:mb-8 border-b border-white/10 pb-4 print:border-black/10">
            <Target className="w-5 h-5 sm:w-6 sm:h-6 text-purple-400 print:text-purple-600" />
            <h3 className="text-lg sm:text-2xl font-heading italic print:not-italic print:font-bold">Roadmap to Perfection: 100/100</h3>
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
      <div className="flex justify-between items-end">
        <div>
          <div className="text-xs sm:text-sm font-bold text-white/90 print:text-black/90">{title}</div>
          <div className="text-[8px] sm:text-[10px] text-white/40 print:text-black/40 uppercase tracking-wider">{description}</div>
        </div>
        <div className="text-right flex-shrink-0">
          <span className="text-xs sm:text-sm font-heading italic text-purple-400 print:text-purple-600">{current}</span>
          <span className="text-[8px] sm:text-[10px] text-white/30 print:text-black/30 ml-1">/ {target} {unit}</span>
        </div>
      </div>
      <div className="h-1 sm:h-1.5 w-full bg-white/5 print:bg-gray-100 rounded-full overflow-hidden">
        <div 
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 print:bg-purple-600 transition-all duration-1000" 
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

function StatCard({ title, value }: { title: string, value: string | number }) {
  return (
    <div className="bg-white/5 border border-white/10 rounded-xl sm:rounded-2xl p-4 sm:p-6 backdrop-blur-md text-center print:bg-transparent print:border-black/10 print:text-black print:rounded-xl stat-card">
      <div className="text-white/60 print:text-black/60 text-[8px] sm:text-[10px] uppercase tracking-wider mb-1 sm:mb-2 font-bold">{title}</div>
      <div className="text-xl sm:text-3xl font-heading italic print:not-italic print:font-bold">
         {value}
      </div>
    </div>
  );
}

function SignalRow({ label, value, tooltip, valueClassName }: { label: string, value: string | number, tooltip?: string, valueClassName?: string }) {
  return (
    <div className="flex justify-between items-center text-[10px] sm:text-sm border-b border-white/5 print:border-black/5 pb-2 last:border-0 relative font-body group">
      <div className="flex items-center gap-2">
        <span className="text-white/70 print:text-black/70 cursor-help" title={tooltip}>{label}</span>
      </div>
      <span className={`font-medium bg-white/10 print:bg-gray-100 print:text-black px-2 sm:px-3 py-0.5 sm:py-1 rounded-full signal-row-value ${valueClassName || ''}`}>{value}</span>
    </div>
  );
}
