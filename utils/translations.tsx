import { observe } from "@legendapp/state";
import { settings } from "./store";

const _translations = {
  en: {
    search: "Search",
    needToAllowCamera: "Camera permission is required",
    allowCamera: "Allow camera",
    capturePicture: "Camera",
    choosePicture: "Gallery",
    name: "Name",
    category: "Category",
    quantity: "Quantity",
    missingThreshold: "Missing threshold",
    delete: "Delete",
    save: "Save",
    settings: "Settings",
    home: "Home",
    missingItems: "Missing items",
    english: "English",
    hebrew: "Hebrew",
  },
  he: {
    search: "חיפוש",
    needToAllowCamera: "יש צורך באישור המצלמה",
    allowCamera: "אשר מצלמה",
    capturePicture: "צלם תמונה",
    choosePicture: "בחר תמונה",
    name: "שם",
    category: "קטגוריה",
    quantity: "כמות",
    missingThreshold: "כמות לקנייה",
    delete: "מחק",
    save: "שמור",
    settings: "הגדרות",
    home: "בית",
    missingItems: "פריטים חסרים",
    english: "אנגלית",
    hebrew: "עברית",
  },
};

export let translations = _translations[settings.get().language];

observe(() => {
  translations = _translations[settings.get().language];
});
