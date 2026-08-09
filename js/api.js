/**
 * ==========================================================
 * HAKI CAFE SYSTEM
 * FRONTEND API CLIENT
 * ==========================================================
 */


/**
 * Make a request to the Apps Script API.
 */

async function apiRequest(action) {

  const response =
    await fetch(
      API_URL +
      "?action=" +
      encodeURIComponent(action)
    );


  if (!response.ok) {

    throw new Error(
      `API request failed: ${response.status}`
    );

  }


  const result =
    await response.json();


  if (!result.success) {

    throw new Error(
      result.error ||
      "API returned an error."
    );

  }


  return result;

}
