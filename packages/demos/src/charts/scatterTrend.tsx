import React, { useEffect, useRef } from 'react';
import { mockTrendData } from '../utils';
import { Chart } from '@antv/g2';
import { regression } from '../core/annotations/regression';
import { IRow } from '../interfaces';


interface LineChartProps {
    dataSource: IRow[];
    xField: string;
    yField: string;
}
const ScatterTrendChart: React.FC<LineChartProps> = (props) => {
    const { dataSource, xField, yField } = props;

    const container = useRef<HTMLDivElement>(null);
    const chartRef = useRef<Chart>();

    useEffect(() => {
        if (container.current) {
            const chart = new Chart({
                container: container.current,
                width: 500,
                height: 360,
                padding: [40, 40, 40, 40]
            });
            chart.theme('tableau');
            // chart.line().position('x*y');
            // chart.data(mockData);
            // regression(chart, mockData, ['x', 'y']);
            // chart.render();
            chartRef.current = chart;
        }
    }, []);

    // useEffect(() => {
    //     if (chartRef.current) {
    //         chartRef.current.point().position([xField, yField]);
    //         chartRef.current.render();
    //     }
    // }, [xField, yField])

    // useEffect(() => {
    //     if (chartRef.current) {
    //         chartRef.current.changeData(dataSource)
    //     }
    // }, [dataSource])

    useEffect(() => {
        if (chartRef.current) {
            console.log(dataSource, xField, yField)
            chartRef.current.clear();
            chartRef.current.point().shape('circle').position([xField, yField]);
            chartRef.current.data(dataSource)
            regression(chartRef.current, dataSource, [xField, yField]);
            chartRef.current.render()
        }
    }, [dataSource, xField, yField])
    return <div ref={container}></div>;
};

export default ScatterTrendChart;
