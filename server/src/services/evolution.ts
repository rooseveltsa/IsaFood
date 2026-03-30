const API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const API_KEY = process.env.EVOLUTION_API_KEY || '';
const INSTANCE = process.env.EVOLUTION_INSTANCE || 'isafood';

function headers(): Record<string, string> {
  return {
    'Content-Type': 'application/json',
    apikey: API_KEY,
  };
}

function formatPhone(phone: string): string {
  // Ensure phone has country code and WhatsApp suffix
  const cleaned = phone.replace(/\D/g, '');
  return `${cleaned}@s.whatsapp.net`;
}

export async function sendText(phone: string, message: string): Promise<void> {
  const response = await fetch(`${API_URL}/message/sendText/${INSTANCE}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      number: formatPhone(phone),
      text: message,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Evolution API sendText failed (${response.status}): ${body}`);
  }
}

export async function sendImage(
  phone: string,
  imageUrl: string,
  caption?: string,
): Promise<void> {
  const response = await fetch(`${API_URL}/message/sendMedia/${INSTANCE}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      number: formatPhone(phone),
      mediatype: 'image',
      media: imageUrl,
      caption: caption || '',
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Evolution API sendImage failed (${response.status}): ${body}`);
  }
}

export async function sendButtons(
  phone: string,
  title: string,
  buttons: Array<{ buttonId: string; buttonText: { displayText: string } }>,
): Promise<void> {
  const response = await fetch(`${API_URL}/message/sendButtons/${INSTANCE}`, {
    method: 'POST',
    headers: headers(),
    body: JSON.stringify({
      number: formatPhone(phone),
      title,
      buttons,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Evolution API sendButtons failed (${response.status}): ${body}`);
  }
}

export async function checkConnection(): Promise<{ instance: string; state: string }> {
  const response = await fetch(`${API_URL}/instance/connectionState/${INSTANCE}`, {
    method: 'GET',
    headers: headers(),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`Evolution API connectionState failed (${response.status}): ${body}`);
  }

  const data = (await response.json()) as { instance: { state: string } };
  return {
    instance: INSTANCE,
    state: data.instance?.state || 'unknown',
  };
}
