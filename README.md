# Authoring Platform Assignment

A responsive single page authoring workspace built with React, TypeScript, Zustand, TipTap, and Tailwind CSS. The UI follows the supplied editor screenshot: a tree/outline panel on the left, editor canvas on the right, top navigation tabs, hover menus, profile menu, and module drawer.

## Features

- Recursive tree rendering with unlimited depth.
- Add root containers, root leaf items, and child containers/items.
- Delete any node from the hierarchy.
- Click a node to edit its unique content in the right panel.
- TipTap WYSIWYG editing with bold, italic, code, quote/comment, paragraph, and heading controls.
- Widget insertion examples for Video, Assessment item, and Image.
- Static hover popups for item creation and profile actions.
- Hamburger drawer for module switching.
- Graph tab placeholder as requested.
- Tree and node content persistence in `localStorage`.
- Responsive layout: the tree stacks above the editor on small screens.

## Project Structure

```txt
src/
  components/
    Editor/
    Layout/
    Navbar/
    Tree/
  pages/
  store/
  types/
  utils/
```

## Key Decisions

- Zustand keeps tree updates centralized and easy to extend.
- Tree mutations are immutable recursive helpers in `src/utils/tree.ts`.
- Node content is stored as a generic object shape: title, HTML body, and widget metadata.
- TipTap is used instead of a hand-rolled editor to keep editor behavior reliable.
- The data is saved on every tree/content change and restored on app startup.

## Run Locally

```bash
npm install
npm run dev
```

## Checks

```bash
npm run lint
npm run build
```
