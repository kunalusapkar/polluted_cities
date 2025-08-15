const cityBusiness = require("../Business/cityBusiness");

exports.createPollutedCities = async (req, res) => {
  try {
    const getPollutedCities = await cityBusiness.createPollutedCities();
    res.status(200).json({
      status: "success",
      count: getPollutedCities?.length,
      data: getPollutedCities,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.createCountries = async (req, res) => {
  try {
    const mainBody = req.body;
    const countries = await cityBusiness.createCountries(mainBody);
    res.status(200).json({
      status: "success",
      data: countries,
    });
  } catch (error) {
    console.log("Error from create -->", error);
  }
};

exports.getPollutedCities = async (req, res) => {
  try {
    const data = { ...req.query };
    const getPollutedCities = await cityBusiness.getPollutedCities(data);
    res.status(200).json(
      getPollutedCities
    );
  } catch (error) {
    console.log(error);
  }
};
