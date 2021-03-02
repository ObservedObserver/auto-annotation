import { View } from "@antv/g2";
import { Clusters, Ensemble } from "@kanaries/ml";
import { IRow } from "../interfaces";
import { dropNull, json2matrix, maxIndex, variance } from "../utils";
import { annotateCluster, annotateGeneralRegression, annotateOutlier } from '../annotations/index'
const annotationList = [annotateCluster, annotateOutlier, annotateGeneralRegression] as const;
export class AutoAnnotation {
    private view: View;
    private rawData: IRow[] = [];
    private _position: [string, string] = ['x', 'y']
    constructor (view: View) {
        this.view = view;
    }

    public data(dataSource: IRow[]) {
        this.rawData = dataSource;
        return this;
    }

    public position (pos: [string, string]) {
        this._position = pos;
        return this;
    }

    private get cleanData () {
        return dropNull(this.rawData, this._position);
    }

    private get sampleX () {
        return json2matrix(this.cleanData, this._position);
    }

    private outlierScore () {
        const iForest = new Ensemble.IsolationForest(256, 10, 0.02);
        const X = this.sampleX;
        iForest.fit(X);

        let score = 0;
        X.forEach(x => {
            score = Math.max(iForest.anomalyScore(x))
        })
        return score;
    }

    private clusterScore () {
        const kmeans = new Clusters.KMeans(3, 0.05);
        const X = this.sampleX;
        const lenX = X.length > 0 ? X[0].length : 0;
        const y = kmeans.fitPredict(X);
        const groups: Map<number, number[][]> = new Map();
        for (let i = 0; i < y.length; i++) {
            if (!groups.has(y[i])) {
                groups.set(y[i], [])
            }
            groups.get(y[i])?.push(X[i])
        }
        let total_var_group = 0;
        for (let [groupIndex, groupX] of groups) {
            let var_group = 0;
            for (let i = 0; i < lenX; i++) {
                var_group += variance(groupX.map(x => x[i]));
            }
            var_group *= groupX.length;
            total_var_group += var_group;
        }
        total_var_group;
        let entire_var_group = 0;
        for (let i = 0; i < lenX; i++) {
            entire_var_group += variance(X.map((x) => x[i]));
        }
        return total_var_group / entire_var_group;
    }

    public recommand () {
        const cluster_score = this.clusterScore();
        const outlier_score = this.outlierScore();
        const trend_score = 0; // TMP;
        const scores = [cluster_score, outlier_score, trend_score];
        const _maxIndex = maxIndex(scores);
        return annotationList[_maxIndex];
    }

}