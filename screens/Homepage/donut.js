import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput, Animated, Easing } from 'react-native';
import Svg, { G, Circle } from 'react-native-svg';

const AnimatedCircle = Animated.createAnimatedComponent(Circle);

const Donut = ({
  percentage = 75,
  radius = 40,
  strokeWidth = 10,
  duration = 500,
  color = 'tomato',
  delay = 0,

  textColor,
  max = 100,
}) => {
  const animated = useRef(new Animated.Value(0)).current;
  const circleRef = useRef();
  const inputRef = useRef();
  const circumference = 2 * Math.PI * radius;
  const halfCircle = radius + strokeWidth;

  const animation = (toValue) => {
    return Animated.timing(animated, {
      delay: 1000,
      toValue,
      duration,
      useNativeDriver: true,
      easing: Easing.out(Easing.ease),
    }).start(() => {
      animation(toValue === 0 ? percentage : 0);
    });
  };

  useEffect(() => {
    animation(percentage);
    animated.addListener((v) => {
      const maxPerc = (100 * v.value) / max;
      const strokeDashoffset = circumference - (circumference * maxPerc) / 100;
      if (inputRef?.current) {
        inputRef.current.setNativeProps({
          text: `${Math.round(v.value)}`,
        });
      }
      if (circleRef?.current) {
        circleRef.current.setNativeProps({
          strokeDashoffset,
        });
      }
    });

    return () => {
      animated.removeAllListeners();
    };
  }, [max, percentage]);

  return (
    <View style={{ width: radius * 2, height: radius * 2, marginBottom: 20 }}>
      <Svg height={radius * 2} width={radius * 2} viewBox={`0 0 ${halfCircle * 2} ${halfCircle * 2}`}>
        <G rotation="-90" origin={`${halfCircle}, ${halfCircle}`}>
          <AnimatedCircle
            ref={circleRef}
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDashoffset={circumference}
            strokeDasharray={circumference}
          />
          <Circle
            cx="50%"
            cy="50%"
            r={radius}
            fill="transparent"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinejoin="round"
            strokeOpacity=".1"
          />
        </G>
      </Svg>
      <TextInput
        ref={inputRef}
        underlineColorAndroid="transparent"
        editable={false}
        defaultValue="0"
        style={[
          StyleSheet.absoluteFillObject,
          { fontSize: radius / 2, color: textColor ?? color },
          styles.text,
        ]}
      />

      {/* Nutritional information */}
     
    </View>
  );
};

const styles = StyleSheet.create({
  text: { fontWeight: '900', textAlign: 'center' },

  nutritionalInfo: {
    marginTop: 10,
    alignItems: 'center',
  },

  nutritionalText: {
    fontSize: 14,
    marginTop: 5,
  },
});

export default Donut;
