export async function callAI(prompt: string, systemInstruction = "", apiKey: string, model: string): Promise<string> {
  if (!apiKey) {
    return "请先点击【API 设置】配置 Key，才能使用 AI 医生哦~"
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { thinkingConfig: { thinkingLevel: "low" } },
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error("AI Error:", data.error)
      return `API 错误: ${data.error.message || "未知错误"}`
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我现在有点忙，请稍后再试。"
  } catch (e) {
    return "连接 AI 失败，请检查网络或 Key 是否有效。"
  }
}

export async function callAIWithParts(
  parts: any[],
  systemInstruction = "",
  apiKey: string,
  model: string,
): Promise<string> {
  if (!apiKey) {
    return "请先配置 API Key 才能看懂照片哦~"
  }

  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ parts }],
        generationConfig: { thinkingConfig: { thinkingLevel: "low" } },
        systemInstruction: systemInstruction ? { parts: [{ text: systemInstruction }] } : undefined,
      }),
    })

    const data = await response.json()

    if (data.error) {
      console.error("AI Error:", data.error)
      return `API 错误: ${data.error.message || "未知错误"}`
    }

    return data.candidates?.[0]?.content?.parts?.[0]?.text || "抱歉，我现在有点忙，请稍后再试。"
  } catch (e) {
    return "连接 AI 失败，请检查网络或 Key 是否有效。"
  }
}
