import { Algebra } from '@kanaries/ml';
export function multi (A: number[][], B: number[][]) {
    if (A[0].length !== B.length) {
        throw new Error('m*n X n*p');
    }
    const m = A.length;
    const n = A[0].length;
    const p = B[0].length;
    const ans: number[][] = [];

    for (let i = 0; i < m; i++) {
        const row = [];
        for (let j = 0; j < p; j++) {
            row.push(0);
        }
        ans.push(row);
    }

    for (let i = 0; i < m; i++) {
        for (let j = 0; j < p; j++) {
            let _sum = 0;
            for (let k = 0; k < n; k++) {
                _sum += A[i][k] * B[k][j];
            }
            ans[i][j] = _sum;
        }
    }
    return ans;
}
export function generalLinearRegression (X: number[][], y: number[][]) {
    // const beta: number[][] = [];
    // const ones = X_.map(x => [1]);
    // const X = Algebra.augmentMatrix(ones, X_);
    const XT = Algebra.transpose(X);
    // const y = yt.map(_y => [_y]);
    let beta: number[][] | boolean = multi(XT, X);
    // console.log('beta', beta, X, XT)
    beta = Algebra.Inverse.elementary(beta);
    if (beta) {
        beta = multi(beta, XT);
        beta = multi(beta, y);
    }
    return beta;
}