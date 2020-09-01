const defaults = {
  cache: 'no-cache',
  headers: {
    'Content-Type': 'application/json',
  },
};

export function PostMember(payload) {
  try {
    fetch('https://voluspa.braytech.org/Enqueue/Store', {
      ...defaults,
      method: 'POST',
      body: JSON.stringify(payload),
    });
  } catch (e) {
    return false;
  }
}

export async function PostPatreon(payload) {
  try {
    const request = await fetch('https://voluspa.braytech.org/Patreon/Set', {
      ...defaults,
      method: 'POST',
      body: JSON.stringify(payload),
    });

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

export async function GetStatistics() {
  try {
    const request = await fetch('https://voluspa.braytech.org/Statistics', defaults);

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

export async function GetNotifications() {
  try {
    const request = await fetch('https://voluspa.braytech.org/Notifications', defaults);

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

export async function GetBlogPosts() {
  try {
    const request = await fetch('https://voluspa.braytech.org/Blog/Posts', {
      headers: {
        'Content-Type': 'application/json',
      },
    });

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

export async function GetGearAsset(reference_id) {
  try {
    const request = await fetch(`https://voluspa.braytech.org/Manifest/gear-asset/?reference_id=${reference_id}`, defaults);

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
