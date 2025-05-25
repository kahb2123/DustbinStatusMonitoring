const API_KEY = 'AKE71QSJ17HZUB1Y';
const CHANNEL_ID = '2796967';

export const fetchBinData = async (results = 100) => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds.json?api_key=${API_KEY}&results=${results}`
    );
    const data = await response.json();
    return data.feeds;
  } catch (error) {
    console.error('Error fetching data from ThingSpeak:', error);
    return [];
  }
};

export const fetchLatestData = async () => {
  try {
    const response = await fetch(
      `https://api.thingspeak.com/channels/${CHANNEL_ID}/feeds/last.json?api_key=${API_KEY}`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching latest data:', error);
    return null;
  }
};