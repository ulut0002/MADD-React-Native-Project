import { DateTime } from "luxon";

const STORAGE_KEYS = {
  PEOPLE: "PEOPLE",
  GIFTS: "GIFTS",
  APP_SETTINGS: "APP_SETTINGS",
};

const STATIC = {
  APPROACHING_BIRTHDAYS: "APPROACHING_BIRTHDAYS",
  PAST_BIRTHDAYS: "PAST_BIRTHDAYS",
};

const FALLBACK = {};

const EMPTY_PERSON = {
  id: null,
  name: "",
  dob: DateTime.now(),
  gifts: [],
};

const EMPTY_GIFT = {
  id: "",
  text: "",
  img: "",
  width: 0,
  height: 0,
};

export { STORAGE_KEYS, FALLBACK, STATIC, EMPTY_PERSON, EMPTY_GIFT };
