import { observe } from "@legendapp/state";
import { settings } from "./store";
import Intro from "@/app/Intro";

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
    selectLanguage: "Select language",

    requiredField: "This field is required",

    exitApp: "Exit App",
    exitAppQuestion: "Exiting the application?",
    exitAppCancel: "Cancel",
    exitAppOk: "OK",
    noCategories: "No categories found",
    endpoint: "endpoint",
    language: "Language",
    enableSync: "Enable sync",
    authorization: "Authorization",
    comingSoon: "Coming soon",
    ShareFeatureDescription:
      "the ability to share lists with friends and family",
    IntroTitle: "You don’t have items in your list",
    IntroSubtitle:
      "When you add items to your list, you’ll see them here!, Happy organizing!",
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
    selectLanguage: "בחר שפה",

    requiredField: "שדה חובה",

    exitApp: "יציאה מהאפליקציה",
    exitAppQuestion: "לצאת מהאפליקציה?",
    exitAppCancel: "ביטול",
    exitAppOk: "אישור",
    noCategories: "לא נמצאו קטגוריות",
    endpoint: "כתובת סנכרון",
    authorization: "קוד משתמש",
    language: "שפה",
    enableSync: "אפשר סנכרון",

    comingSoon: "בקרוב",
    ShareFeatureDescription: "אפשרות לשתף רשימות עם חברים ומשפחה",
    IntroTitle: "אין פריטים ברשימה",
    IntroSubtitle: "כאשר תוסיפו פריטים לרשימה, תראו אותם כאן! תהנו מארגון קל!",
  },
};

export let translations = _translations[settings.get().language];

observe(() => {
  translations = _translations[settings.get().language];
});
