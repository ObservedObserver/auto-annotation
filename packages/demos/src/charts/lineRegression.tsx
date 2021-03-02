import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { annotations } from 'auto-annotations';
import { IRow } from '../interfaces';

function mockOrderData(xField: string, yField: string, size: number) {
    let ans: IRow[] = [];
    for (let i = 0; i < size; i++) {
        ans.push({
            [xField]: i,
            [yField]:
                Math.random() * 32 -
                64 +
                10 -
                0.1 * i ** 3 +
                2 * i ** 2 -
                i * 5 +
                20 * Math.sin(((2 * Math.PI) / 6) * i),
        });
    }
    return ans;
}


const mockData = mockOrderData('x', 'y', 20);
const LineRegressionChart: React.FC = props => {
    const container = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(()=> {
        if (container.current) {
            const chart = new Chart({
                container: container.current,
                width: 500,
                height: 360,
                padding: [40, 40, 40, 40],
            });
            chart.theme('tableau')
            chart.line().position('x*y');
            chart.data(mockData);
            annotations.annotateGeneralRegression(
                chart,
                mockData,
                ['x', 'y'],
                4
            );
            chart.render()
            chartRef.current = chart;
        }
    }, [])
    return <div ref={container}></div>
}

export default LineRegressionChart;
