<div align="center">
  <img src="src/assets/logo.png" alt="DarkAlgo Logo" width="120" />
  <h1>Dark Algo System v1.0</h1>
  <p><strong>A Premium Data Structure & Algorithm Visualization Engine</strong></p>
</div>

---

## 🚀 Overview

**DarkAlgo** is a state-of-the-art Web Application designed to visualize complex computer science data structures and algorithms in real-time. Moving away from the typical academic, dry visualizers, DarkAlgo is built with an ultra-premium "2030 SaaS" aesthetic. It utilizes deep glassmorphism, mathematical custom SVG tracking, deterministic state generators, and neon typography to create an immersive learning and debugging environment.

### 🌐 Live Modes Available
- **1D Arrays**: Searching, Sorting, and standard Pointer Operations.
- **2D Matrices**: Row-major Grid Traversals.
- **Stacks**: Standard FILO Stacks and Dual-ended Double Stacks with collision detection.
- **Queues**: Linear Queues and Circular Queues with wrap-around tracking.
- **Linked Lists**: Singly (SLL), Doubly (DLL), and Circular Linked Lists (CLL).
- **Binary Search Trees (BST)**: Insertion and depth-first traversals (Pre, In, Post-order).
- **Graphs**: Adjacency lists visualized with dynamic Breadth-First and Depth-First pathfinding sequences.

---

## 🛠️ Technical Architecture

DarkAlgo v2.0 was completely re-architected from vanilla HTML/JS into a robust React application. 

### Core Pillars
1. **Separation of Concerns (Zustand Stores)**
   - `structureState`: Holds the raw, pure mathematical representation of the data (e.g., node maps, matrices, head/tail pointers).
   - `executionState`: Holds the animation frames, playback speed, and UI step sequences. 
   
2. **Deterministic Frame Generation**
   - The algorithms (`src/utils/*Algorithms.js`) do **not** mutate the UI directly. Instead, they act as pure functions that take a starting `structureState` and return an array of `Frame` objects.
   - Each `Frame` contains semantic metadata: `action` (compare, swap, insert, error), `activeIndices`, `variables` (live memory), and `stats` (complexity).

3. **React-Driven Animation Canvas**
   - The `VisualizationCanvas` binds strictly to the `currentFrame`. It uses stable React Keys and pure CSS Transforms to achieve 60fps animations without expensive DOM reflows.
   - Nodes and Pointers use semantic coordinate mapping rather than relative flexboxes where absolute positioning is required (Graphs/Trees).

---

## 💻 Tech Stack
- **Framework**: React 18 + Vite (Fast HMR)
- **Styling**: TailwindCSS 3.4 (Custom glass physics, heavy drop-shadows, dynamic `mix-blend` ambient grids)
- **State Management**: Zustand
- **Icons / Graphics**: Custom SVGs & inline responsive paths.

---

## 🔮 Future Roadmap & Improvements

DarkAlgo is highly extensible by design. Here are potential future updates that can be built on top of robust frame-generator architecture:

### 1. Advanced Tree & Graph Algorithms
- **Self-Balancing Trees**: Implement AVL or Red-Black Tree rotations.
- **Pathfinding Metrics**: Dijkstra's Shortest Path or A* Search on weighted graphs, rendering edge weights directly on the SVG interconnects.
- **Minimum Spanning Trees**: Kruskal's or Prim's algorithm visualization.

### 2. Execution Features
- **Reverse Stepping**: Because the execution system relies on an immutable sequence of pre-calculated `frames`, stepping backward is theoretically as simple as `setStep(prev => prev - 1)`. 
- **Code Execution Sync**: Introduce a side-panel that highlights actual Javascript/Python code lines synchronized to the current active `Frame` semantics.

### 3. Analytics & Exporting
- **Algorithm Export**: Allow users to export the generated frame sequence data directly into JSON for external educational tooling.
- **Custom Data Import**: Allow users to upload a massive `.csv` array or `.json` adjacency graph directly to the canvas instead of manual point-by-point insertion. 

---