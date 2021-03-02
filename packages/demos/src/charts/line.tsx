import React, { useEffect, useRef } from 'react';
import { mockTrendData } from '../utils';
import { Chart } from '@antv/g2';
import { regression } from '../core/annotations/regression';
const mockData = mockTrendData('x', 'y', 20);
const LineChart: React.FC = props => {
    const container = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(()=> {
        if (container.current) {
            const chart = new Chart({
                container: container.current,
                width: 500,
                height: 420,
                padding: [40, 40, 40, 40],
            });
            chart.theme('tableau')
            chart.line().position('x*y');
            chart.data(mockData);
            regression(chart, mockData, ['x', 'y']);
            chart.render()
            chartRef.current = chart;
        }
    }, [])
    return <div ref={container}></div>
}

export default LineChart;
