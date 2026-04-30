export async function getGithubAnalysis(username) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/github/${username}`);
  if (!response.ok) {
    let message = 'Failed to analyze developer profile';
    try {
      const errorData = await response.json();
      message = errorData.error || errorData.message || message;
    } catch (e) {
      // Ignored
    }
    throw new Error(message);
  }
  return response.json();
}
