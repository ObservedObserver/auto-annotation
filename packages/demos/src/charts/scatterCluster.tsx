import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { regression } from '../core/annotations/regression';
import { IRow } from '../interfaces';
import { annotateOutlier } from '../core/annotations/outliers';
import { annotateCluster } from '../core/annotations/cluster';

interface LineChartProps {
    dataSource: IRow[];
    xField: string;
    yField: string;
}
const ScatterClusterChart: React.FC<LineChartProps> = (props) => {
    const { dataSource, xField, yField } = props;

    const container = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {
        if (container.current) {
            const chart = new Chart({
                container: container.current,
                width: 500,
                height: 360,
                padding: [40, 40, 40, 40],
            });
            chart.theme('tableau');
            chartRef.current = chart;
        }
    }, []);

    useEffect(() => {
        if (chartRef.current) {
            chartRef.current.clear();
            chartRef.current.point().shape('circle').position([xField, yField]);
            chartRef.current.data(dataSource);
            annotateCluster(chartRef.current, dataSource, [xField, yField]);
            chartRef.current.render();
        }
    }, [dataSource, xField, yField]);
    return <div ref={container}></div>;
};

export default ScatterClusterChart;
