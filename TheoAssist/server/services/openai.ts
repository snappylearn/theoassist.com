import OpenAI from "openai";


// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.OPENAI_API_KEY_ENV_VAR || "default_key" 
});

export interface ChatResponse {
  content: string;
  sources?: Array<{
    documentId: number;
    documentName: string;
    excerpt: string;
  }>;
}

export async function generateIndependentResponse(
  message: string, 
  conversationHistory: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> {
  try {
    const systemPrompt = `You are TheoAssist AI, a helpful biblical and theological assistant specializing in Christian faith, scripture study, and spiritual growth. When users request interactive content (biblical quizzes, scripture flashcards, theological calculators, spiritual games, faith tools, prayer forms, or any interactive biblical elements), generate HTML/CSS/JavaScript snippets using TailwindCSS.

ARTIFACT GENERATION RULES:
1. Only create artifacts for interactive content requests (quizzes, tools, games, calculators, forms, etc.)
2. Do NOT create artifacts for simple questions, greetings, or text-only responses
3. Wrap all artifact code in special tags: [ARTIFACT_START] and [ARTIFACT_END]
4. Use TailwindCSS for styling (CDN will be available)
5. Make artifacts fully functional and standalone
6. Include a title comment at the top of each artifact

ARTIFACT FORMAT:
[ARTIFACT_START]
<!-- Artifact Title: [Brief Description] -->
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Your Artifact Title</title>
    <script src="https://cdn.tailwindcss.com"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css" />
</head>
<body class="p-4 bg-gray-50">
    <!-- Your interactive content here -->
</body>
</html>
[ARTIFACT_END]

EXAMPLES:
- User: "Hello" → No artifact needed, respond normally
- User: "Create a physics quiz" → Generate quiz artifact
- User: "Make a calculator" → Generate calculator artifact
- User: "What is gravity?" → No artifact needed, respond normally

Provide clear, accurate, and helpful responses to theological and biblical questions. Be conversational but respectful of faith. Ground your responses in biblical truth and Christian doctrine when appropriate.`;

    // Build conversation messages with history
    const conversationMessages = [
      {
        role: "system" as const,
        content: systemPrompt,
      },
      ...conversationHistory,
      {
        role: "user" as const,
        content: message,
      },
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: conversationMessages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      content: response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.",
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response. Please check your OpenAI API key and try again.");
  }
}

export async function generateProjectResponse(
  message: string,
  projectAttachments: Array<{ name: string; content: string }>,
  projectInstructions?: string,
  previousMessages: Array<{ role: 'user' | 'assistant'; content: string }> = []
): Promise<ChatResponse> {
  try {
    // Create system message with project context
    let systemMessage = `You are TheoAssist AI, a helpful biblical and theological assistant specializing in Christian faith, scripture study, and spiritual growth.`;
    
    if (projectInstructions) {
      systemMessage += `\n\nProject Instructions: ${projectInstructions}`;
    }
    
    if (projectAttachments.length > 0) {
      systemMessage += `\n\nYou have access to the following project attachments:\n`;
      projectAttachments.forEach((attachment, index) => {
        systemMessage += `\nDocument ${index + 1}: ${attachment.name}\n${attachment.content.substring(0, 2000)}${attachment.content.length > 2000 ? '...' : ''}\n`;
      });
      
      systemMessage += `\nWhen providing responses, you may reference these documents and provide relevant excerpts when applicable.`;
    }

    // Build message history
    const messages = [
      { role: "system" as const, content: systemMessage },
      ...previousMessages,
      { role: "user" as const, content: message }
    ];

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages,
      temperature: 0.7,
      max_tokens: 2000,
    });

    return {
      content: response.choices[0].message.content || "I apologize, but I couldn't generate a response. Please try again.",
      sources: projectAttachments.map((doc, index) => ({
        documentId: index,
        documentName: doc.name,
        excerpt: doc.content.substring(0, 200) + (doc.content.length > 200 ? '...' : '')
      }))
    };
  } catch (error) {
    console.error("OpenAI API error:", error);
    throw new Error("Failed to generate AI response. Please check your OpenAI API key and try again.");
  }
}



export async function generateConversationTitle(firstMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: "Generate a concise, descriptive title (max 6 words) for a conversation that starts with the following message. The title should capture the main topic or intent.",
        },
        {
          role: "user",
          content: firstMessage,
        },
      ],
      temperature: 0.5,
      max_tokens: 20,
    });

    return response.choices[0].message.content?.trim() || "New Conversation";
  } catch (error) {
    console.error("Failed to generate conversation title:", error);
    return "New Conversation";
  }
}
