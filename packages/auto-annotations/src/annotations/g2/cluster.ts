import { View } from '@antv/g2';
import { Clusters } from '@kanaries/ml';
import { dropNull, getViewPosition, getViewRawData, json2matrix } from '../../utils';
const CLUSTER_KEY = 'cluster_group_';
export function annotateCluster(view: View) {
    const kmeans = new Clusters.KMeans(3, 0.05);
    const rawData = getViewRawData(view);
    const position = getViewPosition(view);
    const cleanData = dropNull(rawData, position);
    const X = json2matrix(cleanData, position);
    const result = kmeans.fitPredict(X);

    const viewData = cleanData.map((r, rIndex) => {
        return {
            ...r,
            [CLUSTER_KEY]: result[rIndex].toString(),
        };
    });
    view.geometries.forEach((geom) => {
        geom.color(CLUSTER_KEY);
    });
    view.data(viewData);
}
