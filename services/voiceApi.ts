export const fetchVoiceToken = async (): Promise<string> => {
  try {
    const response = await fetch('/api/v2/openai/realtime_token');
    const result = await response.json();
    if (result.code === 0 && result.data?.client_secret) {
      return result.data.client_secret;
    }
    throw new Error(result.message || 'Failed to get token');
  } catch (err) {
    console.error('Error fetching token:', err);
    throw err;
  }
};

export const fetchVoiceSDP = async (offerSdp: string, token: string, voice: string): Promise<string> => {
  const baseUrl = 'https://api.openai.com/v1/realtime';
  const model = 'gpt-4o-realtime-preview-2024-12-17';
  
  const response = await fetch(`${baseUrl}?model=${model}&voice=${voice}`, {
    method: 'POST',
    body: offerSdp,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/sdp',
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to get SDP answer: ${response.statusText}`);
  }

  return await response.text();
};
