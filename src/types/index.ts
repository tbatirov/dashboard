export type Theme = "light" | "dark";

export type DatasetData = {
    [key: string]: string;
};

export type Dataset = {
    columns: string[];
    labels: LabelStore;
    data: DatasetData[];
};

export type Filter = {
    column: string;
    operator: string;
    value: string;
    type: 'local' | 'global' | 'drill down';
};

export type DashletSettings = {
    [key: string]: any;
};

export type Dashlet = {
    type: string;
    x?: number;
    y?: number;
    w: number;
    h: number;
    settings: DashletSettings;
};

export type Dashlets = {
    [key: string]: Dashlet;
};

export type Field = {
    id: string;
    label: string;
    type: string;
    config: any;
};

export type Chart = {
    minHeight: number;
    minWidth: number;
    tools: string[];
    similarCharts: string[];
    defaultSettings: DashletSettings;
    fields: Field[];
};

export type LabelStore = {
    [key: string]: Record<string, string>;
};

export type FieldTypeStore = {
    [key: string]: string;
};

export type FieldStore = {
    [key: string]: Field;
};

export type ChartStore = {
    [key: string]: Chart;
};

export type ModalData = {
    title: string;
    description?: string;
    action: () => void;
};

export type FormData = ModalData & {
    labels: {
        cancelBtnText?: string;
        actionBtnText?: string;
    };
};

export type ConfirmData = ModalData & {
    isAlert? : boolean;
    labels: {
        cancelBtnText?: string;
        actionBtnText?: string;
        okBtnText?: string;
    };
};

export type Cache =  {
    [key: string]: {
        data: any;
        last_updated: number;
    };
};

export type TableData =  {
    headers: string[];
    data: any[];
};