# Logo Update Instructions

## Required Action
Please save the Qeixova logo image as:
- **Path**: `tazksapp/public/qeixova-logo.png`
- **Format**: PNG with transparent background
- **Recommended size**: 512x512px or larger (will be scaled down as needed)

## Logo Locations Updated
The following files have been updated to use the image logo:
1. ✅ `components/Sidebar.tsx` - Main app sidebar

## Locations Still Using Emoji (⚡)
These need manual update after logo is saved:
- `app/(marketing)/page.tsx` - Landing page (multiple instances)
- `app/(marketing)/login/page.tsx` - Login page
- `app/(marketing)/register/page.tsx` - Register page  
- `app/(marketing)/reset-password/page.tsx` - Reset password page
- `app/(marketing)/forgot-password/page.tsx` - Forgot password page
- `app/(marketing)/admin-login/page.tsx` - Admin login page
- `app/(app)/dashboard/page.tsx` - Loading state

## Next Steps
1. Save the logo image to `public/qeixova-logo.png`
2. Test that the logo displays correctly in the sidebar
3. Update remaining pages to use the image logo
