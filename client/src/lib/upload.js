import { api } from './api';

export async function uploadToCloudinary(file, { folder = 'edunexus', resourceType = 'auto' } = {}) {
  if (!file) throw new Error('No file provided');
  const params = new URLSearchParams({ folder });
  const sigRes = await api.get(`/uploads/signature?${params.toString()}`);
  const { timestamp, signature, apiKey, cloudName } = sigRes.data;

  const form = new FormData();
  form.append('file', file);
  form.append('timestamp', timestamp);
  form.append('api_key', apiKey);
  form.append('signature', signature);
  form.append('folder', folder);

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
  const res = await fetch(endpoint, { method: 'POST', body: form });
  const data = await res.json();
  if (!res.ok) {
    const err = data?.error?.message || 'Cloudinary upload failed';
    throw new Error(err);
  }
  return data.secure_url;
}


