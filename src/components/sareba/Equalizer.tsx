interface EqualizerProps {
  /** false = en pause (barres figees) */
  playing?: boolean;
  rounded?: string;
}

const HEIGHTS = ["h-4", "h-2.5", "h-5", "h-3"];
const DELAYS = ["0ms", "180ms", "360ms", "540ms"];

/** Barres animees de la maquette, indiquees sur la piste en cours de lecture. */
export default function Equalizer({
  playing = true,
  rounded = "rounded-2xl",
}: EqualizerProps) {
  return (
    <span
      className={`absolute inset-0 flex items-center justify-center gap-[3px] bg-scout-black/55 ${rounded}`}
      aria-hidden
    >
      {HEIGHTS.map((h, i) => (
        <span
          key={h + i}
          className={`w-[3px] origin-center rounded-full bg-white ${h} ${
            playing ? "animate-eq" : "opacity-40"
          }`}
          style={
            playing
              ? { animationDelay: DELAYS[i], animationDuration: `${900 + i * 90}ms` }
              : undefined
          }
        />
      ))}
    </span>
  );
}
