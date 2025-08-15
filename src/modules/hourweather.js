// @ts-check

/**
 * @class HourWeather
 * @classdesc Collect the hourly weather forecast for the day
 * */
class HourWeather {
  #datetime;
  #temp;
  #feelslike;
  #humidity;
  #precipitation;
  #precipprob;
  #windspeed;
  #solarenergy;
  #conditions;
  #icon;
  /**
   * @constructor
   * @param {Object} dayHourData
   * @param {string} dayHourData.datetime
   * @param {number} dayHourData.temp
   * @param {number} dayHourData.feelslike
   * @param {number} dayHourData.humidity
   * @param {number} dayHourData.precipitation
   * @param {number} dayHourData.precipprob
   * @param {number} dayHourData.windspeed
   * @param {number} dayHourData.solarenergy
   * @param {string} dayHourData.conditions
   * @param {string} dayHourData.icon
   * */
  constructor(dayHourData) {
    this.#datetime = dayHourData.datetime;
    this.#temp = dayHourData.temp;
    this.#feelslike = dayHourData.feelslike;
    this.#humidity = dayHourData.humidity;
    this.#precipitation = dayHourData.precipitation;
    this.#precipprob = dayHourData.precipprob;
    this.#windspeed = dayHourData.windspeed;
    this.#solarenergy = dayHourData.solarenergy;
    this.#conditions = dayHourData.conditions;
    this.#icon = dayHourData.icon;
  }

  get datetime() {
    return this.#datetime;
  }
  get temp() {
    return this.#temp;
  }
  get feelslike() {
    return this.#feelslike;
  }
  get humidity() {
    return this.#humidity;
  }
  get precipitation() {
    return this.#precipitation;
  }
  get precipprob() {
    return this.#precipprob;
  }
  get windspeed() {
    return this.#windspeed;
  }
  get solarenergy() {
    return this.#solarenergy;
  }
  get conditions() {
    return this.#conditions;
  }
  get icon() {
    return this.#icon;
  }
}

/** @module HourWeather */
export default HourWeather;
