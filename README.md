# AI-Powered Quiz Generator

A fullstack Next.js application that generates interactive multiple-choice quizzes on any topic using the Groq AI API.

## Quick Start

### Installation

1. Clone the repository and install dependencies:
```bash
npm install
```

2. Set up shadcn/ui components:
```bash
npx shadcn@latest init
npx shadcn@latest add button input card alert progress radio-group
```

### Environment Variables

Create a `.env.local` file in the root directory and add your Groq API key:

```
GROQ_API_KEY=your_api_key_here
```

**How to get your API key**:
1. Visit https://console.groq.com
2. Sign up (free account)
3. Generate an API key
4. Paste it in `.env.local`

⚠️ **Important**: Never commit `.env.local` to version control. It's already in `.gitignore`.

### Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## How It Works

**User Flow**: Enter topic → Choose question count (1-10) → Take quiz → View results

**Tech Stack**: Next.js 14, React 18, TypeScript, Tailwind CSS, shadcn/ui, Groq API

## AI Response Validation

To ensure the AI generates valid, parsable quiz data, we implement a **multi-layer validation approach**:

1. **Prompt Engineering**: The API prompt explicitly specifies the required JSON structure with strict formatting requirements (exactly 4 options per question, correctAnswer must match one option) and includes example outputs.

2. **Regex Extraction & Parsing**: We use regex pattern matching to extract JSON from the AI response, allowing the model to add explanatory text without breaking parsing. The regex `\{[\s\S]*\}` finds the JSON object regardless of surrounding content.

3. **Structure Validation**: After parsing, we validate that all required fields exist (question, options, correctAnswer) and that data types are correct. We also verify that correctAnswer is one of the provided options and each question has at least 4 options.

4. **Error Handling**: If validation fails at any step, the API returns a specific error message identifying which question failed and why, allowing for graceful error recovery.

## Project Structure

```
app/
├── page.tsx              # Landing page with topic input
├── api/
│   └── generate-quiz/route.ts  # API endpoint for quiz generation
├── quiz/
│   └── page.tsx          # Quiz interface
└── results/
    └── page.tsx          # Results page with scoring

lib/
└── types.ts              # TypeScript interfaces

public/                   # Static assets
```

## Features

✅ AI-powered quiz generation on any topic  
✅ Interactive quiz interface with progress tracking  
✅ Detailed results with correct/incorrect answer breakdown  
✅ Responsive design for all devices  
✅ Real-time loading states and error handling  

## Deployment

Deploy to Vercel with a single command:
```bash
npx vercel
```

Remember to add your `GROQ_API_KEY` in Vercel's environment variables.

## Resources

- [Groq API Documentation](https://console.groq.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [shadcn/ui Components](https://ui.shadcn.com)
