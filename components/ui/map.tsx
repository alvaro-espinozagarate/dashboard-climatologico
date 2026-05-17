"use client"

import React, {
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
  ReactNode,
} from "react"
import { createPortal } from "react-dom"
import type { Map as MapLibreMap, Marker, Popup } from "maplibre-gl"

const CARTO_LIGHT = "https://basemaps.cartocdn.com/gl/positron-gl-style/style.json"
const CARTO_DARK  = "https://basemaps.cartocdn.com/gl/dark-matter-gl-style/style.json"

export interface MapViewport {
  center:  [number, number]
  zoom:    number
  bearing: number
  pitch:   number
}

export interface MapStyles {
  light?: string
  dark?:  string
}

export interface MapRef {
  easeTo: (opts: { pitch?: number; bearing?: number; duration?: number }) => void
  getMap: () => MapLibreMap | null
}

interface MapContextValue {
  map:      MapLibreMap | null
  isLoaded: boolean
}

const MapContext = createContext<MapContextValue>({ map: null, isLoaded: false })
export function useMap() { return useContext(MapContext) }

// ── Map ────────────────────────────────────────────────────────────────────
interface MapProps {
  children?:         ReactNode
  className?:        string
  center?:           [number, number]
  zoom?:             number
  theme?:            "light" | "dark"
  styles?:           MapStyles
  viewport?:         Partial<MapViewport>
  onViewportChange?: (v: MapViewport) => void
  loading?:          boolean
}

export const Map = forwardRef<MapRef, MapProps>(function Map(
  { children, className, center = [-75.0, -9.19], zoom = 5,
    theme, styles, viewport, onViewportChange, loading = false },
  ref
) {
  const containerRef   = useRef<HTMLDivElement>(null)
  const mapRef         = useRef<MapLibreMap | null>(null)
  const stylesRef      = useRef(styles)
  const themeRef       = useRef(theme)
  const [isLoaded, setIsLoaded]         = useState(false)
  const [mapInstance, setMapInstance]   = useState<MapLibreMap | null>(null)

  useEffect(() => { stylesRef.current = styles }, [styles])
  useEffect(() => { themeRef.current  = theme  }, [theme])

  const resolveTheme = (): "light" | "dark" => {
    if (themeRef.current) return themeRef.current
    if (typeof document !== "undefined" &&
        document.documentElement.classList.contains("dark")) return "dark"
    return "light"
  }

  const getStyleUrl = (t: "light" | "dark") =>
    t === "dark"
      ? (stylesRef.current?.dark  ?? CARTO_DARK)
      : (stylesRef.current?.light ?? CARTO_LIGHT)

  useImperativeHandle(ref, () => ({
    easeTo: (opts) => mapRef.current?.easeTo(opts),
    getMap: () => mapRef.current,
  }))

  // ── Init ─────────────────────────────────────────────────────
  useEffect(() => {
    if (!containerRef.current) return
    let cancelled = false

    import("maplibre-gl").then(({ Map: MLMap }) => {
      if (cancelled || !containerRef.current || mapRef.current) return

      const m = new MLMap({
        container:          containerRef.current,
        style:              getStyleUrl(resolveTheme()),
        center:             viewport?.center  ?? center,
        zoom:               viewport?.zoom    ?? zoom,
        bearing:            viewport?.bearing ?? 0,
        pitch:              viewport?.pitch   ?? 0,
        attributionControl: false,
      })

      m.on("load", () => {
        if (cancelled) return
        mapRef.current = m
        setMapInstance(m)
        setIsLoaded(true)
      })

      if (onViewportChange) {
        m.on("move", () => {
          const c = m.getCenter()
          onViewportChange({ center: [c.lng, c.lat], zoom: m.getZoom(),
            bearing: m.getBearing(), pitch: m.getPitch() })
        })
      }
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      setMapInstance(null)
      setIsLoaded(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // ── Theme observer — only starts after map.on("load") fires ──
  useEffect(() => {
    if (!isLoaded) return   // guard: map must be ready

    let current = resolveTheme()

    const observer = new MutationObserver(() => {
      const next = resolveTheme()
      if (next !== current && mapRef.current) {
        current = next
        mapRef.current.setStyle(getStyleUrl(next))
      }
    })

    observer.observe(document.documentElement, {
      attributes: true, attributeFilter: ["class"],
    })

    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])   // ← key fix: depends on isLoaded, runs once map is ready

  // ── Controlled viewport ───────────────────────────────────────
  useEffect(() => {
    if (!mapRef.current || !viewport) return
    if (viewport.center)          mapRef.current.setCenter(viewport.center)
    if (viewport.zoom    != null) mapRef.current.setZoom(viewport.zoom)
    if (viewport.bearing != null) mapRef.current.setBearing(viewport.bearing)
    if (viewport.pitch   != null) mapRef.current.setPitch(viewport.pitch)
  }, [viewport])

  return (
    // key fix: pass mapInstance state (not mapRef.current) so children re-render when ready
    <MapContext.Provider value={{ map: mapInstance, isLoaded }}>
      <div style={{ position: "relative", width: "100%", height: "100%" }}>
        <div ref={containerRef} className={className}
          style={{ width: "100%", height: "100%" }} />
        {loading && (
          <div style={{
            position: "absolute", inset: 0, display: "flex",
            alignItems: "center", justifyContent: "center",
            background: "rgba(0,0,0,0.2)", fontSize: 13, color: "#fff",
          }}>
            Cargando mapa...
          </div>
        )}
        {isLoaded && children}
      </div>
    </MapContext.Provider>
  )
})

// ── MapControls ────────────────────────────────────────────────────────────
interface MapControlsProps {
  position?:       "top-left" | "top-right" | "bottom-left" | "bottom-right"
  showZoom?:       boolean
  showCompass?:    boolean
  showLocate?:     boolean
  showFullscreen?: boolean
  className?:      string
}

export function MapControls({
  position = "bottom-right", showZoom = true,
  showCompass = false, showLocate = false, showFullscreen = false, className,
}: MapControlsProps) {
  const { map, isLoaded } = useMap()
  const added = useRef(false)

  useEffect(() => {
    if (!map || !isLoaded || added.current) return
    added.current = true
    import("maplibre-gl").then(({ NavigationControl, FullscreenControl, GeolocateControl }) => {
      if (showZoom || showCompass) map.addControl(new NavigationControl({ showZoom, showCompass }), position)
      if (showFullscreen)          map.addControl(new FullscreenControl(), position)
      if (showLocate)              map.addControl(new GeolocateControl({ trackUserLocation: true }), position)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  return <div className={className} />
}

// ── MarkerContext ──────────────────────────────────────────────────────────
interface MarkerCtx { marker: Marker | null; setPopup: (p: Popup) => void }
const MarkerContext = createContext<MarkerCtx>({ marker: null, setPopup: () => {} })

// ── MapMarker ──────────────────────────────────────────────────────────────
interface MapMarkerProps {
  longitude: number; latitude: number; children?: ReactNode
  draggable?: boolean
  onClick?:      (e: MouseEvent) => void
  onMouseEnter?: (e: MouseEvent) => void
  onMouseLeave?: (e: MouseEvent) => void
  onDrag?:    (lngLat: { lng: number; lat: number }) => void
  onDragEnd?: (lngLat: { lng: number; lat: number }) => void
}

export function MapMarker({
  longitude, latitude, children, draggable = false,
  onClick, onMouseEnter, onMouseLeave, onDrag, onDragEnd,
}: MapMarkerProps) {
  const { map, isLoaded }   = useMap()
  const markerRef           = useRef<Marker | null>(null)
  const elRef               = useRef<HTMLDivElement>(document.createElement("div"))
  const [marker, setMarker] = useState<Marker | null>(null)
  const [ready, setReady]   = useState(false)

  useEffect(() => {
    if (!map || !isLoaded) return
    import("maplibre-gl").then(({ Marker: MLMarker }) => {
      const m = new MLMarker({ element: elRef.current, draggable })
        .setLngLat([longitude, latitude]).addTo(map)

      if (onClick)      elRef.current.addEventListener("click",      onClick as EventListener)
      if (onMouseEnter) elRef.current.addEventListener("mouseenter", onMouseEnter as EventListener)
      if (onMouseLeave) elRef.current.addEventListener("mouseleave", onMouseLeave as EventListener)
      if (onDrag)    m.on("drag",    () => onDrag(m.getLngLat()))
      if (onDragEnd) m.on("dragend", () => onDragEnd(m.getLngLat()))

      markerRef.current = m
      setMarker(m)
      setReady(true)
    })
    return () => {
      markerRef.current?.remove()
      markerRef.current = null
      setMarker(null)
      setReady(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded])

  useEffect(() => { markerRef.current?.setLngLat([longitude, latitude]) }, [longitude, latitude])

  return (
    <MarkerContext.Provider value={{ marker, setPopup: (p) => markerRef.current?.setPopup(p) }}>
      {ready ? createPortal(children, elRef.current) : null}
    </MarkerContext.Provider>
  )
}

// ── MarkerContent ──────────────────────────────────────────────────────────
export function MarkerContent({ children, className }: { children?: ReactNode; className?: string }) {
  return (
    <div className={className} style={{ cursor: "pointer" }}>
      {children ?? (
        <div style={{
          width: 12, height: 12, borderRadius: "50%",
          background: "#0066CC", border: "2px solid #fff",
          boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        }} />
      )}
    </div>
  )
}

// ── MarkerLabel ────────────────────────────────────────────────────────────
export function MarkerLabel({
  children, className, position = "top",
}: { children: ReactNode; className?: string; position?: "top" | "bottom" }) {
  return (
    <div className={className} style={{
      position: "absolute", left: "50%", transform: "translateX(-50%)",
      ...(position === "top" ? { bottom: "calc(100% + 4px)" } : { top: "calc(100% + 4px)" }),
      fontSize: 10, fontWeight: 600, whiteSpace: "nowrap",
      background: "rgba(15,29,46,0.8)", color: "#fff",
      padding: "2px 6px", borderRadius: 4, backdropFilter: "blur(4px)",
      pointerEvents: "none",
    }}>
      {children}
    </div>
  )
}

// ── MarkerTooltip ──────────────────────────────────────────────────────────
export function MarkerTooltip({ children, className }: { children: ReactNode; className?: string }) {
  const { marker }  = useContext(MarkerContext)
  const { map }     = useMap()
  const elRef       = useRef<HTMLDivElement>(document.createElement("div"))
  const popupRef    = useRef<Popup | null>(null)

  useEffect(() => {
    if (!map || !marker) return
    if (className) elRef.current.className = className

    import("maplibre-gl").then(({ Popup: MLPopup }) => {
      const p = new MLPopup({
        closeButton: false, closeOnClick: false,
        offset: [0, -10], maxWidth: "260px",
      }).setDOMContent(elRef.current)

      const el   = marker.getElement()
      const show = () => p.setLngLat(marker.getLngLat()).addTo(map)
      const hide = () => p.remove()
      el.addEventListener("mouseenter", show)
      el.addEventListener("mouseleave", hide)
      popupRef.current = p

      return () => {
        el.removeEventListener("mouseenter", show)
        el.removeEventListener("mouseleave", hide)
        p.remove()
      }
    })
    return () => { popupRef.current?.remove() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [marker, map])

  return createPortal(children, elRef.current)
}

// ── MarkerPopup ────────────────────────────────────────────────────────────
export function MarkerPopup({
  children, className, closeButton = false,
}: { children: ReactNode; className?: string; closeButton?: boolean }) {
  const { setPopup } = useContext(MarkerContext)
  const elRef        = useRef<HTMLDivElement>(document.createElement("div"))
  const done         = useRef(false)

  useEffect(() => {
    if (done.current) return
    done.current = true
    if (className) elRef.current.className = className
    import("maplibre-gl").then(({ Popup: MLPopup }) => {
      const p = new MLPopup({ closeButton, maxWidth: "300px", offset: [0, -18] })
        .setDOMContent(elRef.current)
      setPopup(p)
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return createPortal(children, elRef.current)
}
