const axios = require("axios");

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
    const config = {
      headers: {
        "X-Api-Key": "S8R5Gpo5ZTAEj5X2Hb7vtA==CW3gmLGvLjc4BFKt", // Example: A custom header
      },
    };
    const cityValidationResponse = await axios.get(
      `https://api.api-ninjas.com/v1/city?name=${cityName}`,
      config
    );
    console.log(
      "cityValidationResponse.data---->",
      cityValidationResponse.data
    );
    return cityValidationResponse.data;
  } catch (error) {
    console.log("error from cvd",error);
  }
};

exports.cityDescription = async (cityName) => {
  try {
    const cityDescriptionResponse = await axios.get(
      `https://api.wikimedia.org/core/v1/wikipedia/en/page/${cityName}/description`
    );
    return cityDescriptionResponse?.data;
  } catch (error) {
    console.log("error from cd-->");
  }
};

const api = axios.create({
  baseURL: "https://be-recruitment-task.onrender.com",
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

// Response interceptor to handle token expiration and refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // If 401 and not already attempting to refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true; // Mark to prevent infinite loops

      try {
        // const refreshToken = localStorage.getItem("refreshToken"); // Or retrieve from HttpOnly cookie
        const res = await axios.post(
          "https://be-recruitment-task.onrender.com/auth/refresh",
          {
            refreshToken: "xyz456",
          }
        );
        const newAccessToken = res.data.token;
        console.log("Rttttt1111111111111111-------->", res.data);
        console.log("Rttttt2222222222-------->", newAccessToken);
        originalRequest.headers.Authorization = `${newAccessToken}`;

        return api(originalRequest); // Retry the original request
      } catch (refreshError) {
        // Refresh token expired or invalid, redirect to login
        console.error(
          "Refresh token expired or invalid, logging out:",
          refreshError
        );
        // Implement logout or redirect to login page
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  }
);
