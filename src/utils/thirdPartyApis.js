// Destiny Tracker
export async function GetElo(options = { params: { mode: 84, membershipId: 0, season: 10 } }) {
  try {
    const request = await fetch(`https://api-insights.destinytracker.com/api/d2/elo/${options.params.mode}/${options.params.membershipId}?season=${options.params.season}`);

    if (request.ok) {
      const response = await request.json();

      return response;
    } else {
      return false;
    }
  } catch (e) {
    return false;
  }
}
