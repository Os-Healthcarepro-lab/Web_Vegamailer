<!-- 
  Honeypot field for spam bot protection
  Instructions: Add this to your contact form component
-->

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
