import { View } from "@antv/g2";
import { Clusters, Ensemble } from "@kanaries/ml";
import { IRow } from "../interfaces";
import { dropNull, getViewPosition, getViewRawData, json2matrix, maxIndex, reduceSum, variance, vec_dot } from "../utils";
import { annotateCluster, annotateGeneralRegression, annotateOutlier } from '../annotations/g2/index'
import { generalLinearRegression } from "../lib/regression";
// const annotationList = [annotateCluster, annotateOutlier, annotateGeneralRegression] as const;
const MAX_TEST_ORDER = 3;
export class AutoAnnotation {
    private view: View;
    private polynomialBestOrder: number = 2;
    constructor (view: View) {
        this.view = view;
        console.log(view.getData(), view.getOptions())
    }

    private get rawData () {
        return getViewRawData(this.view);
    }

    private get position (): [string, string] {
        return getViewPosition(this.view);
    }

    private get cleanData () {
        return dropNull(this.rawData, this.position);
    }

    private get sampleX () {
        return json2matrix(this.cleanData, this.position);
    }

    private outlierScore () {
        const iForest = new Ensemble.IsolationForest(256, 10, 0.02);
        const X = this.sampleX;
        iForest.fit(X);

        let score = 0;
        X.forEach(x => {
            score = Math.max(iForest.anomalyScore(x), score)
        })
        return score;
    }

    private regressionScore () {
        let score = 0;
        let bestOrder = 1;
        const sampleX = this.sampleX;
        // 这里x[0]是隐形逻辑，要修复，这里会人为x[0]对应xField。
        for (let order = 1; order <= MAX_TEST_ORDER; order++) {
            const adjustXt = sampleX.map(x => {
                const row = [1, x[0]]
                for (let i = 2; i <= order; i++) {
                    row.push(Math.pow(x[0], order))
                }
                return row;
            })
            const adjustY = sampleX.map(x => {
                return x.slice(1)
            })
            const plainY = adjustY.flatMap(y => y);
            const result = generalLinearRegression(adjustXt, adjustY);

            if (result) {
                const betas = result.flatMap((v) => v);
                const y_hat = (vec_x: number[]) => vec_dot(vec_x, betas);
                const yMean = reduceSum(plainY) / plainY.length;
                const SSR = reduceSum(plainY.map((y, yIndex) => (y_hat(adjustXt[yIndex]) - yMean) ** 2 ))
                const SST = reduceSum(plainY.map((y, yIndex) => (y - yMean) ** 2 ))
                const R2 = SSR / SST;
                if (R2 > score) {
                    score = R2;
                    bestOrder = order;
                }
            }
        }
        this.polynomialBestOrder = bestOrder;
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
        entire_var_group *= X.length;
        return total_var_group / entire_var_group;
    }

    public recommand () {
        const cluster_score = this.clusterScore();
        const outlier_score = this.outlierScore();
        const trend_score = this.regressionScore();

        const scores = [cluster_score, outlier_score, trend_score];

        const annotationList = [
            annotateCluster,
            annotateOutlier,
            (view: View) => annotateGeneralRegression(view, this.polynomialBestOrder),
        ] as const;
    
        const _maxIndex = maxIndex(scores);
        return annotationList[_maxIndex];
    }

}
