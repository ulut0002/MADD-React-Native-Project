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

const GIFT_IDEA_VIEW_MODE = {
  NEW: "NEW",
  PREVIEW: "PREVIEW_MODE",
  EDIT: "EDIT_MODE",
};

const GIFT_IDEA_IMAGE_MODE = {
  PREVIEW: "PREVIEW",
  LIVE: "LIVE",
};

const EMPTY_PERSON = {
  id: null,
  name: "",
  dob: DateTime.now(),
  gifts: [],
};

const EMPTY_GIFT = {
  id: "",
  text: "",
  image: "",
  width: 0,
  height: 0,
};

const SCREEN_NAMES = {};

export {
  STORAGE_KEYS,
  STATIC,
  EMPTY_PERSON,
  EMPTY_GIFT,
  GIFT_IDEA_VIEW_MODE,
  GIFT_IDEA_IMAGE_MODE,
  SCREEN_NAMES,
};
