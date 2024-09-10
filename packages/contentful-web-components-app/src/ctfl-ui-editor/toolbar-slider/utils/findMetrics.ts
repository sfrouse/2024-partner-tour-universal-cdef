

const KNOB_WIDTH = 40;

export default function findMetrics(
  track: HTMLDivElement,
  evt: MouseEvent,
  max: number, min: number, roundValue: boolean,
  snapToTick: boolean
) {
  const rect = track.getBoundingClientRect();
  const newKnobx = Math.max(
    KNOB_WIDTH/2, Math.min(
      evt.clientX - rect.left,
      rect.width - KNOB_WIDTH/2
    )
  );
  const finalKnobx = newKnobx - KNOB_WIDTH/2;
  const knobPercent = finalKnobx / (rect.width - KNOB_WIDTH);
  const valueRange = max - min;
  let finalValue = knobPercent * valueRange;
  finalValue = cleanUpValue(finalValue, roundValue) + min;
  if (snapToTick) {
    const metricsViaValue = findMetricsViaValue(track, finalValue, max, min, roundValue);
    return metricsViaValue;// snaps into place
  }else{
    return {
      value: finalValue,
      knobX: finalKnobx
    }
  }
}

export function findMetricsViaValue(
  track: HTMLDivElement,
  value: number,
  max: number, min: number, roundValue: boolean
) {
  const valueRange = max - min;
  let finalValue = Math.max(
    min, Math.min(
      value,
      max
    )
  );
  finalValue = cleanUpValue(finalValue, roundValue);
  const valueOffsetPercent = (finalValue - min) / valueRange;
  const rect = track.getBoundingClientRect();
  const finalKnobx = Math.max(
    0, Math.min(
      valueOffsetPercent * (rect.width - KNOB_WIDTH),
      rect.width - KNOB_WIDTH
    )
  );
  return {
    value: finalValue,
    knobX: finalKnobx
  }
}

function cleanUpValue( value: number, roundValue: boolean) {
  let finalValue = value;
  if (roundValue) {
    finalValue = Math.round(finalValue);
  }
  return finalValue;
}