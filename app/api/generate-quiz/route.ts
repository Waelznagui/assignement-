import { NextRequest, NextResponse } from "next/server";

interface QuizQuestion {
  id: number;
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizPayload {
  topic: string;
  numberOfQuestions: number;
}

// Validate request payload
function validatePayload(body: unknown): QuizPayload {
  if (typeof body !== "object" || body === null) {
    throw new Error("Invalid request body");
  }

  const { topic, numberOfQuestions } = body as Record<string, unknown>;

  if (typeof topic !== "string" || !topic.trim()) {
    throw new Error("Topic must be a non-empty string");
  }

  if (typeof numberOfQuestions !== "number" || numberOfQuestions < 1 || numberOfQuestions > 10) {
    throw new Error("numberOfQuestions must be between 1 and 10");
  }

  return {
    topic: topic.trim(),
    numberOfQuestions,
  };
}

// Parse AI response and validate JSON structure
function parseQuizResponse(content: string, expectedCount: number): QuizQuestion[] {
  const jsonMatch = content.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error("No JSON found in AI response");
  }

  const parsed = JSON.parse(jsonMatch[0]);
  
  if (!Array.isArray(parsed.questions)) {
    throw new Error("Response must contain 'questions' array");
  }

  const questions: QuizQuestion[] = parsed.questions
    .slice(0, expectedCount)
    .map((q: unknown, idx: number) => {
      const question = q as Record<string, unknown>;
      
      if (typeof question.question !== "string") {
        throw new Error(`Question ${idx + 1}: missing 'question' field`);
      }
      
      if (!Array.isArray(question.options) || question.options.length < 4) {
        throw new Error(`Question ${idx + 1}: must have at least 4 options`);
      }
      
      if (typeof question.correctAnswer !== "string") {
        throw new Error(`Question ${idx + 1}: missing 'correctAnswer' field`);
      }

      const correctAnswer = String(question.correctAnswer);
      const options = question.options.map(String);

      // ✅ NEW: Verify correctAnswer is one of the options
      if (!options.includes(correctAnswer)) {
        throw new Error(
          `Question ${idx + 1}: correctAnswer "${correctAnswer}" must be one of the options`
        );
      }

      return {
        id: idx + 1,
        question: String(question.question),
        options,
        correctAnswer,
      };
    });

  if (questions.length === 0) {
    throw new Error("No valid questions generated");
  }

  return questions;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { topic, numberOfQuestions } = validatePayload(body);

    // Craft the prompt for AI
    const prompt = `You are an expert quiz generator. Generate exactly ${numberOfQuestions} multiple-choice questions about "${topic}".

IMPORTANT: You MUST respond with ONLY a valid JSON object in this exact format:
{
  "questions": [
    {
      "question": "What is...",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A"
    }
  ]
}

Requirements:
- Each question must have exactly 4 options
- The correctAnswer must be one of the options
- Include just one correctAnswer per question
- Questions should be educational and test understanding
- Vary difficulty levels


Do not include any text outside the JSON. Do not use markdown code blocks.`;

    // Call Groq API
    const groqResponse = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile", // Fast and reliable
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        temperature: 0.7,
        max_tokens: 2000,
      }),
    });

    if (!groqResponse.ok) {
      const error = await groqResponse.json();
      console.error("Groq API error:", error);
      throw new Error(`Groq API error: ${error.error?.message || "Unknown error"}`);
    }

    const data = await groqResponse.json();
    const aiContent = data.choices?.[0]?.message?.content;

    if (!aiContent) {
      throw new Error("Empty response from AI");
    }

    // Parse and validate the response
    const questions = parseQuizResponse(aiContent, numberOfQuestions);

    return NextResponse.json(
      {
        success: true,
        topic,
        questions,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Quiz generation error:", error);

    const message =
      error instanceof Error ? error.message : "Internal server error";

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 400 }
    );
  }
}