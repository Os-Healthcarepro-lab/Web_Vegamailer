# Honeypot Field Template

## Purpose
Anti-spam honeypot field for contact forms - catches automated bots

## Instructions
Add this code snippet to your contact form component

## Code

```jsx
{/* Anti-spam honeypot field - hidden from users, visible to bots */}
<input
  type="text"
  name="website"
  tabIndex="-1"
  autoComplete="off"
  style={{
    position: 'absolute',
    left: '-9999px',
    width: '1px',
    height: '1px',
    opacity: 0
  }}
  aria-hidden="true"
/>
```

## How It Works
- Bots automatically fill out all form fields
- This field is hidden from human users with CSS
- If the field has a value when submitted, it's likely a bot
- The backend honeypot middleware rejects submissions with this field filled

