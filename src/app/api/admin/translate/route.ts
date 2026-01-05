import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { text, targetLanguage, fieldType } = await request.json()

    if (!text || !targetLanguage) {
      return NextResponse.json({ error: 'Missing text or targetLanguage' }, { status: 400 })
    }

    const sourceLang = targetLanguage === 'de' ? 'English' : 'German'
    const targetLang = targetLanguage === 'de' ? 'German' : 'English'

    // Customize prompt based on field type for better translations
    let contextPrompt = ''
    if (fieldType === 'name') {
      contextPrompt = 'This is a luxury property name. Keep proper nouns (villa names, location names) unchanged. Only translate descriptive parts if any.'
    } else if (fieldType === 'short_description') {
      contextPrompt = 'This is a short tagline/description for a luxury vacation rental property. Keep it elegant and concise.'
    } else if (fieldType === 'description') {
      contextPrompt = 'This is a full description for a luxury vacation rental property. Maintain the elegant, sophisticated tone. Preserve any specific amenity names or proper nouns.'
    } else if (fieldType === 'house_type') {
      contextPrompt = 'This is a property type (e.g., Villa, Finca, Apartment). Use the standard term in the target language.'
    }

    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: `You are a professional translator for a luxury vacation rental website. Translate the following text from ${sourceLang} to ${targetLang}. ${contextPrompt} Return ONLY the translated text, nothing else.`
        },
        {
          role: 'user',
          content: text
        }
      ],
      temperature: 0.3,
      max_tokens: 2000,
    })

    const translatedText = response.choices[0]?.message?.content?.trim()

    if (!translatedText) {
      return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
    }

    return NextResponse.json({ translatedText })
  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json({ error: 'Translation failed' }, { status: 500 })
  }
}

