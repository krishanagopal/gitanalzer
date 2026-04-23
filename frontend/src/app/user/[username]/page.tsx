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
    const level = Number(score) < 30 ? 'Code Explorer' : Number(score) < 60 ? 'Consistent Coder' : Number(score) < 85 ? 'Full Stack Builder' : 'Product Engineer';
    
    return {
      title: `${name}'s Developer Level: ${level} | GitAnalyzer`,
      description: `Check out the deep engineering analysis for ${name}. GitAnalyzer level: ${level} based on commit patterns, documentation, and collaboration.`,
      openGraph: {
        title: `${name} reached ${level} level on GitAnalyzer`,
        description: `High-fidelity engineering report for ${name}. View recruiter signals, coding habits, and more.`,
        type: 'profile',
        username: username,
      },
      twitter: {
        card: 'summary_large_image',
        title: `${name}'s GitAnalyzer Report`,
        description: `Professional scorecard for ${name}. Level: ${level}`,
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
