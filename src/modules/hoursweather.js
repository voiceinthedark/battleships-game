// @ts-check

import HourWeather from "./hourweather";

/**
 * @class HoursWeather
 * @classdesc A collection of HourWeather objects for the entire 24 hours a day
 * */
class HoursWeather {
  #hoursData;
  /** @type {Array<HourWeather>} */
  #hours;

  /**
   * @constructor
   * @param {Array<Object>} hoursData
   * */
  constructor(hoursData) {
    this.#hoursData = hoursData;
    this.#hours = [];

    this.#formatData();
  }

  #formatData() {
    for (let hour of this.#hoursData) {
      this.#hours.push(new HourWeather(hour));
    }
  }

  getHours() {
    return this.#hours;
  }
}

/** @module HoursWeather */
export default HoursWeather;
