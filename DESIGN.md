# 🎨 Design System

## Color Palette

### Background
- **Base**: Dark gradient (`from-gray-900 via-gray-800 to-gray-900`)
- Creates depth and modern feel

### Glass Cards
- **Background**: `bg-white/10` (10% white opacity)
- **Backdrop**: `backdrop-blur-lg` (frosted glass effect)
- **Border**: `border-white/20` (subtle outline)
- **Shadow**: `shadow-lg` or `shadow-2xl`

### Progress Colors
The app uses a traffic light system for readiness:

- **🔴 Red** (0-49%): `bg-red-500`, `text-red-400`
  - "Need more training"
  
- **🟡 Yellow** (50-74%): `bg-yellow-500`, `text-yellow-400`
  - "Making progress"
  
- **🔵 Blue** (75-99%): `bg-blue-500`, `text-blue-400`
  - "Almost there!"
  
- **🟢 Green** (100%+): `bg-green-500`, `text-green-400`
  - "Competition ready!"

### Interactive Elements
- **Primary Button**: `bg-blue-600 hover:bg-blue-700`
- **Danger Button**: `bg-red-500/20 hover:bg-red-500/30`
- **Secondary Button**: `bg-white/10 hover:bg-white/20`

### Text
- **Primary**: `text-white` (main headings)
- **Secondary**: `text-gray-300` (body text)
- **Muted**: `text-gray-400` (labels)
- **Accent**: `text-blue-100`, `text-green-200`, etc.

## Typography

### Headings
- **H1**: `text-3xl font-bold` or `text-4xl font-bold`
- **H2**: `text-2xl font-bold`
- **H3**: `text-xl font-bold` or `text-lg font-semibold`

### Body
- **Regular**: `text-base`
- **Small**: `text-sm`
- **Tiny**: `text-xs`

### Weights
- **Bold**: For headings and important metrics
- **Semibold**: For card titles
- **Medium**: For labels and data values
- **Regular**: Default for body text

## Layout

### Spacing
- **Container**: `max-w-7xl mx-auto px-4 sm:px-6 lg:px-8`
- **Section Padding**: `py-8`
- **Card Padding**: `p-6` or `p-8`
- **Gaps**: `gap-4` or `gap-6`

### Grid
- **Dashboard**: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- **Team**: `grid-cols-1 lg:grid-cols-2`

### Cards
- **Border Radius**: `rounded-lg` or `rounded-xl`
- **Spacing**: `space-y-4` or `space-y-6`

## Components

### Navigation
- Semi-transparent with blur
- Fixed height: `h-16`
- Active state highlight
- Mobile-responsive

### Progress Bars
```
Container: h-3 bg-gray-700 rounded-full
Fill: h-full (color based on percentage)
Animation: transition-all duration-500
```

### Countdown Timer
- Gradient: `from-blue-600 to-purple-600`
- Grid of 4 time units
- Large bold numbers
- Small labels

### Input Fields
```
Base: bg-white/10 border-white/20
Focus: ring-2 ring-blue-500
Text: text-white
Placeholder: placeholder-gray-400
```

## Responsive Breakpoints

- **Mobile First**: Default styling
- **sm**: `640px` - Small tablets
- **md**: `768px` - Tablets/landscape phones
- **lg**: `1024px` - Desktops
- **xl**: `1280px` - Large desktops

## Animation

### Transitions
- **Default**: `transition-colors duration-200`
- **Progress Bars**: `transition-all duration-500`
- Smooth hover states on all interactive elements

### Effects
- **Hover**: Slight color brightening
- **Focus**: Blue ring outline
- **Active**: Button press effect
- **Loading**: Subtle pulse or fade

## Accessibility

### Contrast
- All text meets WCAG AA standards on dark background
- Progress colors remain distinguishable

### Focus States
- Visible focus rings on all interactive elements
- Keyboard navigation supported

### Touch Targets
- All buttons and links are at least 44x44px
- Adequate spacing between clickable elements

## Visual Hierarchy

1. **Countdown Timer** - Most prominent (gradient, large)
2. **Page Title** - Clear, bold, white
3. **Exercise Cards** - Equal visual weight, organized grid
4. **Progress Bars** - Clear visual indicator of status
5. **Metadata** - Subtle, smaller text

## Inspiration

The design draws from:
- **Apple**: Clean, minimal, glassmorphism
- **Strava**: Athletic, progress-focused
- **Gaming UIs**: Colorful progress bars, stats display
- **Modern Web Apps**: Dark mode, frosted glass, gradients

The result is a beautiful, motivating interface that makes training data feel exciting and game-like! 🎮🏃‍♂️
