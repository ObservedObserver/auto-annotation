import React, { useEffect, useRef } from 'react';
import { Chart } from '@antv/g2';
import { IRow } from '../interfaces';
import { AutoAnnotation } from 'auto-annotations';

interface LineChartProps {
    dataSource: IRow[];
    xField: string;
    yField: string;
}
const RecommandChart: React.FC<LineChartProps> = (props) => {
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
            const view = chartRef.current;
            console.log(
                'view optios',
                view.getOptions().data,
                view.getOptions(),
                view.geometries.forEach(geom => {
                    console.log(geom.getXYFields())
                })
            );
            const ann = new AutoAnnotation(chartRef.current);
            const annotate = ann.recommand()
            annotate(chartRef.current);
            chartRef.current.render();
        }
    }, [dataSource, xField, yField]);
    return <div ref={container}></div>;
};

export default RecommandChart;
