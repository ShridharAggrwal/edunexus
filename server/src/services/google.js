const { google } = require('googleapis');

function requireEnv(keys) {
  const missing = keys.filter((k) => !process.env[k]);
  if (missing.length) {
    throw new Error(`Missing Google env vars: ${missing.join(', ')}`);
  }
}

function getOAuthClient() {
  requireEnv(['GOOGLE_CLIENT_ID', 'GOOGLE_CLIENT_SECRET', 'GOOGLE_REDIRECT_URI', 'GOOGLE_REFRESH_TOKEN']);
  const { GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI, GOOGLE_REFRESH_TOKEN } = process.env;
  const oAuth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_REDIRECT_URI);
  oAuth2Client.setCredentials({ refresh_token: GOOGLE_REFRESH_TOKEN });
  return oAuth2Client;
}

async function createMeetEvent({ title, startAt }) {
  try {
    const auth = getOAuthClient();
    const calendar = google.calendar({ version: 'v3', auth });
    const timeStart = new Date(startAt);
    const timeEnd = new Date(new Date(startAt).getTime() + 60 * 60 * 1000);
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';

    const requestBody = {
      summary: title,
      start: { dateTime: timeStart.toISOString(), timeZone },
      end: { dateTime: timeEnd.toISOString(), timeZone },
      conferenceData: {
        createRequest: {
          requestId: 'edunexus-' + Math.random().toString(36).slice(2),
          conferenceSolutionKey: { type: 'hangoutsMeet' },
        },
      },
    };

    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    const { data } = await calendar.events.insert({
      calendarId,
      resource: requestBody,
      conferenceDataVersion: 1,
    });

    const meetUrl = data.hangoutLink || data?.conferenceData?.entryPoints?.find((e) => e.entryPointType === 'video')?.uri;
    if (!meetUrl) {
      throw new Error('Google did not return a Meet link (check Calendar API and conferenceDataVersion=1)');
    }
    return { meetUrl, eventId: data.id };
  } catch (err) {
    // Surface detailed Google API error message
    const msg = err?.errors?.[0]?.message || err?.response?.data?.error?.message || err.message || 'Unknown Google error';
    throw new Error(`Google Calendar error: ${msg}`);
  }
}

async function deleteEvent(eventId) {
  try {
    const auth = getOAuthClient();
    if (!eventId) return;
    const calendar = google.calendar({ version: 'v3', auth });
    const calendarId = process.env.GOOGLE_CALENDAR_ID || 'primary';
    await calendar.events.delete({ calendarId, eventId });
  } catch (err) {
    // Log but do not crash
    // eslint-disable-next-line no-console
    console.error('Google delete event error:', err?.message || err);
  }
}

module.exports = { createMeetEvent, deleteEvent };


