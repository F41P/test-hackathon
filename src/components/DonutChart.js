// src/components/DonutChart.js
import React from 'react';
import { View } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const DonutChart = ({
  size = 140,
  strokeWidth = 20,
  data = [] 
}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  let accumulatedPercentage = 0;

  return (
    <View style={{ width: size, height: size, transform: [{ rotate: '-90deg' }] }}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <G>
          {data.map((item, index) => {
            const itemPercentage = parseFloat(item.percentage) || 0;
            const strokeDashoffset = circumference - (circumference * itemPercentage) / 100;
            const rotation = (accumulatedPercentage / 100) * 360;
            accumulatedPercentage += itemPercentage;

            return (
              <Circle
                key={index}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                stroke={item.color || '#CCCCCC'}
                strokeWidth={strokeWidth}
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="butt"
                transform={`rotate(${rotation}, ${size / 2}, ${size / 2})`}
                fill="transparent"
              />
            );
          })}
        </G>
      </Svg>
    </View>
  );
};

export default DonutChart;