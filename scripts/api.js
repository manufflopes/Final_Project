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
  console.log(loginData);
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
