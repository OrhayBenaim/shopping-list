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
  },
};

export let translations = _translations[settings.get().language];

observe(() => {
  translations = _translations[settings.get().language];
});
