"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PromptRegistry = void 0;
class PromptRegistry {
    static prompts = new Map();
    static register(template) {
        this.prompts.set(template.id, template);
    }
    static get(id) {
        return this.prompts.get(id);
    }
    static getByCategory(category) {
        return [...this.prompts.values()].filter((p) => p.category === category);
    }
    static render(id, variables) {
        const template = this.prompts.get(id);
        if (!template)
            throw new Error(`Prompt template "${id}" not found`);
        let content = template.content;
        for (const [key, value] of Object.entries(variables)) {
            content = content.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
        }
        return {
            system: template.systemPrompt || '',
            user: content,
        };
    }
}
exports.PromptRegistry = PromptRegistry;
const BUILT_IN_PROMPTS = [
    {
        id: 'ai-tutor',
        name: 'AI Tutor',
        category: 'tutoring',
        version: 1,
        content: `You are an expert AI tutor for EduSocial. Help the student understand the following topic clearly and thoroughly.

Topic: {{topic}}
Student's question: {{question}}
Course context: {{courseContext}}

Provide a clear, educational explanation. Use examples when helpful. Break down complex concepts into simple parts.`,
        variables: ['topic', 'question', 'courseContext'],
        systemPrompt: "You are a patient, knowledgeable tutor. Explain concepts clearly. Adapt to the student's level. Encourage learning.",
        maxTokens: 2048,
        temperature: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'homework-assistant',
        name: 'Homework Assistant',
        category: 'homework',
        version: 1,
        content: `You are a homework assistant. Help the student work through their homework problem step by step.

Assignment: {{assignment}}
Subject: {{subject}}
Student's attempt: {{studentAttempt}}

Guide the student without giving away the answer directly. Ask clarifying questions. Provide hints.`,
        variables: ['assignment', 'subject', 'studentAttempt'],
        systemPrompt: 'You are a helpful homework assistant. Guide students to find answers themselves. Never give direct answers to graded work.',
        maxTokens: 2048,
        temperature: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'lesson-explainer',
        name: 'Lesson Explainer',
        category: 'lessons',
        version: 1,
        content: `Explain the following lesson content in a clear, engaging way.

Lesson title: {{lessonTitle}}
Content: {{content}}
Student level: {{level}}

Provide a summary, key takeaways, and any helpful analogies.`,
        variables: ['lessonTitle', 'content', 'level'],
        systemPrompt: 'You are an expert educator. Make complex topics accessible and engaging.',
        maxTokens: 3000,
        temperature: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'quiz-generator',
        name: 'Quiz Generator',
        category: 'assessment',
        version: 1,
        content: `Generate a quiz based on the following material.

Subject: {{subject}}
Topic: {{topic}}
Difficulty: {{difficulty}}
Number of questions: {{numQuestions}}
Question types: {{questionTypes}}

Material: {{material}}

Generate diverse question types (multiple choice, true/false, short answer). Provide correct answers and explanations.`,
        variables: [
            'subject',
            'topic',
            'difficulty',
            'numQuestions',
            'questionTypes',
            'material',
        ],
        systemPrompt: 'You are an expert assessment designer. Create fair, educational questions that test understanding.',
        maxTokens: 4096,
        temperature: 0.8,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'flashcard-generator',
        name: 'Flashcard Generator',
        category: 'study',
        version: 1,
        content: `Generate flashcards from the following material.

Topic: {{topic}}
Number of cards: {{numCards}}
Material: {{material}}

Create concise front/back pairs. Front should be a question or concept. Back should be a clear, concise answer.`,
        variables: ['topic', 'numCards', 'material'],
        systemPrompt: 'You are a study aid expert. Create effective flashcards that aid memory retention.',
        maxTokens: 3000,
        temperature: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'mind-map-generator',
        name: 'Mind Map Generator',
        category: 'study',
        version: 1,
        content: `Generate a mind map structure for the following topic.

Topic: {{topic}}
Depth: {{depth}}
Material: {{material}}

Return as a JSON structure with nodes and connections.`,
        variables: ['topic', 'depth', 'material'],
        systemPrompt: 'You are a visual learning expert. Create hierarchical mind map structures.',
        maxTokens: 3000,
        temperature: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'pdf-summarizer',
        name: 'PDF Summarizer',
        category: 'summarization',
        version: 1,
        content: `Summarize the following document comprehensively.

Document title: {{title}}
Content: {{content}}
Summary length: {{length}}

Provide:
1. Executive summary
2. Key points
3. Important details
4. Conclusions`,
        variables: ['title', 'content', 'length'],
        systemPrompt: 'You are a document analysis expert. Provide accurate, concise summaries.',
        maxTokens: 4096,
        temperature: 0.5,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'study-planner',
        name: 'Study Planner',
        category: 'planning',
        version: 1,
        content: `Create a personalized study plan.

Student goals: {{goals}}
Available time: {{availableTime}}
Subjects: {{subjects}}
Exam dates: {{examDates}}
Current level: {{currentLevel}}

Create a structured study plan with daily/weekly tasks, review sessions, and practice tests.`,
        variables: [
            'goals',
            'availableTime',
            'subjects',
            'examDates',
            'currentLevel',
        ],
        systemPrompt: 'You are an academic planning expert. Create realistic, effective study plans.',
        maxTokens: 4096,
        temperature: 0.7,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'homework-feedback',
        name: 'Homework Feedback',
        category: 'feedback',
        version: 1,
        content: `Provide detailed feedback on the student's homework submission.

Assignment: {{assignment}}
Student submission: {{submission}}
Rubric: {{rubric}}

Provide constructive feedback covering:
1. What was done well
2. Areas for improvement
3. Specific suggestions
4. Grade recommendation`,
        variables: ['assignment', 'submission', 'rubric'],
        systemPrompt: 'You are a supportive teacher providing helpful feedback. Be encouraging but honest.',
        maxTokens: 3000,
        temperature: 0.6,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
    {
        id: 'title-generator',
        name: 'Conversation Title Generator',
        category: 'meta',
        version: 1,
        content: `Generate a concise, descriptive title (max 50 characters) for this conversation:

First message: {{message}}`,
        variables: ['message'],
        systemPrompt: 'Generate a short, descriptive title. No quotes. Max 50 characters.',
        maxTokens: 50,
        temperature: 0.3,
        createdAt: new Date(),
        updatedAt: new Date(),
    },
];
for (const prompt of BUILT_IN_PROMPTS) {
    PromptRegistry.register(prompt);
}
//# sourceMappingURL=prompt-registry.js.map