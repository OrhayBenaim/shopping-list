import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { persistObservable } from "@legendapp/state/persist";
import { Item, MAX_QUANTITY } from "@/models/item";
import { clamp, safeParseFloat } from "./helpers";
import * as FileSystem from "expo-file-system";

export const state = observable<Item[]>([]);

export type Lang = "en" | "he";

export const settings = observable<{
  sync: boolean;
  endpoint?: string;
  authorization?: string;
  language: Lang;
  isRTL: boolean;
  showIntro: boolean;
}>({
  sync: false,
  endpoint: undefined,
  language: "en",
  isRTL: false,
  showIntro: true,
});

export const snapshot = observable<(Item | undefined)[]>([]);
let retryInterval: NodeJS.Timeout | undefined = undefined;
let getInterval: NodeJS.Timeout | undefined = undefined;

persistObservable(settings, {
  local: "settings", // Unique name
  pluginLocal: ObservablePersistMMKV,
});

persistObservable(snapshot, {
  local: "snapshot", // Unique name
  pluginLocal: ObservablePersistMMKV,
});

persistObservable(state, {
  local: "store", // Unique name
  pluginLocal: ObservablePersistMMKV,
  pluginRemote: {
    get: ({ onChange }) => {
      if (getInterval) clearInterval(getInterval);
      getInterval = setInterval(async () => {
        try {
          const _settings = settings.get();

          if (_settings.endpoint && _settings.sync) {
            await fetch(`${_settings.endpoint}/ping`, {
              headers: {
                Authorization: `Basic ${_settings.authorization}`,
              },
            });
            if (snapshot.get().length === 0) {
              const result: Item[] = await fetch(
                `${_settings.endpoint}/items`,
                {
                  headers: {
                    Authorization: `Basic ${_settings.authorization}`,
                  },
                }
              ).then((res) => res.json());
              // const items = state.get();
              // const updatedItems: Map<string, Item> = [
              //   ...items,
              //   ...result,
              // ].reduce((acc, current) => {
              //   if (!acc.has(current.id)) acc.set(current.id, current);
              //   else {
              //     const existingItem = acc.get(current.id)!;
              //     if (existingItem.updatedAt < current.updatedAt) {
              //       acc.set(current.id, current);
              //     }
              //   }
              //   return acc;
              // }, new Map<string, Item>([]));
              onChange({ value: result });
            }
          }
        } catch (error) {}
      }, 10_000);
      return state.get();
    },
    set: async ({ value }) => {
      snapshot.set(value);
      if (retryInterval) clearInterval(retryInterval);
      retryInterval = setInterval(async () => {
        try {
          const _settings = settings.get();
          const snapshotItems = snapshot.get();

          if (_settings.endpoint && _settings.sync) {
            await fetch(`${_settings.endpoint}/ping`, {
              headers: {
                Authorization: `Basic ${_settings.authorization}`,
              },
            });

            const uploads = snapshotItems.filter(
              (item) => item?.image && !item.blurHash
            );
            const uploadsPromises = uploads.map((item) => {
              return FileSystem.uploadAsync(
                `${_settings.endpoint}/upload`,
                FileSystem.documentDirectory + item!.image!,
                {
                  httpMethod: "POST",
                  uploadType: FileSystem.FileSystemUploadType.MULTIPART,
                  fieldName: "file",
                  headers: {
                    Authorization: `Basic ${_settings.authorization}`,
                  },
                }
              );
            });
            await fetch(`${_settings.endpoint}/items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Basic ${_settings.authorization}`,
              },
              body: JSON.stringify(snapshotItems),
            });
            await Promise.all(uploadsPromises);
            snapshot.set([]);
            clearInterval(retryInterval);
          }
        } catch (error) {
          console.error(error);
        }
      }, 2_000);
    },
  },
});

export const GetItems = () => {
  return state.get().sort((a, b) => a.name.localeCompare(b.name));
};
export const GetMissingItems = () => {
  return GetItems().filter((item) => item.missing);
};

export const FilteredItemsByCategories = (
  items: Item[],
  categories: string[]
) => {
  if (categories.length === 0) return items;
  return items.filter((item) => categories.includes(item.category));
};
export const FilteredItemsByName = (items: Item[], name: string) => {
  return items.filter((item) =>
    item.name.toLowerCase().includes(name.toLowerCase())
  );
};

export const GetCategories = () => {
  const categories = new Set(GetItems().map((item) => item.category));
  return Array.from(categories).filter((category) => category);
};

export const GetMissingCategories = () => {
  const categories = new Set(GetMissingItems().map((item) => item.category));
  return Array.from(categories).filter((category) => category);
};

export const onInsert = (item: Item) => {
  item.missing = item.missingThreshold >= item.quantity;
  item.updatedAt = new Date().getTime();
  state.set((items) => [...items, item]);
  SetIntro(false);
};

export const onDelete = (itemId: string) => {
  state.set((items) => items.filter((i) => i.id !== itemId));
};

export const onUpdate = (item: Item) => {
  item.missing = item.missingThreshold >= item.quantity;
  item.updatedAt = new Date().getTime();
  state.set((items) => items.map((i) => (i.id === item.id ? item : i)));
};

export const IncreaseQuantity = (item: Item) => {
  if (item.quantity + 1 <= MAX_QUANTITY) {
    onUpdate({ ...item, quantity: item.quantity + 1 });
  }
};

export const DecreaseQuantity = (item: Item) => {
  if (item.quantity - 1 >= 0) {
    onUpdate({ ...item, quantity: item.quantity - 1 });
  }
};

export const ChangeQuantity = (item: Item, quantity: string) => {
  const parsedQuantity = clamp(safeParseFloat(quantity), 0, MAX_QUANTITY);
  onUpdate({ ...item, quantity: parsedQuantity });
};

export const ItemsByCategories = (items: Item[]) => {
  return items.reduce((acc, current) => {
    const key = current.category;
    if (!acc[key]) acc[key] = [];
    //eslint-disable-next-line
    acc[key].push(current);
    return acc;
  }, {} as { [key: string]: Item[] });
};

export const SetLanguage = (language: Lang) => {
  settings.set((sett) => ({
    ...sett,
    language,
    isRTL: language === "he",
  }));
};

export const SetSync = (sync: boolean) => {
  settings.set((sett) => ({
    ...sett,
    sync,
  }));
};

export const SetEndpoint = (endpoint: string) => {
  settings.set((sett) => ({
    ...sett,
    endpoint,
  }));
};

export const SetAuthorization = (authorization?: string) => {
  settings.set((sett) => ({
    ...sett,
    authorization,
  }));
};

export const SetIntro = (intro: boolean) => {
  settings.set((sett) => ({
    ...sett,
    showIntro: intro,
  }));
};
