import { apiBaseUrl, baseUrl } from './config.js';

export async function createUser(userData) {
  const response = await fetch(`${apiBaseUrl}/users/signup`, {
    method: 'POST',
    body: JSON.stringify(userData),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to create user');
  }

  const data = await response.json();

  return data;
}

export async function loginUser(loginData, callback, redirectUrl) {
  //This URL MUST be replaced when requesting data from the API

  try {
    const response = await fetch(`${apiBaseUrl}/users/login`, {
      method: 'POST',
      body: JSON.stringify({
        email: loginData.email,
        password: loginData.password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    const userData = await response.json();

    if (!userData.error) {
      console.log(userData);
      sessionStorage.setItem(
        'open-desks@user',
        JSON.stringify({
          name: userData.data.user.name,
          role: userData.data.user.role,
          userId: userData.data.user._id,
        })
      );

      if (redirectUrl) {
        window.location.assign(redirectUrl);
        return;
      }

      window.location.assign(baseUrl);
      return;
    }

    throw new Error('User not Found');
  } catch (error) {
    if (callback) {
      callback();
    }
    console.log(error);
  }
}

export async function createProperty(propertyData) {
  const response = await fetch(`${apiBaseUrl}/properties`, {
    method: 'POST',
    body: JSON.stringify(propertyData),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const data = await response.json();
  return data;
}

export async function updateProperty(propertyData) {
  const response = await fetch(
    `${apiBaseUrl}/properties/${propertyData.propertyId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(propertyData),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update property');
  }

  const data = await response.json();

  return data;
}

export async function fetchProperties(ownerId, filters) {
  let url = ownerId
    ? `${apiBaseUrl}/properties?ownerId=${ownerId}`
    : `${apiBaseUrl}/properties`;

  if (filters) {
    url = new URL(url);
    Object.entries(filters).forEach(function ([key, value]) {
      url.searchParams.set(key, Boolean(Number(value)));
    });
  }

  const response = await fetch(url, {
    credentials: 'include',
  });

  const data = await response.json();
  return data.data.properties;
}

export async function getPropertyById(propertyId, ownerId) {
  let url = `${apiBaseUrl}/properties/${propertyId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('Something went wrong while fetching property');
  }

  const data = await response.json();
  console.log(data);

  return data.data.property;
}

export async function fetchWorkspaces(propertyId) {
  try {
    const response = await fetch(
      `${apiBaseUrl}/workspaces?propertyId=${propertyId}`,
      {
        credentials: 'include',
      }
    );

    if (!response.ok) {
      throw new Error('Workspaces not found');
    }

    const data = await response.json();

    return data.data.workspace;
  } catch (error) {
    return {};
  }
}

export async function createWorkspace(workspaceData) {
  const response = await fetch(`${apiBaseUrl}/workspaces`, {
    method: 'POST',
    body: JSON.stringify(workspaceData),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });
  const data = await response.json();
  return data;
}

export async function updateWorkspace(workspaceData) {
  const response = await fetch(
    `${apiBaseUrl}/workspaces/${workspaceData.workspaceId}`,
    {
      method: 'PATCH',
      body: JSON.stringify(workspaceData),
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    }
  );

  if (!response.ok) {
    throw new Error('Failed to update property');
  }

  const data = await response.json();

  return data;
}

export async function getWorkspaceInfo(id, ownerId = undefined) {
  const url = ownerId
    ? `${apiBaseUrl}/workspaces/${id}?ownerId=${ownerId}`
    : `${apiBaseUrl}/workspaces/${id}`;

  const apiResponse = await fetch(url, {
    credentials: 'include',
  });
  if (!apiResponse.ok) {
    throw new Error('Api requested Failed.');
  }
  const workspaceData = await apiResponse.json();

  return workspaceData.data.workspace;
}

export async function createBooking(bookingData, workspaceId) {
  const response = await fetch(`${apiBaseUrl}/workspaces/${workspaceId}/rent`, {
    method: 'POST',
    body: JSON.stringify(bookingData),
    headers: {
      'Content-Type': 'application/json',
    },
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Failed to book workspace');
  }

  const data = await response.json();
  return data.data;
}

export async function getBookingInfo(id) {
  const apiResponse = await fetch(`${apiBaseUrl}bookings?id=${id}`);
  if (!apiResponse.ok) {
    throw new Error('Api requested Failed.');
  }
  const bookingData = await apiResponse.json();

  return bookingData[0];
}

export async function uploadImage(file) {
  const fileExtension = file.name.toLocaleLowerCase().split('.').pop();

  if (!['png', 'jpg', 'jpeg'].includes(fileExtension)) {
    throw new Error('Only "png", "jpg" and "jpeg" images are allowed.');
  }

  const formData = new FormData();
  formData.append('image', file);

  try {
    const response = await fetch('https://api.imgur.com/3/image', {
      method: 'POST',
      body: formData,
      headers: {
        Authorization: 'Client-ID 72accd0cd22bdf8',
      },
    });

    const { success, data } = await response.json();

    if (!success) {
      throw new Error('Image not uploaded');
    }

    return data.link;
  } catch (error) {
    console.log(error);
  }
}

export async function getPropertyInfo(id) {
  try {
    const response = await fetch(`${apiBaseUrl}/properties/${id}`);
    if (!response.ok) {
      throw new Error('Property not found !');
    }

    const propertyData = await response.json();
    return propertyData.data.property;
  } catch (error) {
    console.log(error);
  }
}

export async function getMyBookings() {
  let url = `${apiBaseUrl}/users/my-bookings`;

  const response = await fetch(url, {
    credentials: 'include',
  });

  if (!response.ok) {
    throw new Error('Something went wrong while fetching property');
  }

  const data = await response.json();

  return data.data;
}
