import { apiBaseUrl, baseUrl } from "./config.js";

export async function createUser(userData) {
  const response = await fetch(`${apiBaseUrl}users`, {
    method: "POST",
    body: JSON.stringify(userData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to create user");
  }

  const data = await response.json();

  return data;
}

export async function loginUser(loginData) {
  //This URL MUST be replaced when requesting data from the API

  try {
    const response = await fetch(
      `${apiBaseUrl}users?email=${loginData.email}&password=${loginData.password}`
    );

    const userData = await response.json();

    if (userData.length) {
      sessionStorage.setItem(
        "open-desks@user",
        JSON.stringify({
          name: userData[0].name,
          role: userData[0].role,
          userId: userData[0].id,
        })
      );
      window.location.assign(baseUrl);
      return;
    }

    throw new Error("User not Found");
  } catch (error) {
    console.log(error);
  }
}

export async function createProperty(propertyData) {
  console.log(propertyData);
  const response = await fetch(`${apiBaseUrl}properties`, {
    method: "POST",
    body: JSON.stringify(propertyData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export async function fetchProperties(ownerId) {
  let url = ownerId
    ? `${apiBaseUrl}properties?ownerId=${ownerId}`
    : `${apiBaseUrl}properties`;

  const response = await fetch(url);

  const data = await response.json();
  return data;
}

export async function fetchWorkspaces(propertyId) {
  console.log(1);
  try {
    const response = await fetch(
      `${apiBaseUrl}workspaces?propertyId=${propertyId}`
    );

    if (!response.ok) {
      throw new Error("Workspaces not found");
    }

    const data = await response.json();

    console.log(data);
    return data;
  } catch (error) {
    return {};
  }
}

export async function getWorkspaceInfo(id) {
  const apiResponse = await fetch(`${apiBaseUrl}workspaces?id=${id}`);
  if (!apiResponse.ok) {
    throw new Error("Api requested Failed.");
  }
  const workspaceData = await apiResponse.json();

  return workspaceData[0];
}

export async function createBooking(bookingData) {
  const response = await fetch(`${apiBaseUrl}bookings`, {
    method: "POST",
    body: JSON.stringify(bookingData),
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error("Failed to book workspace");
  }

  const data = await response.json();

  return data;
}
