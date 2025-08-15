// @ts-check

/**
 * @class DataFetcher
 * @classdesc The data fetcher object that connects to the api
 * */
class DataFetcher {
  #endpoint;
  #query;
  #apiKey;
  #unit;
  /**
   * @type {object} #data
   * */
  #data;
  #weekData;
  #hoursData;
  /** @type {object} */
  #groupedHoursByDay;
  /** @type {URLSearchParams} #searchParams */
  #searchParams;
  #fullUrl;

  /**
   * @constructor
   * @param {string} endpoint - url endpoint
   * @param {string} query - search query, city, country
   * @param {string} apikey - the api key
   * @param {string} unit - the unit, metric, us, uk
   * */
  constructor(endpoint, query, apikey, unit) {
    this.#endpoint = endpoint;
    this.#query = query;
    this.#apiKey = apikey;
    this.#unit = unit;

    this.#weekData = [];
    this.#hoursData = [];

    this.setupSearchParameters();
    this.#fullUrl = new URL(
      `${this.#endpoint}${this.#query}?${this.#searchParams}`,
    );
  }

  /**
   * @method to setup the search parameters of the url query
   * */
  setupSearchParameters() {
    this.#searchParams = new URLSearchParams();
    this.#searchParams.append("unitGroup", this.#unit);
    this.#searchParams.append("key", this.#apiKey);
    this.#searchParams.append("contentType", "json");
  }

  get query() {
    return this.#query;
  }

  /**
   * @param {string} val
   * @returns {Promise<object | undefined>}
   * */
  setQuery(val) {
    this.#query = val;
    this.#fullUrl = new URL(
      `${this.#endpoint}${this.query}?${this.#searchParams}`,
    );
    return this.collect();
  }

  get unit() {
    return this.#unit;
  }

  /**
   * @param {string} val - metric, uk, us
   * */
  set unit(val) {
    this.#unit = val;
  }

  async collect() {
    try {
      const url = this.#fullUrl;
      const response = await fetch(url, { mode: "cors" });
      /** @type {Object} */
      const jsonResponse = await response.json();

      // extract data
      this.#data = {
        address: jsonResponse.address,
        resolvedAddress: jsonResponse.resolvedAddress,
        temperature: jsonResponse.currentConditions.temp,
        feelsLike: jsonResponse.currentConditions.feelslike,
        datetime: jsonResponse.currentConditions.datetime,
        humidity: jsonResponse.currentConditions.humidity,
        precipitation: jsonResponse.currentConditions.precip, // in mm
        precipprob: jsonResponse.currentConditions.precipprob, // probability of rain
        windspeed: jsonResponse.currentConditions.windspeed,
        solarenergy: jsonResponse.currentConditions.solarenergy,
        conditions: jsonResponse.currentConditions.conditions,
        icon: jsonResponse.currentConditions.icon,
        sunrise: jsonResponse.currentConditions.sunrise,
        sunset: jsonResponse.currentConditions.sunset,
      };

      let obj;

      this.#weekData = [];
      this.#hoursData = [];

      for (let day of jsonResponse.days) {
        obj = {
          datetime: day.datetime,
          tempmax: day.tempmax,
          tempmin: day.tempmin,
          temp: day.temp,
          feelslike: day.feelslike,
          humidity: day.humidity,
          precipitation: day.precip,
          precipprob: day.precipprob,
          windspeed: day.windspeed,
          solarenergy: day.solarenergy,
          sunrise: day.sunrise,
          sunset: day.sunset,
          conditions: day.conditions,
          description: day.description,
          icon: day.icon,
        };
        obj = {
          address: this.#data.address,
          resolvedAddress: this.#data.resolvedAddress,
          ...obj,
        };
        this.#weekData.push(obj);

        // Collect each day hours
        // TODO: Extract the hours data and associate each 24 hours list with the corresponding day
        // TODO: group result by day
        for (let hour of day.hours) {
          let hourObj = {
            datetime: hour.datetime,
            temp: hour.temp,
            feelslike: hour.feelslike,
            humidity: hour.humidity,
            precipitation: hour.precip,
            precipprob: hour.precipprob,
            windspeed: hour.windspeed,
            solarenergy: hour.solarenergy,
            conditions: hour.conditions,
            icon: hour.icon,
          };
          hourObj = { day: obj.datetime, ...hourObj };
          this.#hoursData.push(hourObj);
        }
      }

      this.#groupedHoursByDay = Object.groupBy(this.#hoursData, (hour) => {
        //group each 24 hours object by date
        return hour.day;
      });

      return this.#data;
    } catch (error) {
      console.error(error);
      return undefined;
    }
  }

  getURL() {
    return this.#fullUrl;
  }

  /**
   * @method to return the collected data object
   * @returns {object} data
   * */
  getData() {
    return this.#data;
  }

  /**
   * @method to return the week's data
   * @returns {object} data
   * */
  getWeekData() {
    return this.#weekData;
  }

  /**
   * @method to return the hourly data
   * @returns {Array}
   * */
  getHoursData() {
    return this.#hoursData;
  }

  /**
   * @method to return the hourly data grouped by day
   * @returns {Array}
   * */
  getGroupedHoursByDay() {
    return this.#groupedHoursByDay;
  }
}

/**
 * @module DataFetcher
 * */
export default DataFetcher;
