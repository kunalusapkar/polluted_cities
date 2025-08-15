const db = require("../utilities/mysqlConnector");

exports.createCountries = async (data) => {
  try {
    const keys = Object.keys(data[0]);
    const mappedCountry = data.map((obj) => keys.map((key) => obj[key]));
    const createCountry = await db.runQuery(
      "INSERT INTO country(country_name,country_code)VALUES ?",
      [data.map((item) => [item.country_name, item.country_code])]
    );
    return createCountry;
  } catch (error) {
    console.log("Error from createProperty -->", error);
  }
};

exports.insertPollutedCities = async (data) => {
  try {
    const createPollutedCities = await db.runQuery(
      "INSERT IGNORE INTO polluted_cities(name,pollution,description,country)VALUES ?",
      [
        data.map((item) => [
          item.name,
          item.pollution,
          item.description,
          item.country,
        ]),
      ]
    );
    return createPollutedCities;
  } catch (error) {
    console.log("Error from insertPollutedCities -->", error);
  }
};

exports.getPollutedCitiesModel = async (values, page) => {
  try {
    const offset = (page - 1) * 10;
    const totalData = await db.runQuery(
      `select count(*) as total from polluted_cities where country =?`,
      [values]
    );
    const filteredData = await db.runQuery(
      `select name,pollution,description,country from polluted_cities where country =? limit 10 offset ?`,
      [values, offset]
    );
    return { data: filteredData, count: totalData[0].total };
  } catch (error) {
    console.log("Error from property pagination -->", error);
  }
};
