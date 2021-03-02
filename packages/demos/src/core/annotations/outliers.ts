import { View } from "@antv/g2";
import { IRow } from "../../interfaces";
import { Ensemble } from '@kanaries/ml'
import { dropNull, json2matrix } from "../../utils";
export function annotateOutlier (view: View, rawData: IRow[], position: [string, string]) {
    const iForest = new Ensemble.IsolationForest(256, 10, 0.02);
    const cleanData = dropNull(rawData, position);
    const X = json2matrix(cleanData, position);

    iForest.fit(X);
    const y = iForest.predict(X);
    const viewData = cleanData.map((r, rIndex) => {
        return {
            ...r,
            'isOutlier': y[rIndex] === 1 ? 'outlier' : 'normal'
        }
    })
    view.geometries.forEach(geom => {
        geom.color('isOutlier')
    })
    view.data(viewData);
}