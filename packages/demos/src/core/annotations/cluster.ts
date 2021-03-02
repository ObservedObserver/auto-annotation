import { View } from '@antv/g2';
import { IRow } from '../../interfaces';
import { Clusters } from '@kanaries/ml';
import { dropNull, json2matrix } from '../../utils';
export function annotateCluster(
    view: View,
    rawData: IRow[],
    position: [string, string]
) {
    const kmeans = new Clusters.KMeans(3, 0.05);
    const cleanData = dropNull(rawData, position);
    const X = json2matrix(cleanData, position);
    const result = kmeans.fitPredict(X);
    console.log(result)

    const viewData = cleanData.map((r, rIndex) => {
        return {
            ...r,
            cluster_group: result[rIndex].toString(),
        };
    });
    view.geometries.forEach((geom) => {
        geom.color('cluster_group');
    });
    view.data(viewData);
}
