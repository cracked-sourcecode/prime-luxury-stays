# Translation Guide for Prime Luxury Stays

This guide explains how to add and maintain bilingual content (English/German) for the website.

## Quick Start

### Adding a New Translatable Text

1. **Add the key to both translation files:**

```json
// src/i18n/messages/en.json
{
  "mySection": {
    "title": "Welcome to our site",
    "description": "This is the English version"
  }
}
```

```json
// src/i18n/messages/de.json
{
  "mySection": {
    "title": "Willkommen auf unserer Seite",
    "description": "Dies ist die deutsche Version"
  }
}
```

2. **Use it in your component:**

```tsx
'use client'
import { useLocale } from '@/i18n/LocaleProvider'

export default function MyComponent() {
  const { t } = useLocale()
  
  return (
    <div>
      <h1>{t('mySection.title')}</h1>
      <p>{t('mySection.description')}</p>
    </div>
  )
}
```

## How It Works

### Automatic Domain Detection
- **primeluxurystays.com** → English
- **primeluxurystays.de** → German

### Manual Language Switching
Users can switch language using the 🌐 button in the navigation header.

## Translation Files

Located in `src/i18n/messages/`:
- `en.json` - English translations
- `de.json` - German translations

### Structure

```
{
  "nav": { ... },       // Navigation labels
  "hero": { ... },      // Hero section
  "destinations": { ... }, // Destination pages
  "experience": { ... },   // Experience section
  "services": { ... },     // Services section
  "about": { ... },        // About section
  "contact": { ... },      // Contact forms & info
  "footer": { ... },       // Footer content
  "common": { ... }        // Shared/reusable text
}
```

## Best Practices

### 1. Always Add Both Languages
When adding new text, **always** add to both `en.json` and `de.json`.

### 2. Use Descriptive Keys
```json
// ✅ Good
"services.yachtCharter.title": "Yacht Charter"

// ❌ Bad  
"s1.t": "Yacht Charter"
```

### 3. Group Related Content
```json
{
  "propertyCard": {
    "bedrooms": "Bedrooms",
    "bathrooms": "Bathrooms",
    "guests": "Guests",
    "perWeek": "/week",
    "viewDetails": "View Details"
  }
}
```

### 4. Dynamic Values
For text with variables, use placeholders:

```json
{
  "footer": {
    "copyright": "© {year} Prime Luxury Stays. All rights reserved."
  }
}
```

Then in code:
```tsx
const { t } = useLocale()
const text = t('footer.copyright').replace('{year}', currentYear.toString())
```

## Adding New Components

### Client Components
```tsx
'use client'
import { useLocale } from '@/i18n/LocaleProvider'

export default function NewComponent() {
  const { t, locale } = useLocale()
  
  // locale = 'en' or 'de'
  // t('key') returns the translated string
  
  return <h1>{t('section.title')}</h1>
}
```

### Server Components
For server components, pass translations as props from a client wrapper, or use a client component for the text.

## Testing

1. **Test English**: Visit `primeluxurystays.com` or localhost
2. **Test German**: Click the 🌐 language switcher and select Deutsch
3. **Verify**: Check that all new text appears correctly in both languages

## Checklist for New Features

- [ ] Added English text to `en.json`
- [ ] Added German text to `de.json`
- [ ] Used `t('key')` in component instead of hardcoded text
- [ ] Tested in both English and German modes
- [ ] Verified no broken layouts due to longer German text

## Getting German Translations

If you need professional German translations:
1. Write the English version first
2. Use DeepL or Google Translate for initial draft
3. Have a native German speaker review for accuracy
4. Especially check:
   - Formal "Sie" vs informal "du" (we use formal)
   - Industry-specific terms
   - Cultural appropriateness

## Need Help?

The translation system uses the `useLocale` hook from `@/i18n/LocaleProvider`.

Key exports:
- `t(key)` - Get translated string
- `locale` - Current locale ('en' or 'de')
- `setLocale(locale)` - Change locale manually

