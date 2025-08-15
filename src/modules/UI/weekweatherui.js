// @ts-check

import TodayWeather from "../todayWeather.js";
import UIManager from "./uimanager.js";
import { format, parse } from "date-fns";

/**
 * @class WeeKWeatherUI
 * @classdesc class to render the week days weather forecast
 * */
class WeeKWeatherUI {
  #uimanager;

  /**
   * @constructor
   * @param {UIManager} uimanager
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager;
  }

  /**
   * @method to render entire week forecast
   * @param {Array<TodayWeather>} weekDays
   * @param {Function} handleClickCallback
   * @returns {HTMLElement} week item that contains the entire week forecast
   * */
  renderWeekCards(weekDays, handleClickCallback) {
    const week = document.createElement("div");
    week.classList.add("week-list");
    for (let day of weekDays) {
      const dayCard = this.renderWeekDayCard(day, handleClickCallback);
      week.appendChild(dayCard);
    }
    return week;
  }

  /**
   * @method to render a weekday weather forecast
   * @param {TodayWeather} day - the day data
   * @param {Function} handleClickCallback
   * @returns {HTMLElement} weekDayFrame
   * */
  renderWeekDayCard(day, handleClickCallback) {
    const weekDayFrame = document.createElement("div");
    weekDayFrame.classList.add("week-frame");
    const date = this.#uimanager.addElement("span", weekDayFrame, "week-date");
    date.textContent = format(day.datetime, "eeee do MMM");
    const weekDayCard = this.#uimanager.addElement(
      "div",
      weekDayFrame,
      "week-card",
    );

    /** TOP SECTION **/
    const weekTopDiv = this.#uimanager.addElement(
      "div",
      weekDayCard,
      "week-top-div",
    );
    const weekTopLeftDiv = this.#uimanager.addElement(
      "div",
      weekTopDiv,
      "week-top-left-div",
    );
    const icon = this.#uimanager.addElement("img", weekTopLeftDiv, "week-icon");
    if (icon instanceof HTMLImageElement) {
      icon.src = this.#uimanager.icons[day.icon];
    }
    const temperature = this.#uimanager.addElement(
      "span",
      weekTopLeftDiv,
      "week-temp",
    );
    temperature.textContent = `${day.temperature}°C`;
    const weekTopRightDiv = this.#uimanager.addElement(
      "div",
      weekTopDiv,
      "week-top-right-div",
    );
    const tempmaxDiv = this.#uimanager.addElement(
      "div",
      weekTopRightDiv,
      "week-temp-max-div",
    );
    const tempMaxIcon = this.#uimanager.addElement(
      "img",
      tempmaxDiv,
      "week-temp-max-icon",
    );
    if (tempMaxIcon instanceof HTMLImageElement) {
      tempMaxIcon.src = this.#uimanager.icons["tempmax"];
    }
    const tempMax = this.#uimanager.addElement(
      "span",
      tempmaxDiv,
      "week-temp-max",
    );
    tempMax.textContent = `${day.tempmax}°C`;
    const tempminDiv = this.#uimanager.addElement(
      "div",
      weekTopRightDiv,
      "week-temp-min-div",
    );
    const tempMinIcon = this.#uimanager.addElement(
      "img",
      tempminDiv,
      "week-temp-min-icon",
    );
    if (tempMinIcon instanceof HTMLImageElement) {
      tempMinIcon.src = this.#uimanager.icons["tempmin"];
    }
    const tempMin = this.#uimanager.addElement(
      "span",
      tempminDiv,
      "week-temp-min",
    );
    tempMin.textContent = `${day.tempmin}°C`;
    const feelsDiv = this.#uimanager.addElement(
      "div",
      weekTopRightDiv,
      "week-feels-div",
    );
    const feelsIcon = this.#uimanager.addElement(
      "img",
      feelsDiv,
      "week-feels-icon",
    );
    if (feelsIcon instanceof HTMLImageElement) {
      feelsIcon.src = this.#uimanager.icons["tempfeels"];
    }
    const feels = this.#uimanager.addElement("span", feelsDiv, "week-feels");
    feels.textContent = `${day.feelslike}°C`;

    /** MIDDLE SECTION **/
    const weekMidDiv = this.#uimanager.addElement(
      "div",
      weekDayCard,
      "week-mid-div",
    );
    const weekMidLeftDiv = this.#uimanager.addElement(
      "div",
      weekMidDiv,
      "week-mid-left-div",
    );
    const sunriseDiv = this.#uimanager.addElement(
      "div",
      weekMidLeftDiv,
      "week-mid-sun-div",
    );
    const sunriseIcon = this.#uimanager.addElement(
      "img",
      sunriseDiv,
      "week-sunrise-icon",
    );
    if (sunriseIcon instanceof HTMLImageElement) {
      sunriseIcon.src = this.#uimanager.icons["sunrise"];
    }
    const sunrise = this.#uimanager.addElement(
      "span",
      sunriseDiv,
      "week-sunrise",
    );
    sunrise.textContent = format(
      parse(day.sunrise, "HH:mm:ss", day.datetime),
      "kk:mm",
    );
    const sunsetDiv = this.#uimanager.addElement(
      "div",
      weekMidLeftDiv,
      "week-mid-set-div",
    );
    const sunsetIcon = this.#uimanager.addElement(
      "img",
      sunsetDiv,
      "week-sunset-icon",
    );
    if (sunsetIcon instanceof HTMLImageElement) {
      sunsetIcon.src = this.#uimanager.icons["sunset"];
    }
    const sunset = this.#uimanager.addElement("span", sunsetDiv, "week-sunset");
    sunset.textContent = format(
      parse(day.sunset, "HH:mm:ss", day.datetime),
      "kk:mm",
    );

    const weekMidRightDiv = this.#uimanager.addElement(
      "div",
      weekMidDiv,
      "week-mid-right-div",
    );
    const humidityDiv = this.#uimanager.addElement(
      "div",
      weekMidRightDiv,
      "week-humidity-div",
    );
    const humidityIcon = this.#uimanager.addElement(
      "img",
      humidityDiv,
      "week-humidity-icon",
    );
    if (humidityIcon instanceof HTMLImageElement) {
      humidityIcon.src = this.#uimanager.icons["humidity"];
    }
    const humidity = this.#uimanager.addElement(
      "span",
      humidityDiv,
      "week-humidity",
    );
    humidity.textContent = `${day.humidity}%`;

    const precipDiv = this.#uimanager.addElement(
      "div",
      weekMidRightDiv,
      "week-precip-div",
    );
    const precipIcon = this.#uimanager.addElement(
      "img",
      precipDiv,
      "week-precip-icon",
    );
    if (precipIcon instanceof HTMLImageElement) {
      precipIcon.src = this.#uimanager.icons["precipitation"];
    }
    const precip = this.#uimanager.addElement("span", precipDiv, "week-precip");
    precip.textContent = `${day.precipprob}%`;

    /** BOTTOM SECTION **/
    const weekBotDiv = this.#uimanager.addElement(
      "div",
      weekDayCard,
      "week-bot-div",
    );
    // const conditions = this.#uimanager.addElement('span', weekBotDiv, 'week-conditions')
    const description = this.#uimanager.addElement(
      "span",
      weekBotDiv,
      "week-description",
    );
    description.textContent = day.description;

    // set up background
    if (weekDayCard instanceof HTMLElement) {
      weekDayCard.classList.add(day.icon);
    }

    weekDayFrame.addEventListener("click", () => {
      // console.log(`inside week day ${day.id}`)
      handleClickCallback(day.id);
    });

    return weekDayFrame;
  }
}

/**
 * @module WeeKWeatherUI
 * */
export default WeeKWeatherUI;
