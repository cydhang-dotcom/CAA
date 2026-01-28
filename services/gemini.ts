import { FormData } from "../types";

// Kimi (Moonshot AI) Configuration
const KIMI_API_KEY = 'sk-6C0lTM7SedknZM7JVQRVdsGTbJxcyWzZG3bz1eGVhxfXjex7';
const KIMI_API_URL = 'https://api.moonshot.cn/v1/chat/completions';

const processFormData = (data: FormData): string => {
  return JSON.stringify(data, null, 2);
};

export const generatePlan = async (formData: FormData): Promise<string> => {
  try {
    const dataString = processFormData(formData);

    const systemPrompt = `
      你是一位资深的企业注册顾问。用户填写了一份《公司注册预填表》。
      请根据用户的输入数据，整理并生成一份结构清晰的《公司注册最终执行方案》。

      请严格按照以下 Markdown 结构输出（不要输出 JSON，直接输出文档内容）：

      # 🚀 公司注册执行方案

      ## 1. 关键信息确认 (已整理)
      *在此处简要总结用户提交的核心架构信息（如：注册资本、股东结构、经营范围方向），用列表形式呈现。*

      ## 2. 最终注册方案建议
      *根据用户的业务类型（${formData.businessDescription}）和税务需求，给出具体的注册建议（如：纳税人类型选择建议、经营范围措辞建议、股权结构风险规避）。*

      ## 3. ⚠️ 风险与合规提示
      *针对用户选择的敏感要素、人员限制或代持情况，给出具体的合规预警。*

      ## 4. ✅ 待办事项清单 (To-Do List)
      *分阶段列出用户需要立即准备的材料。请用 checkbox 格式：*
      - [ ] (材料1...)
      - [ ] (材料2...)

      ## 5. 📅 后续办理计划 (时间轴)
      *根据预计启动时间 (${formData.expectedDate})，倒推各个环节的时间节点（核名 -> 网申 -> 执照 -> 刻章 -> 税务 -> 银行）。*

      ---
      要求：排版美观，语气专业且令人放心，重点内容加粗。
    `;

    const userPrompt = `
      用户完整数据:
      \`\`\`json
      ${dataString}
      \`\`\`
    `;

    const response = await fetch(KIMI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${KIMI_API_KEY}`
      },
      body: JSON.stringify({
        model: "moonshot-v1-8k",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt }
        ],
        temperature: 0.3 // Lower temperature for more consistent/professional results
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error?.message || `Kimi API Request Failed: ${response.status}`);
    }

    const result = await response.json();
    return result.choices?.[0]?.message?.content || "未能生成方案，请重试。";

  } catch (error) {
    console.error("Kimi API Error:", error);
    return "系统繁忙，请稍后再试。\n\n错误详情: " + (error instanceof Error ? error.message : "Unknown error");
  }
};
