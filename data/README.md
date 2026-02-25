# Static data for in-browser DB seed

This directory holds static JSON files used to **seed the in-browser database** (e.g. PGlite) on first load. The app runs without a backend; data is loaded from here and then read/written in-browser.

## Layout

- **`instance_types.json`** – Full instance types per IaaS (vsphere, aws, azure, gcp). Cost keys normalized to `On-Demand`, `1-Year Term`, `3-Year Term`; vSphere uses `cost: null`. Regenerate from PCF-Sizer with `npm run data:instance-types`.
- **`instance_types.sample.json`** – Small sample (Task 2.5); kept for reference.
- **`tiles/ert/`** – ERT tile JSON files: **`ert_2.11+.json`** (Tanzu Application Service 2.11+), **`ert_6.0.json`** (TAS 6.0), **`ert_10.2.json`** (Tanzu Platform for Cloud Foundry), **`ert_10.3.json`** (Elastic Application Runtime). Load via `useStaticData().loadTileErt('ert_2.11+')` or fetch `/data/tiles/ert/<name>.json`.
- **`tiles/services/`** – Optional service tile JSON (e.g. **`mysql_2.0.json`**). Same shape as ERT (name, version, supportedIaaS, sizes, jobs). Tiles here are seeded after ERT so they appear in the Optional services section (non-ERT product names like MySQL).

## How seeding works

1. On app init the default layout runs **seedInstanceTypes(db)** then **seedTiles(db)** (see `lib/seed-instance-types.ts` and `lib/seed-tiles.ts`). Instance types: creates `instance_types` if missing, loads `/data/instance_types.json` when empty, inserts rows. Tiles: creates `tiles` if missing, loads each ERT tile from `/data/tiles/ert/<name>.json`, then each optional service tile from `/data/tiles/services/<name>.json` (see `OPTIONAL_SERVICE_TILE_NAMES` in `lib/seed-tiles.ts`), with idempotent conflict handling.
2. After seed, all reads use the in-browser DB; this directory is only used for the initial seed.

Use **`useStaticData()`** for the base path and to load JSON (e.g. `loadTileErt('ert_2.11+')`). For full documentation:
- Instance types: **`docs/instance-types.md`**
- Tiles: **`docs/tiles.md`**
