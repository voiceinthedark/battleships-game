// @ts-check
import TodayWeather from "../todayWeather.js";
import UIManager from "./uimanager.js";

/**
 * @class
 * @classdesc responsible for rendering the day card onto the page
 */
class DayWeatherUI {
  #uimanager;
  #uiBackground;
  /**
   * @constructor
   * @description Creates an instance of DayWeatherUI.
   * @param {UIManager} uimanager
   */
  constructor(uimanager) {
    this.#uimanager = uimanager;
    this.#uiBackground = [
      "clear-day",
      "clear-night",
      "cloudy",
      "rain",
      "thunder",
      "snow",
      "snow-showers-day",
      "snow-showers-night",
      "thunder-rain",
      "thunder-showers-day",
      "thunder-showers-night",
      "showers-day",
      "showers-night",
      "fog",
      "wind",
      "partly-cloudy-day",
      "partly-cloudy-night",
      "hail",
      "rain-snow-showers-day",
      "rain-snow-showers-night",
      "rain-snow",
      "sleet",
    ];
  }
  /**
   * @method
   * @description Renders the day card onto the page.
   * @param {TodayWeather} day - The day data to render.
   * @param {Function} handleClickCallback
   * @returns {HTMLElement} The rendered day card element.
   */
  renderDayCard(day, handleClickCallback) {
    const dayCard = document.createElement("div");
    dayCard.classList.add("day-card");

    /** Day card Header **/
    const topDiv = this.#uimanager.addElement("div", dayCard, "day-top-div");
    const topDivLeft = this.#uimanager.addElement(
      "div",
      topDiv,
      "day-top-div-left",
    );
    const icon = this.#uimanager.addElement("img", topDivLeft, "day-icon");
    if (icon instanceof HTMLImageElement) {
      if (day.icon && this.#uimanager.icons[day.icon]) {
        icon.src = this.#uimanager.icons[day.icon];
      } else {
        icon.src = this.#uimanager.icons["clear"];
      }
    }
    const temperature = this.#uimanager.addElement(
      "span",
      topDivLeft,
      "day-temp",
    );
    temperature.textContent = `${day.temperature}°C`;
    const feelslike = this.#uimanager.addElement(
      "span",
      topDivLeft,
      "day-feel",
    );
    feelslike.textContent = `Feels ${day.feelslike}°C`;
    const topDivRight = this.#uimanager.addElement(
      "div",
      topDiv,
      "day-top-div-right",
    );

    const addressDiv = this.#uimanager.addElement(
      "div",
      topDivRight,
      "day-address-div",
    );
    const address = this.#uimanager.addElement(
      "span",
      addressDiv,
      "day-address",
    );
    address.textContent = `${day.address}`;
    const resolvedAddress = this.#uimanager.addElement(
      "span",
      addressDiv,
      "day-resolved-address",
    );
    resolvedAddress.textContent = `${day.resolvedAddress}`;
    const date = this.#uimanager.addElement("span", topDivRight, "day-date");
    date.textContent = day.datetime;

    /** Day Card Body **/
    const bodyDiv = this.#uimanager.addElement("div", dayCard, "day-body");
    const bodyTopDiv = this.#uimanager.addElement(
      "div",
      bodyDiv,
      "day-body-top",
    );
    /** Humidity **/
    const humDiv = this.#uimanager.addElement(
      "div",
      bodyTopDiv,
      "day-humidity-div",
    );
    const humidityIcon = this.#uimanager.addElement(
      "img",
      humDiv,
      "day-humidity-icon",
    );
    if (humidityIcon instanceof HTMLImageElement) {
      humidityIcon.src = this.#uimanager.icons["humidity"];
    }
    const humidity = this.#uimanager.addElement("span", humDiv, "day-humidity");
    humidity.textContent = `${day.humidity}%`;

    /** wind speed **/
    const windDiv = this.#uimanager.addElement(
      "div",
      bodyTopDiv,
      "day-wind-div",
    );
    const windIcon = this.#uimanager.addElement(
      "img",
      windDiv,
      "day-wind-icon",
    );
    if (windIcon instanceof HTMLImageElement) {
      windIcon.src = this.#uimanager.icons["windspeed"];
    }
    const windspeed = this.#uimanager.addElement(
      "span",
      windDiv,
      "day-windspeed",
    );
    windspeed.textContent = `${day.windspeed} km/h`;

    /** solar energy **/
    const solarDiv = this.#uimanager.addElement(
      "div",
      bodyTopDiv,
      "day-solar-div",
    );
    const solarIcon = this.#uimanager.addElement(
      "img",
      solarDiv,
      "day-solar-icon",
    );
    if (solarIcon instanceof HTMLImageElement) {
      solarIcon.src = this.#uimanager.icons["solarenergy"];
    }
    const solarEnergy = this.#uimanager.addElement(
      "span",
      solarDiv,
      "day-solarenergy",
    );
    solarEnergy.textContent = `${day.solarenergy} MJ/m2`;

    /** Middle row **/
    const bodyMidDiv = this.#uimanager.addElement(
      "div",
      bodyDiv,
      "day-body-mid",
    );

    /** Probability of rain **/
    const precProbDiv = this.#uimanager.addElement(
      "div",
      bodyMidDiv,
      "day-prob-div",
    );
    const precProbIcon = this.#uimanager.addElement(
      "img",
      precProbDiv,
      "day-prob-icon",
    );
    if (precProbIcon instanceof HTMLImageElement) {
      precProbIcon.src = this.#uimanager.icons["rainprobability"];
    }
    const precipitationProbability = this.#uimanager.addElement(
      "span",
      precProbDiv,
      "day-prob",
    );
    precipitationProbability.textContent = `${day.precipprob}%`;

    /** Rain fall **/
    const precDiv = this.#uimanager.addElement(
      "div",
      bodyMidDiv,
      "day-prec-div",
    );
    const precIcon = this.#uimanager.addElement(
      "img",
      precDiv,
      "day-prec-icon",
    );
    if (precIcon instanceof HTMLImageElement) {
      precIcon.src = this.#uimanager.icons["precipitation"];
    }
    const prec = this.#uimanager.addElement("span", precDiv, "day-prec");
    prec.textContent = `${day.precipitation}mm`;
    /** sunrise and sunset **/
    const sunriseDiv = this.#uimanager.addElement(
      "div",
      bodyMidDiv,
      "day-sunrise-div",
    );
    const sunriseIcon = this.#uimanager.addElement(
      "img",
      sunriseDiv,
      "day-sunrise-icon",
    );
    if (sunriseIcon instanceof HTMLImageElement) {
      sunriseIcon.src = this.#uimanager.icons["sunrise"];
    }
    const sunrise = this.#uimanager.addElement(
      "span",
      sunriseDiv,
      "day-sunrise",
    );
    sunrise.textContent = `${day.sunrise}`;

    const sunsetDiv = this.#uimanager.addElement(
      "div",
      bodyMidDiv,
      "day-sunset-div",
    );
    const sunsetIcon = this.#uimanager.addElement(
      "img",
      sunsetDiv,
      "day-sunset-icon",
    );
    if (sunsetIcon instanceof HTMLImageElement) {
      sunsetIcon.src = this.#uimanager.icons["sunset"];
    }
    const sunset = this.#uimanager.addElement("span", sunsetDiv, "day-sunset");
    sunset.textContent = `${day.sunset}`;

    /** Condition **/
    const condDiv = this.#uimanager.addElement("div", bodyDiv, "day-cond-div");
    const condition = this.#uimanager.addElement("span", condDiv, "day-cond");
    condition.textContent = `${day.conditions}`;

    if (this.#uiBackground.includes(day.icon)) {
      dayCard.classList.add(`${day.icon}`);
    } else {
      dayCard.classList.add("clear-day"); // default background if icon not found
    }

    dayCard.dataset.id = `${day.id}`;

    dayCard.addEventListener("click", () => {
      console.log(`clicked the day card for ${day.id}`);
      handleClickCallback(day.id);
    });

    return dayCard;
  }

  getBackgrounds() {
    return this.#uiBackground;
  }
}

/** @module DayWeatherUI */
export default DayWeatherUI;
