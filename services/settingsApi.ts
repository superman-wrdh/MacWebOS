export interface Wallpaper {
  id: string;
  url: string;
}

export const fetchNetworkWallpapers = async (): Promise<Wallpaper[]> => {
  try {
    const response = await fetch('/api/v2/settings/wallpaper');
    const result = await response.json();
    if (result.code === 0 && result.data) {
      return result.data;
    }
    throw new Error(result.message || 'Failed to fetch network wallpapers');
  } catch (err) {
    console.error('Error fetching network wallpapers:', err);
    throw err;
  }
};
