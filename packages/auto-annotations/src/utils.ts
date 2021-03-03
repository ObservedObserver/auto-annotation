import moment from "moment";
import { IRow } from "./interfaces";

export function mockTrendData (xField: string, yField: string, size: number) {
    let ans: IRow[] = [];
    for (let i = 0; i < size; i++) {
        ans.push({
            [xField]: i,
            [yField]: Math.random() * 10 - 16 + 10 + i * -4 + 12 * Math.sin(2 * Math.PI / 8 * i)
        })
    }
    return ans;
}

function getCleanFieldValues(dataSource: IRow[], field: string): any[] {
    return dataSource
        .map((r) => r[field])
        .filter((v) => v !== null || v !== undefined);
}
export function isNumField(dataSource: IRow[], field: string): boolean {
    return getCleanFieldValues(dataSource, field).every((v) => !isNaN(v));
}

export function isTimeField(dataSource: IRow[], field: string): boolean {
    return getCleanFieldValues(dataSource, field).every((v) =>
        /^[0-9]{0,4}[\-\/]{0,1}[0-9]{0,2}[\-\/]{0,1}[0-9]{0,2}[\s]*[0-9\:]*$/.test(
            v
        )
    );
}

export function reduceSum(values: number[]): number {
    return values.reduce((t, r) => t + r, 0);
}

export function mean(dataSource: IRow[], field: string): number {
    const values: number[] = getCleanFieldValues(dataSource, field);
    const sum = reduceSum(values);
    return sum / values.length;
}

export function variance(values: number[]): number {
    const _sum = reduceSum(values);
    const _mean = _sum / values.length;
    let ans = 0;
    values.forEach(v => {
        ans += (v - _mean) ** 2
    })
    // 这里研究的就是子簇本身，不是整体，所以不使用样本的无偏估计。
    ans /= values.length;
    return ans;
}

export function rescale(dataSource: IRow[], fields: string[]) {
    const ranges: Array<[number, number]> = fields.map((f) => {
        const values = dataSource.map((r) => r[f]);
        const _max = Math.max(...values);
        const _min = Math.min(...values);
        return [_min, _max];
    });
    return dataSource.map((r) => {
        const newRecord = { ...r };
        fields.forEach((f, fIndex) => {
            newRecord[f] =
                (newRecord[f] - ranges[fIndex][0]) /
                (ranges[fIndex][1] - ranges[fIndex][0]);
        });
        return newRecord;
    });
}

export function normalize2quantitative(
    dataSource: IRow[],
    xField: string
): IRow[] {
    let normalizedData: IRow[] = [];
    if (isTimeField(dataSource, xField)) {
        console.log('is time');
        normalizedData = dataSource.map((r) => ({
            ...r,
            [xField]: moment(r[xField], 'YYYYMMDD').unix(),
        }));
    } else {
        normalizedData = dataSource.map((r, index) => ({
            ...r,
            [xField]: index,
        }));
    }
    return normalizedData;
}

export function minIndex (values: number[]) {
    let minValue = Infinity;
    let _minIndex = -1;
    for (let i = 0; i < values.length; i++) {
        if (values[i] < minValue) {
            minValue = values[i];
            _minIndex = i;
        }
    }
    return _minIndex;
}

export function maxIndex(values: number[]) {
    let maxValue = -Infinity;
    let _maxIndex = -1;
    for (let i = 0; i < values.length; i++) {
        if (values[i] > maxValue) {
            maxValue = values[i];
            _maxIndex = i;
        }
    }
    return _maxIndex;
}

export function json2matrix (dataSource: IRow[], fieldKeys: string[]): number[][] {
    const matrix: number[][] = [];
    for (let record of dataSource) {
        const row: number[] = [];
        for (let fkey of fieldKeys) {
            row.push(record[fkey])
        }
        matrix.push(row)
    }
    return matrix;
}

export function dropNull(dataSource: IRow[], fieldKeys: string[]): IRow[] {
    return dataSource.filter(row => {
        return fieldKeys.every(f => row[f] !== null && row[f] !== undefined)
    })
}

export function vec_dot(vec1: number[], vec2: number[]): number {
    let sum = 0;
    for (let i = 0; i < vec1.length; i++) {
        sum += vec1[i] * vec2[i];
    }
    return sum;
}