# EXPERT 10 — IMAGE TO 3D (development branch)

Status: prototype; NOT production-ready. Existing Experts and main branch are untouched.

## Architecture
Static GitHub Pages frontend -> HTTPS FastAPI endpoint -> fal.ai TRELLIS image-to-3D -> GLB validation -> Blender headless conversion -> downloadable model. GPU inference is delegated to the provider. Backend must be hosted separately (e.g. Render Docker service); GitHub Pages cannot run it.

## Deployment prerequisites
- Python 3.11+, Blender 4.3+ installed on backend, FAL_KEY secret, FRONTEND_ORIGIN=https://hoanggiaktsda-beep.github.io.
- Start with uvicorn main:app --host 0.0.0.0 --port 8000 from backend directory.
- Open /expert10/ on branch preview and enter deployed HTTPS backend URL.
- Verify fal.ai TRELLIS endpoint availability, its response schema and billing before production. Provider endpoint may change.
- SKP is explicitly NOT implemented: requires an authorized SketchUp converter. Do not relabel other formats as SKP.
- Width scaling assumes the X axis corresponds to the real-world width; orientation must be reviewed. Single-view reconstruction estimates occluded geometry; not a measured CAD reconstruction.

## Release gates
1. Unit/API tests: bad MIME, oversize, missing provider key, SKP rejection, provider failure, empty model.
2. Integration: run a real image through fal.ai, verify GLB is valid, export FBX/OBJ/STL/BLEND in Blender and import each in target software.
3. Verify dimensions, topology, UV/texture, materials and orientation on a sofa, chair, cabinet and table.
4. Security: enforce auth/rate limiting, cost caps, provider URL allowlist, server-side cleanup, concurrency/timeouts, and CORS before production.
5. iPhone Safari and desktop browser QA; only then add Expert 10 to main navigation and merge.

The current code is a development integration skeleton, not evidence of successful real inference or tested exports.
