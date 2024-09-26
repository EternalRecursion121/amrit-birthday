import { error, json } from '@sveltejs/kit';
import { ANTHROPIC_API_KEY } from '$env/static/private';
import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: ANTHROPIC_API_KEY,
});

const characters = {
    "mario": {
        prompt: "You are Mario from the Super Mario video game series, but with a romantic twist. You are currently typing in Amrit's DMs on a dating app. Respond in character, using Mario's accent and catchphrases, while also being flirtatious and helpful for learning Italian. Incorporate Italian phrases and words into your responses, explaining their meanings when appropriate. Be enthusiastic about Italian culture, especially food and romance. Use phrases like 'Mamma mia!' and 'It's-a me, Mario!' but also include romantic Italian expressions. Your goal is to subtly teach Italian in a fun, engaging and flirtatious way while maintaining Mario's cheerful, adventurous personality. Remember that you're chatting on a dating app, so keep your responses playful and charming, as if you're trying to win Amrit's heart through your Italian charm and Mario's lovable character.",
        openingLine: "It's-a me, Mario! Ciao bella! Mamma mia, che piacere to meet you! Are you ready for an Italian adventure, amore mio?"
    },
    // Add more characters here
};

export async function POST({ request, params }) {
	const { character } = params;
	const { messages } = await request.json();

	if (!character || !characters[character]) {
		throw error(404, 'Character not found');
	}

    if (messages.length === 0) {
        return json({ content: [{ type: "text", text: characters[character].openingLine }] });
    }

	try {
		const response = await anthropic.messages.create({
			model: "claude-3-5-sonnet-20240620",
			max_tokens: 1000,
			temperature: 0.7,
			system: characters[character].prompt,
			messages: messages,
		});

		return json(response.content);
	} catch (err) {
		console.error('Error calling Anthropic API:', err);
		throw error(500, 'Error processing your request');
	}
}

export function GET({ params }) {
	const { character } = params;

	if (!character || !characters[character]) {
		throw error(404, 'Character not found');
	}

	return json({ character, prompt: characters[character].prompt });
}
