# auto-annotations文档

![](https://img.shields.io/npm/v/auto-annotations#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&name=&originHeight=20&originWidth=80&status=done&style=none&width=80)<br />auto-annotations是一个帮助你在可视化图表中自动标注出有价值的信息的工具。<br />

```bash
npm i --save auto-annotations
```


## 自定义标记
### 回归 annotateGeneralRegression
```typescript
import {annotations} from 'auto-annotations';

annotations.annotateGeneralRegression(
    view: View,
    rawData: IRow[],
    position: [string, string],
    order: number
) 
```
#### 线性回归
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(mockData);

annotations.annotateGeneralRegression(chart, mockData, [xField, yField], 1);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695346877-1b2d6e77-4975-49ef-9beb-0c07310d60ef.png#align=left&display=inline&height=420&margin=%5Bobject%20Object%5D&name=image.png&originHeight=840&originWidth=1000&size=48302&status=done&style=none&width=500)<br />

#### 多项式回归
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(mockData);

annotations.annotateGeneralRegression(chart, mockData, [xField, yField], 4);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695359069-2305b839-0b89-4115-a210-8b2f8f2ce4e9.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=50623&status=done&style=none&width=500)
#### 散点图回归
对auto-annotation而言，散点图回归和折线图回归是没有本质区别的。
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(data);

annotations.annotateGeneralRegression(chart, data, [xField, yField], 1);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695366621-f89d9725-d69b-4cf4-8163-648b5140bb7e.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=91731&status=done&style=none&width=500)<br />
<br />

### 异常/离群值 annotateOutlier
```typescript
import {annotations} from 'auto-annotations';

chart.point().shape('circle').position([xField, yField]);
chart.data(dataSource);

annotations.annotateOutlier(chartRef.current, dataSource, [xField, yField]);

chart.render();
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695373907-d4f5cae7-c8ab-4450-aecc-087391ce1193.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=88431&status=done&style=none&width=500)<br />

### 群簇 annotateCluster
```typescript
import {annotations} from 'auto-annotations';

chart.point().position([xField, yField]);
chart.data(dataSource);

annotations.annotateCluster(chartRef.current, dataSource, [xField, yField]);

chart.render();
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695380407-df7fb420-e0fc-485a-9f04-a4aa3610217c.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=90207&status=done&style=none&width=500)<br />

