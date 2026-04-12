import { Metadata } from 'next';
import { DashboardClient } from './DashboardClient';
import { getGithubAnalysis } from '../../../lib/api';

interface Props {
  params: { username: string };
}

export async function generateMetadata(
  { params }: { params: Promise<{ username: string }> }
): Promise<Metadata> {
  const { username } = await params;
  
  try {
    const data = await getGithubAnalysis(username);
    const score = data.score;
    const name = data.profile.name || username;
    
    return {
      title: `${name}'s Developer Score: ${score}/100 | GitAnalyzer`,
      description: `Check out the deep engineering analysis for ${name}. GitAnalyzer score: ${score}/100 based on commit patterns, documentation, and collaboration.`,
      openGraph: {
        title: `${name} scored ${score}/100 on GitAnalyzer`,
        description: `High-fidelity engineering report for ${name}. View recruiter signals, coding habits, and more.`,
        type: 'profile',
        username: username,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name}'s GitAnalyzer Report`,
        description: `Professional scorecard for ${name}. Score: ${score}/100`,
      }
    };
  } catch (error) {
    return {
      title: `${username} | GitAnalyzer`,
      description: 'Analyze developer engineering depth and project complexity.',
    };
  }
}

export default async function Page({ params }: { params: Promise<{ username: string }> }) {
  const { username } = await params;
  
  return <DashboardClient username={username} />;
}
