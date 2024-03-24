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

export async function loginUser(loginData, callback) {
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
    if (callback) {
      callback();
    }
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

export async function updateProperty(propertyData) {
  const response = await fetch(
    `${apiBaseUrl}properties/${propertyData.propertyId}`,
    {
      method: "PUT",
      body: JSON.stringify(propertyData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update property");
  }

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

export async function getPropertyById(propertyId, ownerId) {
  let url = `${apiBaseUrl}properties?id=${propertyId}&ownerId=${ownerId}`;

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error("Something went wrong while fetching property");
  }

  const data = await response.json();

  return data[0];
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

export async function createWorkspace(workspaceData) {
  const response = await fetch(`${apiBaseUrl}workspaces`, {
    method: "POST",
    body: JSON.stringify(workspaceData),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  return data;
}

export async function updateWorkspace(workspaceData) {
  const response = await fetch(
    `${apiBaseUrl}workspaces/${workspaceData.workspaceId}`,
    {
      method: "PUT",
      body: JSON.stringify(workspaceData),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (!response.ok) {
    throw new Error("Failed to update property");
  }

  const data = await response.json();

  return data;
}

export async function getWorkspaceInfo(id, ownerId = undefined) {
  const url = ownerId
    ? `${apiBaseUrl}workspaces?id=${id}&ownerId=${ownerId}`
    : `${apiBaseUrl}workspaces?id=${id}`;

  const apiResponse = await fetch(url);
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

export async function getBookingInfo(id) {
  const apiResponse = await fetch(`${apiBaseUrl}bookings?id=${id}`);
  if (!apiResponse.ok) {
    throw new Error("Api requested Failed.");
  }
  const bookingData = await apiResponse.json();

  return bookingData[0];
}

export async function uploadImage(file) {
  const fileExtension = file.name.toLocaleLowerCase().split(".").pop();

  if (!["png", "jpg", "jpeg"].includes(fileExtension)) {
    throw new Error('Only "png", "jpg" and "jpeg" images are allowed.');
  }

  const formData = new FormData();
  formData.append("image", file);

  try {
    const response = await fetch("https://api.imgur.com/3/image", {
      method: "POST",
      body: formData,
      headers: {
        Authorization: "Client-ID 72accd0cd22bdf8",
      },
    });

    const { success, data } = await response.json();

    if (!success) {
      throw new Error("Image not uploaded");
    }

    return data.link;
  } catch (error) {
    console.log(error);
  }
}

export async function getPropertyInfo(id) {
  try {
    const response = await fetch(`${apiBaseUrl}properties/${id}`);
    if (!response.ok) {
      throw new Error("Property not found !");
    }

    const propertyData = await response.json();
    return propertyData;
  } catch (error) {
    console.log(error);
  }
}
