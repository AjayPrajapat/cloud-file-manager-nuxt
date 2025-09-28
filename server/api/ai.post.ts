import OpenAI from 'openai'

interface AiRequestBody {
  action: 'summarize' | 'tag' | 'ocr'
  content?: string
  fileUrl?: string
}

async function summarize(client: OpenAI, content: string) {
  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Summarize the following document in 3 bullet points:\n${content}`
  })
  const output = completion.output_text ?? ''
  return output.trim()
}

async function generateTags(client: OpenAI, content: string) {
  const completion = await client.responses.create({
    model: 'gpt-4.1-mini',
    input: `Return 5 concise tags for the following document. Separate them with commas.\n${content}`
  })
  const output = completion.output_text ?? ''
  return output
    .split(',')
    .map(tag => tag.trim())
    .filter(Boolean)
}

export default defineEventHandler(async (event) => {
  const config = useRuntimeConfig()
  if (!config.openaiApiKey) {
    throw createError({ statusCode: 500, statusMessage: 'OpenAI API key not configured' })
  }
  const body = await readBody<AiRequestBody>(event)
  if (!body.action) {
    throw createError({ statusCode: 400, statusMessage: 'Missing AI action' })
  }
  const client = new OpenAI({ apiKey: config.openaiApiKey })

  if (body.action === 'summarize') {
    if (!body.content) {
      throw createError({ statusCode: 400, statusMessage: 'Content required to summarize' })
    }
    const summary = await summarize(client, body.content)
    return { summary }
  }

  if (body.action === 'tag') {
    if (!body.content) {
      throw createError({ statusCode: 400, statusMessage: 'Content required to generate tags' })
    }
    const tags = await generateTags(client, body.content)
    return { tags }
  }

  if (body.action === 'ocr') {
    if (!body.fileUrl) {
      throw createError({ statusCode: 400, statusMessage: 'fileUrl required for OCR' })
    }
    const vision = await client.responses.create({
      model: 'gpt-4.1-mini',
      input: [
        {
          role: 'user',
          content: [
            { type: 'input_text', text: 'Extract all text from this image.' },
            { type: 'input_image', image_url: body.fileUrl }
          ]
        }
      ]
    })
    const text = vision.output_text ?? ''
    return { text: text.trim() }
  }

  throw createError({ statusCode: 400, statusMessage: 'Unsupported AI action' })
})
