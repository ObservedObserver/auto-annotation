import { vlAnnotations } from 'auto-annotations';
import React, { useEffect, useRef } from 'react';
import embed from 'vega-embed';
import { TopLevelSpec } from 'vega-lite'
import { IRow } from '../../interfaces';


interface LineChartProps {
    dataSource: IRow[];
    xField: string;
    yField: string;
}
const ScatterOutlierChart: React.FC<LineChartProps> = (props) => {
    const { dataSource, xField, yField } = props;

    const container = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (container.current) {
            // @ts-ignore
            const spec: TopLevelSpec = {
                data: {
                    values: dataSource
                },
                mark: 'point',
                encoding: {
                    x: {
                        field: xField,
                        type: 'quantitative'
                    },
                    y: {
                        field: yField,
                        type: 'quantitative'
                    }
                }
            }
            const annotatedSpec = vlAnnotations.annotateOutlier(spec);
            embed(container.current, annotatedSpec, {
                mode: 'vega-lite',
            });
            console.log(dataSource, xField, yField);

        }
    }, [dataSource, xField, yField]);
    return <div ref={container}></div>;
};

export default ScatterOutlierChart;
