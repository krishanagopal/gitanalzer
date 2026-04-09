export async function getGithubAnalysis(username) {
  const response = await fetch(`http://localhost:5000/api/github/${username}`);
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
