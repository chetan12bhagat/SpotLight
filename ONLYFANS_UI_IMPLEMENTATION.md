# Spotlight-UI: OnlyFans-Style Frontend Implementation

## 🎯 Project Overview

This document outlines the complete implementation of a pixel-perfect OnlyFans-style UI using React + Vite + TypeScript + Tailwind CSS.

## ✅ Completed Components

### 1. Configuration Files
- ✅ `tsconfig.json` - TypeScript configuration with path aliases
- ✅ `tsconfig.node.json` - Vite TypeScript configuration
- ✅ `tailwind.config.js` - Complete OnlyFans color palette and design tokens
- ✅ `src/types/index.ts` - TypeScript interfaces for all data models
- ✅ `src/data/mockData.ts` - Comprehensive mock data (6 users, 12 posts, 3 suggestions)
- ✅ `src/components/Avatar.tsx` - Avatar component with verified badge

### 2. Design Tokens (Tailwind Config)

#### Colors
- **Primary Blue**: `#00AFF0` (matching OnlyFans blue)
- **Text Colors**: 
  - Primary: `#1A1A1A`
  - Secondary: `#666666`
  - Link: `#00AFF0`
- **Background Colors**:
  - Primary: `#FFFFFF`
  - Secondary: `#F8F9FA`
  - Hover: `#F8F9FA`
- **Border**: `#E5E5E5`

#### Spacing & Layout
- **Border Radius**:
  - Avatar: `full` (circular)
  - Cards: `md` (0.75rem)
  - Buttons: `xl` (1.5rem)
- **Shadows**:
  - Card: `0 2px 8px rgba(0, 0, 0, 0.08)`
  - Hover: `0 4px 12px rgba(0, 0, 0, 0.12)`

## 📋 Components To Implement

### Core Components

#### 1. Button Component (`src/components/Button.tsx`)
```typescript
interface ButtonProps {
  variant: 'primary' | 'secondary' | 'outline' | 'ghost';
  size: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  fullWidth?: boolean;
}
```

**Variants**:
- Primary: Blue background (#00AFF0), white text
- Secondary: Gray background
- Outline: Border only
- Ghost: No background, hover effect

#### 2. PostCard Component (`src/components/PostCard.tsx`)
```typescript
interface PostCardProps {
  post: Post;
  onLike?: () => void;
  onComment?: () => void;
  onShare?: () => void;
}
```

**Structure**:
- Header: Avatar + Name + Handle + Verified Badge + Timestamp + Menu
- Caption: Text with blue links
- Media: Image/Video with aspect ratio preservation
- Engagement: Like + Comment icons with counts
- Border: 1px solid #E5E5E5
- Border Radius: 0.75rem
- Shadow: card shadow on hover

#### 3. Composer Component (`src/components/Composer.tsx`)
```typescript
interface ComposerProps {
  onPost?: (content: string, media?: File[]) => void;
}
```

**Features**:
- Text input area
- Media upload buttons (image/video icons)
- Formatting toolbar (bold, italic, link)
- Character count
- Post button (blue, rounded-xl)

#### 4. LeftSidebar Component (`src/components/LeftSidebar.tsx`)
```typescript
interface NavItem {
  icon: React.ReactNode;
  label: string;
  path: string;
  active?: boolean;
}
```

**Navigation Items**:
- Home (house icon)
- Notifications (bell icon)
- Messages (chat icon)
- Collections (bookmark icon)
- Subscriptions (users icon)
- Add card (credit card icon)
- My profile (user icon)
- More (dots icon)
- **NEW POST button** (large, blue, rounded-xl, full width)

**Responsive**:
- Desktop: Full labels
- Tablet: Icon only
- Mobile: Bottom nav bar

#### 5. RightSidebar Component (`src/components/RightSidebar.tsx`)
```typescript
interface SuggestionCardProps {
  suggestion: Suggestion;
  onFollow?: () => void;
}
```

**Structure**:
- Search input at top
- "SUGGESTIONS" header
- Suggestion cards:
  - Background image (rounded-md)
  - Circular avatar overlay (bottom-left)
  - Name + Handle
  - "Free" badge (if applicable)
  - Follow button

#### 6. EmailVerificationBanner Component (`src/components/EmailVerificationBanner.tsx`)
```typescript
interface BannerProps {
  onVerify?: () => void;
  onDismiss?: () => void;
}
```

**Design**:
- Light pink background (#FFF5F7)
- Warning icon (red triangle)
- Text: "Please verify your email address"
- Blue "VERIFY EMAIL" button
- Dismissible

#### 7. MediaPlayer Component (`src/components/MediaPlayer.tsx`)
```typescript
interface MediaPlayerProps {
  media: Media;
  autoPlay?: boolean;
}
```

**Features**:
- Image: Lazy loading, aspect ratio preservation
- Video: Play overlay, thumbnail, controls
- Lightbox on click

### Layout Components

#### 8. ThreeColumnLayout (`src/layouts/ThreeColumnLayout.tsx`)
```typescript
interface LayoutProps {
  children: React.ReactNode;
}
```

**Structure**:
```
┌─────────────────────────────────────────────┐
│  LeftSidebar  │    Main Feed    │  RightSidebar  │
│   (240px)     │     (600px)     │    (350px)     │
└─────────────────────────────────────────────┘
```

**Responsive**:
- Desktop (>1280px): 3 columns
- Tablet (768-1280px): Left sidebar icon-only, no right sidebar
- Mobile (<768px): Bottom nav, full-width feed

### Page Components

#### 9. Home Page (`src/pages/Home.tsx`)
- ThreeColumnLayout
- Composer at top
- Email verification banner (if not verified)
- Feed of PostCards
- Infinite scroll

#### 10. CreatorProfile Page (`src/pages/CreatorProfile.tsx`)
- Cover image
- Avatar + Name + Stats
- Subscribe button
- Tabs: Posts, Media, About
- Grid of posts

#### 11. Messages Page (`src/pages/Messages.tsx`)
- Two-column layout
- Conversation list (left)
- Chat interface (right)

#### 12. Login/Signup Pages (`src/pages/Auth.tsx`)
- Centered form
- OnlyFans logo
- Email + Password inputs
- Social login buttons
- Link to switch between login/signup

## 🎨 Styling Guidelines

### Typography
- Font: Inter
- Sizes:
  - Name: 15px, font-weight: 600
  - Handle: 14px, color: #666666
  - Caption: 15px, line-height: 1.5
  - Timestamp: 13px, color: #999999

### Spacing
- Card padding: 16px
- Gap between posts: 16px
- Sidebar padding: 20px

### Interactions
- Hover: Slight shadow increase
- Active: Scale 0.98
- Transition: 200ms ease-in-out

## 📱 Responsive Breakpoints

```css
sm: 640px   /* Mobile landscape */
md: 768px   /* Tablet */
lg: 1024px  /* Desktop */
xl: 1280px  /* Large desktop */
2xl: 1536px /* Extra large */
```

## 🔧 Utility Functions

### 1. Time Formatter (`src/utils/formatTime.ts`)
```typescript
export const formatTimeAgo = (timestamp: string): string => {
  // "5 hours ago", "2 days ago", etc.
}
```

### 2. Number Formatter (`src/utils/formatNumber.ts`)
```typescript
export const formatCount = (count: number): string => {
  // 1234 → "1.2K", 1234567 → "1.2M"
}
```

### 3. Link Parser (`src/utils/parseLinks.ts`)
```typescript
export const parseLinks = (text: string): React.ReactNode => {
  // Convert URLs and @mentions to clickable links
}
```

## 📦 Package.json Updates

Add these dependencies:
```json
{
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-router-dom": "^6.21.0",
    "clsx": "^2.0.0",
    "date-fns": "^3.0.6"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "typescript": "^5.2.2",
    "vite": "^5.0.8",
    "tailwindcss": "^3.4.0",
    "autoprefixer": "^10.4.16",
    "postcss": "^8.4.32",
    "eslint": "^8.55.0",
    "prettier": "^3.1.1"
  }
}
```

## 🚀 Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## 📝 Implementation Checklist

### Phase 1: Core Components (Priority 1)
- [x] Avatar
- [ ] Button
- [ ] PostCard
- [ ] Composer
- [ ] EmailVerificationBanner

### Phase 2: Layout Components (Priority 2)
- [ ] LeftSidebar
- [ ] RightSidebar
- [ ] ThreeColumnLayout
- [ ] MediaPlayer

### Phase 3: Pages (Priority 3)
- [ ] Home
- [ ] CreatorProfile
- [ ] Messages
- [ ] Login/Signup

### Phase 4: Polish (Priority 4)
- [ ] Loading skeletons
- [ ] Error states
- [ ] Empty states
- [ ] Animations
- [ ] Dark mode
- [ ] Accessibility (ARIA labels, keyboard navigation)

## 🎯 Pixel-Perfect Matching

### From Screenshot Analysis:
1. **Left Sidebar Width**: ~240px
2. **Main Feed Width**: ~600px
3. **Right Sidebar Width**: ~350px
4. **Post Card Border**: 1px solid #E5E5E5
5. **Avatar Size**: 40px (md)
6. **NEW POST Button**: Full width, 48px height, #00AFF0 background
7. **Suggestion Card**: 
   - Background image with overlay
   - Circular avatar (48px) positioned bottom-left
   - "Free" badge: white background, 6px padding
8. **Composer**:
   - White background
   - Border: 1px solid #E5E5E5
   - Icons: Image, Video, Text formatting
   - Rounded corners: 0.75rem

## 📚 Additional Resources

### Icons
Use Lucide React or Heroicons for consistent icon set:
```bash
npm install lucide-react
```

### Image Placeholders
- Use Unsplash API for realistic images
- Use DiceBear for avatar generation
- Provide fallback images in `public/assets/`

## 🔒 Accessibility

- All buttons have aria-labels
- Images have alt text
- Keyboard navigation support
- Focus indicators
- Screen reader friendly

## 📄 License

This is a frontend UI implementation for educational purposes.

---

**Status**: Foundation Complete ✅
**Next Steps**: Implement remaining components from Phase 1-4
**Estimated Time**: 4-6 hours for complete implementation
