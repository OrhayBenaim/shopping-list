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

    requiredField: "This field is required",

    exitApp: "Exit App",
    exitAppQuestion: "Exiting the application?",
    exitAppCancel: "Cancel",
    exitAppOk: "OK",
    noCategories: "No categories found",
    endpoint: "endpoint",
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

    requiredField: "שדה חובה",

    exitApp: "יציאה מהאפליקציה",
    exitAppQuestion: "לצאת מהאפליקציה?",
    exitAppCancel: "ביטול",
    exitAppOk: "אישור",
    noCategories: "לא נמצאו קטגוריות",
    endpoint: "כתובת סנכרון",
  },
};

export let translations = _translations[settings.get().language];

observe(() => {
  translations = _translations[settings.get().language];
});
