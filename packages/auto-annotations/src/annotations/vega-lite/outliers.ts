import { Ensemble } from "@kanaries/ml";
import produce, { setAutoFreeze } from 'immer';

setAutoFreeze(false);

import {
    dropNull,
    json2matrix,
} from "../.././utils";
import { VegaLiteSpec } from '../../interfaces';

const OUTLIER_FIELD = 'is_outlier_';

export function annotateOutlier(spec: VegaLiteSpec): VegaLiteSpec {
    // @ts-ignore
    const rawData = spec.data.values || [];
    // @ts-ignore
    const position = [spec.encoding.x.field, spec.encoding.y.field];
    const iForest = new Ensemble.IsolationForest(256, 10, 0.02);
    const cleanData = dropNull(rawData, position);
    const X = json2matrix(cleanData, position);

    iForest.fit(X);
    const y = iForest.predict(X);
    const viewData = cleanData.map((r, rIndex) => {
        return {
            ...r,
            [OUTLIER_FIELD]: y[rIndex] === 1 ? "outlier" : "normal",
        };
    });

    const nextSpec = produce(spec, draft => {
        draft.data = { values: viewData };
        // @ts-ignore
        draft.encoding.color = {
            field: OUTLIER_FIELD,
            type: 'nominal'
        }
    })
    return nextSpec;
}
