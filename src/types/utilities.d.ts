export type DeepRequired<T> = T extends object
    ? {
        [P in keyof T]-?: DeepRequired<NonNullable<T[P]>>;
    }
    : T;