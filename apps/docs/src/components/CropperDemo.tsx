import { useCallback, useEffect, useRef, useState } from "react";
import {
  Cropper,
  builtinShapes,
  type AspectRatio,
  type ExportFormat,
  type ShapeId,
} from "@vropper/core";
import {
  Download,
  FlipHorizontal2,
  FlipVertical2,
  RotateCcw,
  RotateCw,
  Upload,
  Undo2,
} from "lucide-react";
import demoPortrait from "@docs/assets/demo-portrait.jpg";

const aspectRatios: { label: string; value: AspectRatio }[] = [
  { label: "1:1", value: 1 },
  { label: "4:5", value: 4 / 5 },
  { label: "16:9", value: 16 / 9 },
  { label: "3:4", value: 3 / 4 },
  { label: "Free", value: "free" },
];

const formats: { label: string; value: ExportFormat }[] = [
  { label: "PNG", value: "image/png" },
  { label: "JPEG", value: "image/jpeg" },
  { label: "WebP", value: "image/webp" },
];

export function CropperDemo() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const cropperRef = useRef<Cropper | null>(null);

  const [shape, setShape] = useState<ShapeId>("rounded");
  const [radius, setRadius] = useState(0.35);
  const [points, setPoints] = useState(5);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [aspect, setAspect] = useState<AspectRatio>(1);
  const [format, setFormat] = useState<ExportFormat>("image/png");
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const cropper = new Cropper({
      shape: "rounded",
      shapeOptions: { radius: 0.35, points: 5, innerRatio: 0.45 },
      aspectRatio: 1,
      zoom: { min: 1, max: 6 },
    });
    cropperRef.current = cropper;
    cropper.attach(canvas, { backdrop: "rgba(10,10,10,0.55)", outline: "rgba(210,245,90,0.95)" });
    cropper.on("change", (state) => {
      const next = state as { zoom: number; rotation: number };
      setZoom(next.zoom);
      setRotation(next.rotation);
    });
    void cropper.load(demoPortrait);

    const observer = new ResizeObserver(() => cropper.resize());
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      cropper.destroy();
      cropperRef.current = null;
    };
  }, []);

  const applyShape = useCallback((next: ShapeId) => {
    setShape(next);
    cropperRef.current?.setShape(next);
  }, []);

  const onUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) void cropperRef.current?.load(file);
  };

  const onExport = async () => {
    const cropper = cropperRef.current;
    if (!cropper) return;
    const result = await cropper.export({ type: format, width: 640 });
    setPreview((current) => {
      if (current) URL.revokeObjectURL(current);
      return result.url;
    });
    const link = document.createElement("a");
    link.href = result.url;
    link.download = result.file.name;
    link.click();
  };

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] 2xl:grid-cols-[minmax(0,1fr)_380px]">
      <div className="relative overflow-hidden rounded-3xl border border-border bg-ink">
        <canvas
          ref={canvasRef}
          className="block h-[320px] w-full sm:h-[420px] lg:h-[520px] 2xl:h-[620px] cursor-grab touch-none active:cursor-grabbing"
        />
        <div className="pointer-events-none absolute left-3 top-3 max-w-[calc(100%-1.5rem)] truncate rounded-full bg-ink/70 px-3 py-1 text-[10px] sm:left-4 sm:top-4 sm:text-[11px] text-ink-foreground/80">
          Drag to pan · scroll to zoom · pinch on touch
        </div>
      </div>

      <div className="space-y-5 rounded-3xl border border-border bg-card p-5">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Shape
          </p>
          <div className="flex flex-wrap gap-1.5">
            {builtinShapes.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => applyShape(item.id)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  shape === item.id
                    ? "bg-lime text-lime-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        {shape === "rounded" && (
          <Slider
            label={`Corner radius · ${Math.round(radius * 100)}%`}
            min={0}
            max={1}
            step={0.01}
            value={radius}
            onChange={(value) => {
              setRadius(value);
              cropperRef.current?.setShapeOptions({ radius: value });
            }}
          />
        )}

        {shape === "star" && (
          <Slider
            label={`Star points · ${points}`}
            min={3}
            max={12}
            step={1}
            value={points}
            onChange={(value) => {
              setPoints(value);
              cropperRef.current?.setShapeOptions({ points: value });
            }}
          />
        )}

        <Slider
          label={`Zoom · ${zoom.toFixed(2)}x`}
          min={1}
          max={6}
          step={0.01}
          value={zoom}
          onChange={(value) => cropperRef.current?.setZoom(value)}
        />

        <Slider
          label={`Rotation · ${Math.round(rotation)}°`}
          min={0}
          max={359}
          step={1}
          value={rotation}
          onChange={(value) => cropperRef.current?.setRotation(value)}
        />

        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Aspect ratio
          </p>
          <div className="flex flex-wrap gap-1.5">
            {aspectRatios.map((item) => (
              <button
                key={item.label}
                type="button"
                onClick={() => {
                  setAspect(item.value);
                  cropperRef.current?.setAspectRatio(item.value);
                }}
                className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                  aspect === item.value
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-5 gap-1.5">
          <IconButton label="Rotate left" onClick={() => cropperRef.current?.rotate(-90)}>
            <RotateCcw className="size-4" />
          </IconButton>
          <IconButton label="Rotate right" onClick={() => cropperRef.current?.rotate(90)}>
            <RotateCw className="size-4" />
          </IconButton>
          <IconButton label="Flip horizontal" onClick={() => cropperRef.current?.flip("x")}>
            <FlipHorizontal2 className="size-4" />
          </IconButton>
          <IconButton label="Flip vertical" onClick={() => cropperRef.current?.flip("y")}>
            <FlipVertical2 className="size-4" />
          </IconButton>
          <IconButton label="Reset" onClick={() => cropperRef.current?.reset()}>
            <Undo2 className="size-4" />
          </IconButton>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {formats.map((item) => (
            <button
              key={item.value}
              type="button"
              onClick={() => setFormat(item.value)}
              className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                format === item.value
                  ? "bg-primary text-primary-foreground"
                  : "bg-secondary text-secondary-foreground hover:bg-accent"
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        <div className="flex gap-2">
          <label className="inline-flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-full border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent">
            <Upload className="size-4" />
            Image
            <input type="file" accept="image/*" className="hidden" onChange={onUpload} />
          </label>
          <button
            type="button"
            onClick={onExport}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-lime px-4 py-2.5 text-sm font-semibold text-lime-foreground transition-transform hover:scale-[1.02]"
          >
            <Download className="size-4" />
            Export
          </button>
        </div>

        {preview && (
          <div className="flex items-center gap-3 rounded-2xl bg-secondary p-3">
            <img
              src={preview}
              alt="Cropped result preview"
              className="size-14 rounded-lg object-contain"
            />
            <p className="text-xs text-muted-foreground">
              Exported as Blob, File and object URL — downloaded to your device.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function Slider({
  label,
  min,
  max,
  step,
  value,
  onChange,
}: {
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block">
      <span className="mb-2 block text-xs font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-secondary accent-lime"
      />
    </label>
  );
}

function IconButton({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      title={label}
      className="inline-flex items-center justify-center rounded-xl bg-secondary py-2.5 text-secondary-foreground transition-colors hover:bg-accent"
    >
      {children}
    </button>
  );
}
