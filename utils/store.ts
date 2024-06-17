import { observable } from "@legendapp/state";
import { ObservablePersistMMKV } from "@legendapp/state/persist-plugins/mmkv";
import { persistObservable } from "@legendapp/state/persist";
import { Item, MAX_QUANTITY } from "@/models/item";
import { clamp, safeParseFloat } from "./helpers";

export const state = observable<Item[]>([]);

type Lang = "en" | "he";

export const settings = observable<{
  endpoint?: string;
  language: Lang;
  isRTL: boolean;
}>({
  endpoint: undefined,
  language: "en",
  isRTL: false,
});

export const snapshot = observable<(Item | undefined)[]>([]);
let retryInterval: NodeJS.Timeout | undefined = undefined;

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
      setInterval(async () => {
        try {
          const endpoint = settings.get().endpoint;
          if (endpoint) {
            await fetch(`${endpoint}/ping`);
            if (snapshot.get().length === 0) {
              const result = await fetch(`${endpoint}/items`).then((res) =>
                res.json()
              );
              const items = state.get();
              const updatedItems = result.value.map((item: Item) => {
                const existingItem = items.find((i) => i.id === item.id);
                if (existingItem && existingItem.updatedAt > item.updatedAt) {
                  return existingItem;
                }
                return item;
              });
              onChange(updatedItems);
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
          const endpoint = settings.get().endpoint;
          const snapshotItems = snapshot.get();

          if (endpoint && snapshotItems.length > 0) {
            await fetch(`${endpoint}/ping`);
            await fetch(`${endpoint}/items`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(snapshotItems),
            });
            clearInterval(retryInterval);
          }
        } catch (error) {}
      }, 10_000);
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
  return Array.from(categories);
};

export const GetMissingCategories = () => {
  const categories = new Set(GetMissingItems().map((item) => item.category));
  return Array.from(categories);
};

export const onInsert = (item: Item) => {
  item.missing = item.missingThreshold >= item.quantity;
  item.updatedAt = new Date().getTime();
  state.set((items) => [...items, item]);
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
