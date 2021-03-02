import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import App from './App'
import { registerTheme } from '@antv/g2';
const tableau10: string[] = [
    '#4c78a8',
    '#f58518',
    '#e45756',
    '#72b7b2',
    '#54a24b',
    '#eeca3b',
    '#b279a2',
    '#ff9da6',
    '#9d755d',
    '#bab0ac',
];

registerTheme('tableau', {
    styleSheet: {
        paletteQualitative10: tableau10,
    },
});

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
)
