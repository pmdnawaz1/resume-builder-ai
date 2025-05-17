import { NextResponse } from 'next/server';
import * as pdfLib from 'pdf-parse/lib/pdf-parse.js';

// Custom implementation to avoid dependency on test files
async function parsePdf(dataBuffer) {
  try {
    // Use the pdf-lib directly, bypassing the test file loading
    return await pdfLib.default(dataBuffer);
  } catch (error) {
    console.error('Error in PDF parsing:', error);
    throw new Error('Failed to parse PDF content');
  }
}

export async function POST(request) {
  try {
    const formData = await request.formData();
    const file = formData.get('resume');

    if (!file) {
      return NextResponse.json(
        { error: 'No file uploaded' },
        { status: 400 }
      );
    }

    const buffer = await file.arrayBuffer();
    let text = '';

    // Parse based on file type
    if (file.name.endsWith('.pdf')) {
      const pdfData = await parsePdf(Buffer.from(buffer));
      text = pdfData.text;
    } else if (file.name.endsWith('.docx')) {
      const mammoth = await import('mammoth');
      const result = await mammoth.convertToPlainText({ buffer: Buffer.from(buffer) });
      text = result.value;
    } else {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Basic parsing logic - can be enhanced with AI
    const parsedData = {
      personalInfo: {
        name: extractName(text),
        email: extractEmail(text),
        phone: extractPhone(text),
        location: extractLocation(text),
      },
      skills: {
        technical: extractSkills(text),
        soft: [],
        languages: [],
      },
      experience: extractExperience(text),
      education: extractEducation(text),
    };

    return NextResponse.json(parsedData);
  } catch (error) {
    console.error('Error parsing resume:', error);
    return NextResponse.json(
      { error: 'Failed to parse resume' },
      { status: 500 }
    );
  }
}

// Helper functions for parsing
function extractName(text) {
  // Basic name extraction - first line or first capitalized words
  const firstLine = text.split('\n')[0].trim();
  return firstLine;
}

function extractEmail(text) {
  const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/;
  const match = text.match(emailRegex);
  return match ? match[0] : '';
}

function extractPhone(text) {
  const phoneRegex = /(\+\d{1,3}[-.]?)?\(?\d{3}\)?[-.]?\d{3}[-.]?\d{4}/;
  const match = text.match(phoneRegex);
  return match ? match[0] : '';
}

function extractLocation(text) {
  // Basic location extraction - look for common patterns
  const locationRegex = /([A-Z][a-zA-Z]+,?\s*)+(?:AL|AK|AZ|AR|CA|CO|CT|DE|FL|GA|HI|ID|IL|IN|IA|KS|KY|LA|ME|MD|MA|MI|MN|MS|MO|MT|NE|NV|NH|NJ|NM|NY|NC|ND|OH|OK|OR|PA|RI|SC|SD|TN|TX|UT|VT|VA|WA|WV|WI|WY)/;
  const match = text.match(locationRegex);
  return match ? match[0] : '';
}

function extractSkills(text) {
  // Look for common technical skills
  const commonSkills = [
    'JavaScript', 'Python', 'Java', 'C++', 'React', 'Angular', 'Vue',
    'Node.js', 'Express', 'MongoDB', 'SQL', 'AWS', 'Docker', 'Kubernetes',
    'Git', 'CI/CD', 'HTML', 'CSS', 'TypeScript', 'REST API', 'GraphQL'
  ];

  return commonSkills.filter(skill => 
    text.toLowerCase().includes(skill.toLowerCase())
  );
}

function extractExperience(text) {
  // Basic experience extraction - look for job titles and dates
  const experiences = [];
  const lines = text.split('\n');
  let currentExp = null;

  const jobTitles = [
    'Engineer', 'Developer', 'Manager', 'Director', 'Coordinator',
    'Specialist', 'Analyst', 'Consultant', 'Lead', 'Architect'
  ];

  lines.forEach(line => {
    const hasJobTitle = jobTitles.some(title => 
      line.toLowerCase().includes(title.toLowerCase())
    );
    const hasDate = /\d{4}/.test(line);

    if (hasJobTitle && hasDate) {
      if (currentExp) {
        experiences.push(currentExp);
      }
      currentExp = {
        title: line.trim(),
        company: '',
        location: '',
        startDate: '',
        endDate: '',
        description: ''
      };
    } else if (currentExp) {
      currentExp.description += line.trim() + ' ';
    }
  });

  if (currentExp) {
    experiences.push(currentExp);
  }

  return experiences;
}

function extractEducation(text) {
  // Basic education extraction - look for degrees and institutions
  const education = [];
  const degrees = [
    'Bachelor', 'Master', 'PhD', 'BS', 'BA', 'MS', 'MA', 'MBA',
    'Associate', 'Diploma'
  ];

  const lines = text.split('\n');
  let currentEdu = null;

  lines.forEach(line => {
    const hasDegree = degrees.some(degree => 
      line.toLowerCase().includes(degree.toLowerCase())
    );
    const hasDate = /\d{4}/.test(line);

    if (hasDegree && hasDate) {
      if (currentEdu) {
        education.push(currentEdu);
      }
      currentEdu = {
        degree: line.trim(),
        institution: '',
        location: '',
        graduationDate: '',
        gpa: ''
      };
    } else if (currentEdu && /\d\.\d/.test(line)) {
      currentEdu.gpa = line.match(/\d\.\d\d?/)[0];
    } else if (currentEdu) {
      currentEdu.institution = line.trim();
    }
  });

  if (currentEdu) {
    education.push(currentEdu);
  }

  return education;
}