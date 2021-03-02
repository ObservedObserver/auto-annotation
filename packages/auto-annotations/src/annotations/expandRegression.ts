import { View } from '@antv/g2';
import { IRow } from '../interfaces';
import {
    dropNull,
    isNumField,
    json2matrix,
    normalize2quantitative
} from '../utils';
import { generalLinearRegression } from '../lib/regression';
function vec_dot(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
        sum += vec1[i] * vec2[i];
    }
    return sum;
}

// TODO: data, spec冗余，可以从view里获得
export function annotateGeneralRegression(
    view: View,
    rawData: IRow[],
    position: [string, string],
    order: number = 1
) {
    const cleanData = dropNull(rawData, position);
    let normalizedData: IRow[];
    if (!isNumField(cleanData, position[0])) {
        normalizedData = normalize2quantitative(cleanData, position[0]);
    } else {
        normalizedData = [...cleanData];
    }

    // const { alpha, beta, R2 } = purelinearRegression(normalizedData, position[0], position[1]);
    const Xt = json2matrix(normalizedData, position.slice(0, 1));
    const y_ = json2matrix(normalizedData, position.slice(1));
    const orderXt = Xt.map(xRow => {
        const row = [1, ...xRow];
        for (let i = 2; i <= order; i++) {
            row.push(Math.pow(xRow[0], i))
        }
        return row;
    })
    // console.log('order', order)
    const result = generalLinearRegression(orderXt, y_);
    if (result) {
        const betas = result.flatMap(v => v);
        const y_hat = (vec_x: number[]) => vec_dot(vec_x, betas);
        console.log(betas);
        const viewData = cleanData.map((row, rIndex) => {
            return {
                ...row,
                regression: y_hat(orderXt[rIndex])
            }
        })
        console.log('viewData', viewData)
        const regLineView = view.createView();
        regLineView.axis(false);
        regLineView
            .line()
            .position([position[0], 'regression'])
            .style({
                stroke: '#969696',
                lineDash: [3, 3],
            });
        regLineView.data(viewData);
    }
}
