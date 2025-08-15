const axios = require("axios");
const config = require("../config.json");

exports.getPollutedCitiesAPI = async () => {
  var currentPage = 1;
  var hasMorePages = true;
  var allData = [];
  while (hasMorePages) {
    try {
      const getPollutedCities = await api.get(
        `/pollution?country=FR&limit=5&page=${currentPage}`
      );
      const pageData = getPollutedCities.data.results;
      console.log("In here mx", getPollutedCities.data.meta.totalPages);
      allData = allData.concat(pageData);
      if (
        getPollutedCities.data.meta.page <=
        getPollutedCities.data.meta.totalPages
      ) {
        console.log("In here", currentPage);
        currentPage++;
      } else {
        hasMorePages = false;
        console.log("In here22222222");
      }
      console.log("rdlengthhhh----------->", allData.length);
    } catch (error) {
      console.log("error---->", error);
    }
  }
  return allData;
};

exports.cityValidation = async (cityName) => {
  try {
    const configHeaders = {
      headers: {
        "X-Api-Key": process.env.CITY_VALIDATION_API_KEY, // Example: A custom header
      },
    };
    const cityValidationResponse = await axios.get(
      `${config.cityCheckBaseUrl}?name=${cityName}`,
      configHeaders
    );
    return cityValidationResponse.data;
  } catch (error) {
    console.log("error from cvd", error);
  }
};

exports.cityDescription = async (cityName) => {
  try {
    const cityDescriptionResponse = await axios.get(
      `${config.wikiBaseUrl}/${cityName}/description`
    );
    return cityDescriptionResponse?.data;
  } catch (error) {
    console.log("error from cd-->");
  }
};

const api = axios.create({
  baseURL: config.apiBaseUrl,
});

// Request interceptor to add the access token
api.interceptors.request.use(
  (config) => {
    const accessToken = config.headers.Authorization;
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops

      try {
        const res = await axios.post(`${config.apiBaseUrl}/auth/refresh`, {
          refreshToken: "xyz456",
        });
        const newAccessToken = res.data.token;
        originalRequest.headers.Authorization = `${newAccessToken}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        console.error(
          "Refresh token expired or invalid, logging out:",
          refreshError
        );
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
