import { GoogleGenAI } from "@google/genai";
import { FormData } from "../types";

const processFormData = (data: FormData): string => {
  return JSON.stringify(data, null, 2);
};

export const generatePlan = async (formData: FormData): Promise<string> => {
  try {
    // Safety check for environment variable to prevent crash if process is undefined
    const apiKey = typeof process !== 'undefined' && process.env ? process.env.API_KEY : '';
    
    if (!apiKey) {
      console.error("API Key not found in process.env");
      return "系统配置错误：未找到 API Key。请确保环境变量配置正确。";
    }

    const ai = new GoogleGenAI({ apiKey });
    
    const dataString = processFormData(formData);

    const prompt = `
      你是一位资深的企业注册顾问。用户填写了一份《公司注册预填表》。
      请根据用户的输入数据，整理并生成一份结构清晰的《公司注册最终执行方案》。

      用户数据:
      \`\`\`json
      ${dataString}
      \`\`\`

      请严格按照以下 Markdown 结构输出（不要输出 JSON，直接输出文档内容）：

      # 🚀 公司注册执行方案

      ## 1. 关键信息确认 (已整理)
      *在此处简要总结用户提交的核心架构信息（如：字号、注册资本、股东结构、经营范围方向），用列表形式呈现。*

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

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 0 }
      }
    });

    return response.text || "未能生成方案，请重试。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "系统繁忙，请稍后再试。\n\n错误详情: " + (error instanceof Error ? error.message : "Unknown error");
  }
};