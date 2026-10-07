// Where the radar map's pictures come from. Both are image tiles the phone loads directly (no key, no server).
// * Street map: OpenStreetMap's public tiles. Free with attribution and light use, which suits testing. Before the
//   app is sold, point BASEMAP at a paid map provider (same tile scheme, one line here).
// * Radar: the National Weather Service's NEXRAD radar mosaic, as map tiles from the Iowa Environmental Mesonet
//   (Iowa State University), which keeps the latest scan plus one every 5 minutes for the last 50 minutes.
export const BASEMAP = {
  tile: (z: number, x: number, y: number) => `https://tile.openstreetmap.org/${z}/${x}/${y}.png`,
  credit: "© OpenStreetMap contributors",
};

/** Radar frames, oldest first: minutes before the latest scan. */
export const RADAR_FRAMES = [50, 45, 40, 35, 30, 25, 20, 15, 10, 5, 0] as const;

export const RADAR = {
  tile: (minutesAgo: number, z: number, x: number, y: number) =>
    `https://mesonet.agron.iastate.edu/cache/tile.py/1.0.0/nexrad-n0q-900913${minutesAgo ? `-m${String(minutesAgo).padStart(2, "0")}m` : ""}/${z}/${x}/${y}.png`,
  credit: "Radar: NWS NEXRAD via Iowa Environmental Mesonet",
  minZoom: 6,
  maxZoom: 10,
};
