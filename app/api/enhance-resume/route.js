import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const enhanceResume = async (resume, jobDescription) => {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

  const prompt = `
As an expert resume writer, enhance this resume to better match the job description while maintaining truthfulness and professionalism. Focus on:

1. Making experience descriptions more impactful by:
   - Using strong action verbs
   - Quantifying achievements where possible
   - Highlighting relevant skills and responsibilities

2. Optimizing skills by:
   - Prioritizing skills mentioned in the job description
   - Adding relevant technical and soft skills based on experience
   - Removing irrelevant skills

3. Improving the professional summary to:
   - Highlight key qualifications matching the job
   - Showcase relevant achievements
   - Include important keywords from the job description

Job Description:
${jobDescription}

Current Resume (in JSON format):
${JSON.stringify(resume, null, 2)}

Please provide the enhanced resume in the exact same JSON format with improved content. Do not invent or fabricate new experiences or qualifications. Only enhance existing content to be more impactful and relevant.
`;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    // Extract the JSON from the response
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Failed to parse AI response');
    }
    
    const enhancedResume = JSON.parse(jsonMatch[0]);
    return enhancedResume;
  } catch (error) {
    console.error('Error in AI enhancement:', error);
    throw new Error('Failed to enhance resume');
  }
};

export async function POST(request) {
  if (!process.env.GEMINI_API_KEY) {
    return new Response(
      JSON.stringify({ error: 'Gemini API key not configured' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }

  try {
    const { resume, jobDescription } = await request.json();

    if (!resume || !jobDescription) {
      return new Response(
        JSON.stringify({ error: 'Missing resume or job description' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const enhancedResume = await enhanceResume(resume, jobDescription);

    return new Response(JSON.stringify(enhancedResume), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in enhance-resume route:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to enhance resume: ' + error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
