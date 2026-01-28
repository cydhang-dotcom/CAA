import { FormData } from "../types";

const processFormData = (data: FormData): string => {
  return JSON.stringify(data, null, 2);
};

// Hardcoded fallback key to ensure functionality if environment vars fail
const FALLBACK_KEY = "sk-073zG8jhonhx4LlOmvim5I8nkZPasQ8VdGOVme8rBAyITT3B";

const CALL_KIMI = async (apiKey: string, systemPrompt: string, userPrompt: string) => {
  console.log("Sending request to Moonshot AI with key ending in...", apiKey.slice(-4));
  return fetch("https://api.moonshot.cn/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: "kimi-k2-turbo-preview",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt }
      ],
      temperature: 0.3,
      stream: false
    })
  });
};

export const generatePlan = async (formData: FormData): Promise<string> => {
  try {
    const dataString = processFormData(formData);

    // Prompt optimized for mobile readability:
    // 1. Enforces Lists instead of Tables (tables break on mobile).
    // 2. Structures Section 2 into specific numbered items.
    const systemPrompt = `
      你是一位资深的企业注册顾问。用户填写了一份《公司注册预填表》。
      请根据用户的输入数据，整理并生成一份结构清晰的《公司注册最终执行方案》。

      请严格按照以下 Markdown 结构输出（不要输出 JSON，直接输出文档内容）：

      # 🚀 公司注册执行方案

      ## 1. 关键信息确认 (已整理)
      *在此处简要总结用户提交的核心架构信息（如：注册资本、股东结构、经营范围方向），用列表形式呈现。*

      ## 2. 最终注册方案建议
      *请务必按照以下 5 个维度逐条给出具体建议（使用数字列表 1. 2. 3. ...）：*
      1. **纳税人类型**：根据业务量建议小规模或一般纳税人。
      2. **注册资本**：建议金额及实缴/认缴方式。
      3. **经营范围措辞**：基于 (${formData.businessDescription}) 的具体措辞建议。
      4. **股权结构**：针对股东人数 (${formData.shareholderCount}) 的风险提示。
      5. **地址与办公**：根据用户选择 (${formData.needAddressRecommend === 'yes' ? '需要推荐' : '自有地址'}) 给出建议。

      ## 3. ⚠️ 风险与合规提示
      *针对用户选择的敏感要素、人员限制或代持情况，给出具体的合规预警。*
      *特别注意：如果用户是一人有限公司，请单独列出风险提示。*
      *注意：请使用列表格式（- ），严禁使用表格。*

      ## 4. ✅ 待办事项清单 (To-Do List)
      *分阶段列出用户需要立即准备的材料。请用 checkbox 格式：*
      - [ ] (材料1...)
      - [ ] (材料2...)

      ## 5. 📅 后续办理计划 (时间轴)
      *根据预计启动时间 (${formData.expectedDate})，倒推各个环节的时间节点。*
      *⚠️ 绝对禁止使用 Markdown 表格，必须使用列表格式，否则移动端会显示错乱。*
      
      请严格参考此格式输出：
      - **YYYY-MM-DD (Day 0) 启动日**: 事项内容...
      - **YYYY-MM-DD (Day 1) 核名**: 事项内容...
      - **YYYY-MM-DD (Day 3) 提交资料**: 事项内容...
      ...

      ---
      要求：排版美观，语气专业且令人放心，重点内容加粗。请确保段落之间有空行。
    `;

    const userPrompt = `
      用户完整数据:
      \`\`\`json
      ${dataString}
      \`\`\`
    `;

    // 1. Get initial key candidate
    let apiKey = (process.env.API_KEY || "").trim();
    
    // Basic validation
    if (!apiKey || apiKey.startsWith("$") || apiKey.includes("MOONSHOT_API_KEY") || apiKey.length < 20) {
      console.warn("Invalid or placeholder API Key detected. Using fallback.");
      apiKey = FALLBACK_KEY;
    }

    // 2. First Attempt
    let response = await CALL_KIMI(apiKey, systemPrompt, userPrompt);

    // 3. Handle 401 Unauthorized by retrying with Fallback Key (if we didn't use it already)
    if (response.status === 401 && apiKey !== FALLBACK_KEY) {
      console.warn("Encountered 401 with primary key. Retrying with Fallback Key...");
      response = await CALL_KIMI(FALLBACK_KEY, systemPrompt, userPrompt);
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      const errorMessage = errorData.error?.message || response.statusText;
      console.error("Kimi API Error Response:", errorData);
      throw new Error(`Kimi API 请求失败 (${response.status}): ${errorMessage}`);
    }

    const data = await response.json();
    return data.choices?.[0]?.message?.content || "未能生成方案，请重试。";

  } catch (error) {
    console.error("AI API Error:", error);
    return `系统繁忙，方案生成失败。\n\n错误信息: ${error instanceof Error ? error.message : "未知错误"}`;
  }
};