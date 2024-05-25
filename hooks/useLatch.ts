import { useEffect, useState } from "react";

export const useLatch = <T>(initialValue: T, latchValue: T): T => {
  const [value, setValue] = useState(initialValue);

  useEffect(() => {
    if (initialValue === latchValue) {
      setValue(latchValue);
    }
  }, [latchValue, initialValue]);
  return value;
};
