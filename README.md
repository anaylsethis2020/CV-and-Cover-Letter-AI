# CV and Cover Letter AI Generator

An AI-powered web application for creating professional CVs and cover letters with responsive design and full accessibility support.

## Features

- **AI-Powered Generation**: Advanced algorithms create personalized professional documents
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Accessibility First**: WCAG 2.1 AA compliant with full keyboard navigation and screen reader support
- **Professional Templates**: Clean, modern design optimized for different industries
- **User-Friendly Interface**: Intuitive forms with validation and helpful guidance

## Accessibility & Responsive Design

This application implements comprehensive accessibility and responsive design features:

### Responsive Design
- Mobile-first approach with Bootstrap 5 grid system
- Custom CSS media queries for optimal viewing on all devices
- Responsive navigation with collapsible mobile menu
- Touch-friendly interface with adequate touch targets
- Flexible layouts that adapt to different screen sizes

### Accessibility Features
- Semantic HTML5 structure with proper landmark roles
- ARIA labels and attributes for screen reader compatibility
- Keyboard navigation support throughout the application
- Skip-to-content links for improved navigation
- High contrast mode and reduced motion support
- Form validation with accessible error messages
- Progressive enhancement for better compatibility

### Testing
- Verified on desktop (1200px+), tablet (768px), and mobile (375px) viewports
- Keyboard navigation tested for full functionality
- Screen reader compatibility validated
- Color contrast ratios meet WCAG standards

## Getting Started

1. Clone the repository
2. Open `index.html` in a web browser
3. Or serve using a local HTTP server:
   ```bash
   python3 -m http.server 8000
   ```
4. Navigate to `http://localhost:8000`

## File Structure

- `index.html` - Main application file with semantic HTML structure
- `styles.css` - Responsive CSS with accessibility features
- `script.js` - JavaScript functionality with accessibility enhancements
- `accessibility-report.html` - Detailed accessibility compliance report

## Browser Support

- Modern browsers with CSS Grid and Flexbox support
- Progressive enhancement ensures basic functionality on older browsers
- Mobile browsers with touch support optimized

## Compliance

- WCAG 2.1 AA accessibility standards
- Semantic HTML5 markup
- Modern CSS3 with fallbacks
- Cross-browser compatibility