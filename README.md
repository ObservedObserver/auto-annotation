# auto-annotations

![](https://img.shields.io/npm/v/auto-annotations#align=left&display=inline&height=20&margin=%5Bobject%20Object%5D&name=&originHeight=20&originWidth=80&status=done&style=none&width=80)<br />auto-annotations是一个帮助你在可视化图表中自动标注出有价值的信息的工具。<br />

```bash
npm i --save auto-annotations
```

## 自动化感知推荐标记 AutoAnnotation

`AutoAnnotation` 会识别视图中的洞察信息，并根据洞察的显著性推荐最合适的洞察，并返回一个标注函数。后续调用这个标注函数，即可完成在图表上的标注。

+ 构建参数: `view`，为一个G2.View
+ 方法
    + `recommand()` 返回一个annotation函数，这个函数获得参数后可以用来绘制。

```typescript
import { annotations, AutoAnnotation } from 'auto-annotations';

chart.point().position([xField, yField]);
chart.data(dataSource);

const ann = new AutoAnnotation(chart);

const annotate = ann.recommand()
annotate(chart, dataSource, [xField, yField]);

chart.render();
```

最终的推荐结果如下

![](https://cdn.nlark.com/yuque/0/2021/png/171008/1614741461882-35a6af2e-9437-4755-9ea3-10714e6ae282.png)

## 自定义标记
除了自动推荐标注外，你也可以直接使用你想要的标注。这些标注函数可以识别特定的洞察类型，并进行标注。标注函数本身并不是纯粹的绘制函数，其必须先识别到视图中的某个具体的洞察，根据洞察的一些数理信息，进行标注。

### 回归 annotateGeneralRegression
```typescript
annotations.annotateGeneralRegression(
    view: View,
    order?: number
) 
```
#### 线性回归
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(mockData);

annotations.annotateGeneralRegression(chart);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695346877-1b2d6e77-4975-49ef-9beb-0c07310d60ef.png#align=left&display=inline&height=420&margin=%5Bobject%20Object%5D&name=image.png&originHeight=840&originWidth=1000&size=48302&status=done&style=none&width=500)<br />

#### 多项式回归
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(mockData);

annotations.annotateGeneralRegression(chart, 4);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695359069-2305b839-0b89-4115-a210-8b2f8f2ce4e9.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=50623&status=done&style=none&width=500)
#### 散点图回归
对auto-annotation而言，散点图回归和折线图回归是没有本质区别的。
```typescript
import {annotations} from 'auto-annotations';

chart.line().position([xField, yField]);
chart.data(data);

annotations.annotateGeneralRegression(chart);

chart.render()
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695366621-f89d9725-d69b-4cf4-8163-648b5140bb7e.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=91731&status=done&style=none&width=500)<br />
<br />

### 异常/离群值 annotateOutlier
```typescript
import {annotations} from 'auto-annotations';

chart.point().shape('circle').position([xField, yField]);
chart.data(dataSource);

annotations.annotateOutlier(chart);

chart.render();
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695373907-d4f5cae7-c8ab-4450-aecc-087391ce1193.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=88431&status=done&style=none&width=500)<br />

### 群簇 annotateCluster
```typescript
import {annotations} from 'auto-annotations';

chart.point().position([xField, yField]);
chart.data(dataSource);

annotations.annotateCluster(chart);

chart.render();
```
![image.png](https://cdn.nlark.com/yuque/0/2021/png/171008/1614695380407-df7fb420-e0fc-485a-9f04-a4aa3610217c.png#align=left&display=inline&height=360&margin=%5Bobject%20Object%5D&name=image.png&originHeight=720&originWidth=1000&size=90207&status=done&style=none&width=500)<br />

