const cityServices = require("../Services/cityServices");
const cityModel = require("../Model/cityModel");

exports.createPollutedCities = async () => {
  try {
    const pollutedCities = [];
    const getPollutedCities = await cityServices.getPollutedCitiesAPI();
    for (const getCityData of getPollutedCities) {
      const sanitizedData = keyword(getCityData?.name);
      const cityCheck = await cityServices.cityValidation(sanitizedData);
      if (cityCheck.length > 0) {
        const cityInformation = await cityServices.cityDescription(
          sanitizedData
        );
        const sanitizedCityData = {
          name: capitalizeFirstLetter(sanitizedData),
          country: "France",
          pollution: getCityData?.pollution,
          description: cityInformation?.description,
        };
        pollutedCities.push(sanitizedCityData);
      }
    }
    const storePollutedCities = await cityModel.insertPollutedCities(
      pollutedCities
    );

    return storePollutedCities;
  } catch (error) {
    console.log(error);
  }
};

function keyword(s) {
  var words = ["(Station)", "(Zone)", "(District)", "(Area)"];
  var re = new RegExp("\\b(" + words.join("|") + ")\\b", "g");
  return (s || "")
    .replace(re, "")
    .replace(/[ ]{2,}/, " ")
    .replace(/\(\)/g, "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f-\Łł]/g, "")
    .replace(/\s+/g, "");
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}
exports.createCountries = async (data) => {
  try {
    const createCountries = await cityModel.createCountries(data);
    return createCountries;
  } catch (error) {
    console.log("Error from create -->", error);
  }
};

exports.getPollutedCities = async (data) => {
  try {
    const fllterUrl = { ...data };
    if (fllterUrl) {
      console.log("Here in filter directory--->");
      const includedFields = ["country"];
      const urlKey = Object.keys(fllterUrl);
      const found = includedFields.some((data) => urlKey.includes(data));
      console.log("Here in page directory--->", fllterUrl);
      const offset = 10;
      if (found) {
        const filteredcity = await cityModel.getPollutedCitiesModel(
          fllterUrl.country,
          fllterUrl.page || 1
        );
        console.log("fp22wefeef-->", filteredcity.count);
        const cityData = {
          page: parseInt(fllterUrl?.page),
          limit: 10,
          total: filteredcity?.count,
          cities: filteredcity.data,
        };
        console.log("cityData-------->", cityData);
        return cityData;
      }
      return [];
    }
  } catch (error) {
    console.log(error);
  }
};
