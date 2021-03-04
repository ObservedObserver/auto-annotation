import { TopLevelSpec } from "vega-lite";
import { Spec } from "vega";

export interface IRow {
  [key: string]: any;
}

export interface IField {
  name: string;
  type: "dimension" | "measure";
}

export type VegaLiteSpec = TopLevelSpec | Spec;