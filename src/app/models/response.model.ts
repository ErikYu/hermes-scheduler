export interface Datalist<T> {
  datalist: T[];
  count: number;
}

export interface Data<T> {
  data: T;
}

export interface BaseResponse<T> {
  meta?: any;
  content: T;
}

export interface TreeResponse<T> {
  meta?: any;
  content: Datalist<T>;
}

export interface DetailResponse<T> {
  meta?: any;
  content: Data<T>;
}
