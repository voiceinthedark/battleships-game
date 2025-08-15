// @ts-check
import TodayWeather from "./todayWeather.js";

/**
 * @class WeekDaysWeather
 * @classdesc formats a list of object data into todayWeather objects
 * */
class WeekDaysWeather {
  #weekDaysData;
  #weekDays;

  /**
   * @constructor
   * @param {Array<object>} weekDaysData
   * */
  constructor(weekDaysData) {
    this.#weekDaysData = weekDaysData;
    this.#weekDays = [];

    this.#formatData();
  }

  /**
   * @method to format the data into Today objects
   * */
  #formatData() {
    for (let day of this.#weekDaysData) {
      this.#weekDays.push(new TodayWeather(day));
    }
  }

  /**
   * @method to return an array of TodayWeather
   * @returns {Array<TodayWeather>}
   * */
  getDays() {
    return this.#weekDays;
  }
}

/**
 * @module WeekDaysWeather
 * */
export default WeekDaysWeather;
