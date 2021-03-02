import React, { useEffect, useState } from 'react'
import Line from './charts/line';

import './App.css'
import { IRow, IField } from './interfaces';
import { getCarsData } from './service/cars';
import ScatterTrendChart from './charts/scatterTrend';
import ScatterOutlierChart from './charts/scatterOutlier';
import ScatterClusterChart from './charts/scatterCluster';
import LineRegressionChart from './charts/lineRegression';
import RecommandChart from './charts/recommand';

function App() {
  const [dataSource, setDataSource] = useState<IRow[] | null>([]);
  // const [fields, setFields] = useState<IField[] | null>([]);

  useEffect(() => {
    getCarsData().then(res => {
      setDataSource(res.dataSource);
      // setFields(res.fields);
    })
  }, [])

  console.log('render')

  return (
      <div className="App">
          <Line />
          <LineRegressionChart />
          {/* {dataSource && dataSource.length > 0 && (
              <ScatterTrendChart
                  dataSource={dataSource}
                  xField="Displacement"
                  yField="Horsepower"
              />
          )} */}
          {dataSource && dataSource.length > 0 && (
              <RecommandChart
                  dataSource={dataSource}
                  xField="Displacement"
                  yField="Acceleration"
              />
          )}
          {dataSource && dataSource.length > 0 && (
              <ScatterOutlierChart
                  dataSource={dataSource}
                  xField="Displacement"
                  yField="Horsepower"
              />
          )}
          {dataSource && dataSource.length > 0 && (
              <ScatterClusterChart
                  dataSource={dataSource}
                  xField="Displacement"
                  yField="Horsepower"
              />
          )}
      </div>
  );
}

export default App
