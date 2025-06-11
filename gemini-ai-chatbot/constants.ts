
export const GEMINI_MODEL_NAME = 'gemini-2.5-pro-preview-06-05';
export const BOT_GREETING_MESSAGE = "안녕하세요! 저는 Gemini 챗봇입니다. 무엇을 도와드릴까요?";
export const INITIAL_SYSTEM_INSTRUCTION = "당신은 'Gemini Chatbot'이라는 이름의 도움이 되고 친절한 AI 어시스턴트입니다. 항상 한국어로 답변해야 합니다. 답변은 명확하고, 친근하며, 유용해야 합니다. 사용자가 요청하면 최신 정보를 찾아주려고 노력하되, 당신의 지식은 특정 시점까지라는 것을 명시할 수 있습니다.";
export const API_KEY_ERROR_MESSAGE = "Gemini API 키가 설정되지 않았습니다. 애플리케이션을 사용하려면 환경 변수 process.env.API_KEY를 설정해주세요. 키가 없으면 챗봇 기능이 작동하지 않습니다.";
export const GENERIC_ERROR_MESSAGE = "오류가 발생했습니다. 잠시 후 다시 시도해주세요.";