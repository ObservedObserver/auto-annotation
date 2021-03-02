export interface IRow {
  [key: string]: any;
}

export interface IField {
  name: string;
  type: "dimension" | "measure";
}
