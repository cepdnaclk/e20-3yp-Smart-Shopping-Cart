# Layout & Item Map Editor - Technical Documentation

## Project Overview

This is a React-based visual editor application that allows users to create and manage layout designs with associated item mappings. The application features two primary editing modes: Layout Editor for creating geometric fixtures and Item Map Editor for organizing items within those fixtures.

## Architecture Overview

### Core Components Structure
```
UIManager (Root)
├── ToolbarManager (Global Navigation)
├── SidebarManager (Context-sensitive Properties/Inventory)
├── LayoutEditorManager (Canvas-based Layout Editor)
└── ItemMapEditorManager (Grid-based Item Organization)
```

### State Management Architecture
- **Context-based State**: Uses React Context API for global state management
- **Hooks Pattern**: Custom hooks for encapsulating business logic
- **Component Isolation**: Each major feature has its own context and hooks

## Component Documentation

### 1. UIManager.tsx
**Purpose**: Root component orchestrating the entire application layout and state providers.

**Key Responsibilities**:
- Manages overall application layout structure
- Provides ItemContext to all child components
- Conditionally renders components based on application state

**Dependencies**:
- `useSidebarContext`: For sidebar visibility state
- `ItemProvider`: Context provider for item management

---

### 2. ToolbarManager.tsx
**Purpose**: Global navigation bar with context-sensitive controls.

**Key Features**:
- Fixed positioning for consistent access
- Dynamic title based on current editor mode
- Sidebar toggle functionality
- Context-sensitive toolbar actions

**State Dependencies**:
- `useSidebarContext`: Sidebar state management
- Renders different toolbars based on `isItemMapEditorOpen`

---

### 3. SidebarManager.tsx
**Purpose**: Context-sensitive sidebar for properties and inventory management.

**Key Features**:
- Conditional rendering based on editor mode
- Properties panel for layout editing
- Inventory panel for item management
- Editor mode switching capability

**Component Structure**:
- Header with title and close button
- Dynamic content area (LayoutEditorSidebar | ItemMapEditorSidebar)
- Footer with editor toggle button

---

### 4. LayoutEditorManager.tsx
**Purpose**: Canvas-based editor for creating and manipulating geometric fixtures.

**Key Features**:
- Konva.js-based canvas rendering
- Responsive canvas sizing
- Coordinate system visualization (X/Y axis arrows)
- Real-time fixture rendering

**Technical Implementation**:
- Uses React Konva for 2D canvas operations
- Handles window resize events for responsive design
- Renders fixtures as interactive geometric shapes

---

### 5. ItemMapEditorManager.tsx
**Purpose**: Grid-based interface for organizing items within fixture edges.

**Key Features**:
- Full-screen overlay interface
- Edge-specific item organization
- Conditional rendering based on selected edge
- Integration with ItemContainer component

**Usage Pattern**:
- Only visible when `isItemMapEditorOpen` is true
- Requires a selected edge to display content
- Centers content in full-screen overlay

---

### 6. FixtureComp.tsx
**Purpose**: Interactive fixture representation on the canvas.

**Key Features**:
- Scalable geometric rendering (40px = 1 meter)
- Mode-dependent interactivity (Object Mode vs Edit Mode)
- Node and edge selection in Edit Mode
- Visual feedback for selection states

**Interaction Modes**:
- **Object Mode**: Basic selection and dragging
- **Edit Mode**: Node manipulation, edge selection, advanced editing

---

### 7. NodeComp.tsx
**Purpose**: Individual node component for fixture editing.

**Features**:
- Mode-dependent interactivity
- Drag-and-drop functionality in edit mode
- Visual state feedback (selected/unselected)
- Event handling delegation

---

### 8. ItemContainer.tsx
**Purpose**: Grid-based container for organizing items within fixture edges.

**Key Features**:
- Dynamic grid management (add/remove rows/columns)
- Drag-and-drop item organization
- Cell selection and highlighting
- Item removal functionality

**Grid Operations**:
- Add/Remove rows
- Add/Remove columns (requires cell selection)
- Cell-based item organization
- Visual feedback for selected cells

---

### 9. Toolbar Components

#### LayoutEditorToolbar.tsx
**Purpose**: Toolbar specific to layout editing operations.

**Features**:
- Fixture management (add/delete)
- Mode switching (Object/Edit)
- Data persistence (save/clear)
- State-dependent button availability

#### ItemMapEditorToolbar.tsx
**Purpose**: Simplified toolbar for item map editing.

**Features**:
- Data persistence operations
- Streamlined interface for item management

---

### 10. Sidebar Components

#### LayoutEditorSidebar.tsx
**Purpose**: Properties panel for fixture and node editing.

**Features**:
- Fixture property editing (name, position, color)
- Node-specific position editing
- Advanced operations (add node to edge, delete node)
- Context-sensitive input fields

#### ItemMapEditorSidebar.tsx
**Purpose**: Inventory panel for dragging items into the layout.

**Features**:
- Pre-defined item inventory with images
- Drag-and-drop item creation
- Grid-based item display
- Visual item previews

## Data Flow Architecture

### State Management Flow
1. **Context Providers** supply global state
2. **Custom Hooks** encapsulate business logic
3. **Components** consume state through hooks
4. **User Actions** trigger state updates through hook methods

### Drag-and-Drop Flow
1. **Sidebar Items** → **Canvas/Grid** (Item creation)
2. **Grid Items** → **Grid Cells** (Item organization)
3. **Canvas Fixtures** → **Canvas** (Fixture positioning)
4. **Canvas Nodes** → **Canvas** (Shape editing)

## Technical Specifications

### Dependencies
- **React**: ^18.x (with Hooks)
- **Konva.js**: Canvas rendering library
- **Lucide React**: Icon library
- **UUID**: Unique identifier generation

### Styling Approach
- Inline styles for component-specific styling
- Consistent color scheme and spacing
- Responsive design patterns
- Hover effects and transitions

### Performance Considerations
- `React.memo` for expensive re-renders (FixtureComp, NodeComp)
- Efficient re-render patterns
- Minimal prop drilling through context usage

## File Structure & Naming Conventions

### Directory Organization
```
components/
├── layout_editor/
│   ├── LayoutEditorManager.tsx
│   └── canvas/
├── item_map_editor/
│   ├── ItemMapEditorManager.tsx
│   └── ItemContainer.tsx
├── sidebar/
│   ├── SidebarManager.tsx
│   ├── LayoutEditorSidebar.tsx
│   └── ItemMapEditorSidebar.tsx
└── toolbar/
    ├── ToolbarManager.tsx
    ├── LayoutEditorToolbar.tsx
    └── ItemMapEditorToolbar.tsx
```

### Naming Conventions
- **Components**: PascalCase with descriptive suffixes (Manager, Comp, Container)
- **Files**: Match component names exactly
- **Props**: camelCase with descriptive names
- **State Variables**: camelCase following React conventions

## Integration Points

### Context Dependencies
- **ItemContext**: Item management across the application
- **SidebarContext**: Sidebar state and editor mode switching
- **FixtureContext**: Fixture management and selection
- **EdgeContext**: Edge selection and manipulation
- **NodeContext**: Node selection and editing

### External Integrations
- **SaveLocal utility**: Data persistence functionality
- **Asset management**: Static image imports for inventory items

## Usage Guidelines

### Development Workflow
1. **Layout Creation**: Use Layout Editor to create fixtures
2. **Shape Editing**: Switch to Edit Mode for detailed shape manipulation
3. **Item Organization**: Use Item Map Editor to organize items within fixture edges
4. **Data Persistence**: Use Save/Clear functions for data management

### Best Practices
- Always save work before switching between editors
- Select appropriate edges before opening Item Map Editor
- Use Edit Mode for precise shape adjustments
- Organize items logically within grid cells

## Maintenance & Extension

### Adding New Features
1. Create appropriate context/hooks if new state is needed
2. Follow existing component structure patterns
3. Maintain consistent styling and interaction patterns
4. Update documentation for new features

### Performance Optimization
- Monitor re-render patterns with React DevTools
- Consider memoization for expensive operations
- Optimize drag-and-drop operations if performance issues arise

### Testing Considerations
- Unit tests for individual components
- Integration tests for context interactions
- E2E tests for complete user workflows