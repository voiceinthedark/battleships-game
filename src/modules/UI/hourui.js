// @ts-check

import HoursWeather from "../hoursweather.js";
import HourWeather from "../hourweather.js";
import UIManager from "./uimanager.js";
import { format, parse } from "date-fns";

/**
 * @class HourUI
 * @classdesc The hour card
 * */
class HourUI {
  /** @type UIManager */
  #uimanager;

  /**
   * @constructor
   * @param {UIManager} uimanager
   * */
  constructor(uimanager) {
    this.#uimanager = uimanager;
  }

  /**
   * @method to render the hours list of the current TodayWeather object
   * @param {HoursWeather} hours
   * @returns {HTMLElement}
   * */
  renderHoursList(hours) {
    const hoursList = document.createElement("div");
    hoursList.classList.add("hour-list");
    hoursList.setAttribute("id", "hourlist");

    /** @type {HourWeather} h */
    hours.forEach((h) => {
      const hCard = this.#renderHourCard(h);
      hoursList.appendChild(hCard);
    });
    return hoursList;
  }

  /**
   * @method to render an hour card
   * @param {HourWeather} hour
   * @returns {HTMLElement}
   * */
  #renderHourCard(hour) {
    /** CREATE THE FRAME **/
    const hourFrame = document.createElement("div");
    hourFrame.classList.add("hour-frame");
    const hourTime = this.#uimanager.addElement("span", hourFrame, "hour-time");
    hourTime.textContent = format(
      parse(hour.datetime, "HH:mm:ss", new Date()),
      "H a",
    );

    /** HOUR CARD **/
    const hourCard = this.#uimanager.addElement("div", hourFrame, "hour-card");
    /** HOUR HEADER **/
    const hourHeader = this.#uimanager.addElement(
      "div",
      hourCard,
      "hour-header",
    );
    const hourIcon = this.#uimanager.addElement("img", hourHeader, "hour-icon");
    if (hourIcon instanceof HTMLImageElement) {
      hourIcon.src = this.#uimanager.icons[hour.icon];
    }
    const hourTemp = this.#uimanager.addElement(
      "span",
      hourHeader,
      "hour-temp",
    );
    hourTemp.textContent = "" + hour.temp;

    const hourConditions = this.#uimanager.addElement(
      "span",
      hourCard,
      "hour-conditions",
    );
    hourConditions.textContent = hour.conditions;

    // set the background
    if (hourCard instanceof HTMLElement) {
      hourCard.classList.add(hour.icon);
    }
    return hourFrame;
  }
}

/** @module HourUI */
export default HourUI;
