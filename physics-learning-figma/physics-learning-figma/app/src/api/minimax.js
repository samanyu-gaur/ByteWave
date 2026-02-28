/**
 * MiniMax chat completion API (M2-her).
 * @see https://platform.minimax.io/docs/guides/text-chat
 */

const MINIMAX_BASE = 'https://api.minimax.io/v1'
const CHAT_ENDPOINT = `${MINIMAX_BASE}/text/chatcompletion_v2`

export async function sendChatMessage({ apiKey, messages, model = 'M2-her', maxTokens = 1024 }) {
  const res = await fetch(CHAT_ENDPOINT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: messages.map((m) => ({
        role: m.role,
        content: m.content,
        ...(m.name && { name: m.name }),
      })),
      temperature: 0.8,
      top_p: 0.95,
      max_completion_tokens: maxTokens,
    }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: { message: res.statusText } }))
    throw new Error(err.error?.message || err.message || `API error ${res.status}`)
  }

  const data = await res.json()
  const content = data.choices?.[0]?.message?.content
  if (content == null) throw new Error('No reply in response')
  return content
}
