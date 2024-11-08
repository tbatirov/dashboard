import type { Theme, DatasetData, Filter } from "@/types";
import type { Router } from "vue-router";

export const setTheme = (theme: Theme) => {
    const appElement = window.document.documentElement;
    appElement.classList.toggle("dark", theme === "dark");
    localStorage.setItem("theme", theme);
};

export const openViewerSite = (router: Router, id: string): void => {
    const url = router.resolve({ name: "viewer", params: { id: id } }).href;
    window.open(url, "_blank", "noopener,noreferrer");
};

export const formatLabel = (template: string, values: Record<string, string>): string => {
    return template.replace(/{(\w+)}/g, (_: string, key: string): string => values[key] || '');
}

export const readFileAsArrayBuffer = (file: File): Promise<ArrayBuffer> => {
    return new Promise<ArrayBuffer>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as ArrayBuffer);
        reader.onerror = (error) => reject(error);
        reader.readAsArrayBuffer(file);
    });
};

export const arrayBufferToHex = (buffer: ArrayBuffer): string => {
    const byteArray = new Uint8Array(buffer);
    let hexString = '';
    byteArray.forEach((byte) => {
        hexString += byte.toString(16).padStart(2, '0');
    });
    return hexString;
};

export const hexToString = (hex: string): string => {
    let str = '';
    for (let i = 0; i < hex.length; i += 2) {
      const byte = hex.slice(i, i + 2);
      const charCode = parseInt(byte, 16);
      str += String.fromCharCode(charCode);
    }
    return str;
  };

export const getFileEventAsHex = async (event: Event): Promise<string | null> => {
    const target = event.target as HTMLInputElement;
    const file = target.files?.[0];
    if (!file) return null;
    const fileContent = await readFileAsArrayBuffer(file);
    const hexContent = arrayBufferToHex(fileContent);
    return hexContent;
};

export const getEventValue = (event: Event): string => {
    return (event.target as HTMLInputElement).value;
};

export const toTitleCase = (str: string): string => {
    return str.toLowerCase().replace(/\b\w/g, s => s.toUpperCase());
}

export const isNumeric = (number: any) => {
    return !isNaN(parseFloat(number)) && isFinite(number);
};

export const groupBy = <T extends DatasetData>(data: T[], value: keyof T): Record<string, T[]> => {
  const result: Record<string, T[]> = {};
  for (const item of data) {
    const key = Array.isArray(item[value]) ? item[value].join(', ') : String(item[value]);
    const keys = key.split(',').map(s => s.trim()).filter(Boolean);
    for (const key of keys) {
      if (!(key in result)) result[key] = [];
      result[key].push(item);
    }
  }
  return result;
};

export const filterDataset = <T extends DatasetData>(data: T[], filters: Filter[]): T[] => {
    return data.filter(item => {
        return filters.every(filter => {
            const itemValue = item[filter.column];
            if (typeof itemValue !== 'string') return false;
            const values = filter.value.match(/"([^"]+)"|[^,]+/g)?.map(v => v.trim()) ?? [];

            return values.some(value => {
                let result = null;
                if (value.startsWith('"') && value.endsWith('"')) {
                    const exactValue = value.slice(1, -1);
                    result = itemValue === exactValue;
                } else {
                    const regex = new RegExp(value, 'i');
                    result = regex.test(itemValue);
                }
                return (filter.operator === 'equal') ? result : !result;
            });
        });
    });
};
