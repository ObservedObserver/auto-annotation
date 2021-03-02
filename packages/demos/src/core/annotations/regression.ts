import { View } from '@antv/g2'
import { Algebra } from '@kanaries/ml';
import { IRow } from '../../interfaces';
import { dropNull, isNumField, json2matrix, maxIndex, mean, minIndex, normalize2quantitative, reduceSum, rescale } from '../../utils';
import { generalLinearRegression } from '../lib/regression';

export function purelinearRegression(
    normalizedData: IRow[],
    xField: string,
    yField: string
) {
    const xMean = mean(normalizedData, xField);
    const yMean = mean(normalizedData, yField);

    const numerator = reduceSum(
        normalizedData.map((r) => (r[xField] - xMean) * (r[yField] - yMean))
    );
    const denominator = reduceSum(
        normalizedData.map((r) => (r[xField] - xMean) ** 2)
    );

    const beta = numerator / denominator;

    const alpha = yMean - xMean * beta;

    const y_hat = (x: number) => alpha + beta * x;

    const SSR = reduceSum(
        normalizedData.map((r) => (y_hat(r[xField]) - yMean) ** 2)
    );
    const SST = reduceSum(normalizedData.map((r) => (r[yField] - yMean) ** 2));

    const R2 = SSR / SST;

    return {
        alpha,
        beta,
        R2,
    };
}

// TODO: data, spec冗余，可以从view里获得
export function regression(view: View, rawData: IRow[], position: [string, string]) {
    const cleanData = dropNull(rawData, position);
    let normalizedData: IRow[];
    if (!isNumField(cleanData, position[0])) {
        normalizedData = normalize2quantitative(cleanData, position[0]);
    } else {
        normalizedData = [...cleanData];
    }

    // const { alpha, beta, R2 } = purelinearRegression(normalizedData, position[0], position[1]);
    const Xt_ = json2matrix(normalizedData, position.slice(0, 1))
    const ones = Xt_.map(x => [1]);
    const Xt = Algebra.augmentMatrix(ones, Xt_);
    const y_ = json2matrix(normalizedData, position.slice(1));
    const result = generalLinearRegression(Xt, y_);
    if (result) {
        const [alphas, betas, ] = result;
        console.log(result)
        const alpha = alphas[0];
        const beta = betas[0];
        const xValues = normalizedData.map(r => r[position[0]]);
        const startIndex = minIndex(xValues);
        const endIndex = maxIndex(xValues);
        const startX: number = xValues[startIndex];
        const endX: number = xValues[endIndex];
        const y_hat = (x: number) => alpha + beta * x;

        const startY = y_hat(startX);
        const endY = y_hat(endX);

        view.annotation().line({
            top: true,
            style: {
                lineDash: [8, 4],
                stroke: '#595959',
            },
            // @ts-ignore
            start: [cleanData[startIndex][position[0]], startY],
            // @ts-ignore
            end: [cleanData[endIndex][position[0]], endY],
        });

    }
    
}