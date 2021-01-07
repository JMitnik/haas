import fetch from 'node-fetch';

export const fetchTunnelUrl = async () => {
  try {
    if (process.env.NODE_ENV === 'production') throw new Error('Tunnels are not used in production!');
    const tunnelData = await (await fetch('http://localhost:4040/api/tunnels')).json();

    if (!tunnelData) return 'http://localhost:4000';
    
    const tunnel = tunnelData.tunnels.find((tunnel: any) => tunnel.public_url);
    return tunnel.public_url;
  } catch (error) {
    return '';
  } 
};