
import React, { useEffect, useRef, useState } from 'react';
import './ToolbarSlider.scss';
import findMetrics, { findMetricsViaValue } from './utils/findMetrics.js';

const CUIToolbarSlider = (
  args: {
    disabled?: boolean,
    value: number,
    max: number,
    min: number,
    roundValue?: boolean,
    snapToTick?: boolean,
    onChange?: (val: number) => void,
    onUpdate?: (val: number) => void,
  }
) => {

  const {
    disabled = false,
    value,
    max = 100,
    min = 0,
    roundValue = true,
    snapToTick = false,
    onChange = (val: number) => null,
    onUpdate = (val: number) => null,
  } = args;

  const [isDragging, setIsDragging] = useState(false);
  const [knobX, setKnobX] = useState<number>(0);
  const [newValue, setNewValue] = useState<number | undefined>(value);
  const trackRef = useRef(null);

  useEffect(() => {
    if (!trackRef.current) return;
    const metrics = findMetricsViaValue(
      trackRef.current as HTMLDivElement,
      value, max, min, roundValue
    );
    setKnobX(metrics.knobX);
    setNewValue(metrics.value);
    if (metrics.value !== value) {
      onUpdate(metrics.value);
    }
  }, [max, min, roundValue, setNewValue, value, onUpdate]);

  useEffect(() => {
    const mouseMove = (evt: MouseEvent) => {
      if (!trackRef.current) return;
      const metrics = findMetrics(
        trackRef.current as HTMLDivElement,
        evt, max, min, roundValue, snapToTick
      );
      setKnobX(metrics.knobX);
      setNewValue(metrics.value);
      if (onChange) onChange(metrics.value);
    }
    const mouseUp = () => {
      setIsDragging(false);
      // snap into value spot
      if (!trackRef.current) return;
      const metricsViaValue = findMetricsViaValue(
        trackRef.current as HTMLDivElement,
        newValue || 0, max, min, roundValue
      );
      setKnobX(metricsViaValue.knobX);
      if (onUpdate) onUpdate(newValue || 0);
    }
    if (isDragging) {
      window.addEventListener('mousemove', mouseMove);
      window.addEventListener('mouseup', mouseUp);
    }else{
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', mouseMove);
      window.removeEventListener('mouseup', mouseUp);
    }
  }, [
    isDragging,
    max, min, roundValue,
    setIsDragging,
    setNewValue,
    onChange, onUpdate,
    newValue,
    snapToTick
  ]);
  

  const formattedValue = new Intl.NumberFormat(
    navigator.language, {
      maximumFractionDigits: 2
    }
  ).format(newValue || 0)

  return (
    <div className={`cui-toolbar-slider ${`${max}`.length > 3 ? 'long' : ''}`}>
      <div className='track'
          ref={trackRef}
          onMouseUp={(evt) => {
            if (!isDragging) {
              if (!trackRef.current) return;
              const metrics = findMetrics(
                trackRef.current as HTMLDivElement,
                evt as unknown as MouseEvent,
                max, min, roundValue, snapToTick
              );
              setKnobX(metrics.knobX);
              setNewValue(metrics.value);
              if (onChange) onChange(metrics.value);
              // setTimeout(() => {
                if (onUpdate) onUpdate(metrics.value);
              // }, 500);
            }
          }}>
        <button className={`knob ${disabled ? 'disabled' : ''}`}
          style={{left: `${knobX}px`}}
          onKeyDown={(evt) => {
            if (!trackRef.current || newValue === undefined) return;
            let tmpNewValue = newValue;
            const offset = evt.shiftKey ? 10 : 1;
            if (
              evt.code === "ArrowLeft" ||
              evt.code === "ArrowDown"
            ) {
              tmpNewValue -= offset;
            }
            if (
              evt.code === "ArrowRight" ||
              evt.code === "ArrowUp"
            ) {
              tmpNewValue += offset;
            }
            const metricsViaValue = findMetricsViaValue(
              trackRef.current as HTMLDivElement,
              tmpNewValue, max, min, roundValue
            );
            setKnobX(metricsViaValue.knobX);
            setNewValue(metricsViaValue.value);
            if (onUpdate) onUpdate(tmpNewValue);
          }}
          onMouseDown={() => {
            setIsDragging(true)
          }}><div className='knob-label'>{formattedValue}</div></button>
        {/* <div className='hint' style={{left: `${knobX + 20}px`}}>{formattedValue}</div> */}
      </div>
    </div>
  );
};



export default CUIToolbarSlider;
