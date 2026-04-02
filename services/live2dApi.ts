export interface NetworkRole {
  id: string;
  name: string;
  url: string;
}

export const fetchNetworkRoles = async (): Promise<NetworkRole[]> => {
  try {
    const response = await fetch('/api/v2/live_2d/role_list');
    const result = await response.json();
    if (result.code === 0 && result.data?.roles) {
      return result.data.roles;
    }
    throw new Error(result.message || 'Failed to fetch network roles');
  } catch (err) {
    console.error('Error fetching network roles:', err);
    throw err;
  }
};
