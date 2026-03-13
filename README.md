# Tip Jar Playground

Interactive 3D tip jar built with React Three Fiber and Rapier physics. Drop coins, tweak physics, customize visuals — all in the browser.

**[Live demo](https://baseddesigner.github.io/tip-jar-playground/)**

## Features

- Physics-simulated coins with Rapier 3D
- Glass jar with animated lid, fog particles, and avatar sticker
- Adjustable physics (gravity, bounce, friction, damping)
- Visual controls (coin size, metalness, jar opacity, fog)
- Zero-G mode
- Camera controls with JSON import/export
- Sticker upload

## Tech

- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) + [Rapier](https://rapier.rs/)
- [drei](https://github.com/pmndrs/drei) (camera, textures)
- Vite + TypeScript + Tailwind CSS v4

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

Deploys to GitHub Pages automatically on push to `main`.

---

Built by [@baseddesigner](https://github.com/baseddesigner) · Powering [pawr.link](https://pawr.link)
