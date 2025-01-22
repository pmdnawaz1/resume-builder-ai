import jsPDF from 'jspdf';

const safeText = (text) => text || '';
const safeArray = (arr) => Array.isArray(arr) ? arr : [];

const addNewPage = (doc, yPos) => {
  if (yPos >= 270) {  // A4 height is 297mm, leaving margin for safety
    doc.addPage();
    return 20;  // Reset Y position to top of new page with margin
  }
  return yPos;
};

// Font style constants for consistent typography
const FONTS = {
  HEADING: {
    FAMILY: 'helvetica',
    SIZE: 14,
    STYLE: 'bold',
    COLOR: [51, 51, 51] // Dark gray
  },
  SUBHEADING: {
    FAMILY: 'helvetica',
    SIZE: 12,
    STYLE: 'bold',
    COLOR: [68, 68, 68]
  },
  BODY: {
    FAMILY: 'helvetica',
    SIZE: 10,
    STYLE: 'normal',
    COLOR: [51, 51, 51]
  },
  CAPTION: {
    FAMILY: 'helvetica',
    SIZE: 9,
    STYLE: 'normal',
    COLOR: [119, 119, 119] // Light gray
  }
};

// Helper functions for consistent styling
const applyHeadingStyle = (doc, isDark = false) => {
  doc.setFont(FONTS.HEADING.FAMILY, FONTS.HEADING.STYLE);
  doc.setFontSize(FONTS.HEADING.SIZE);
  doc.setTextColor(...(isDark ? [255, 255, 255] : FONTS.HEADING.COLOR));
};

const applySubheadingStyle = (doc) => {
  doc.setFont(FONTS.SUBHEADING.FAMILY, FONTS.SUBHEADING.STYLE);
  doc.setFontSize(FONTS.SUBHEADING.SIZE);
  doc.setTextColor(...FONTS.SUBHEADING.COLOR);
};

const applyBodyStyle = (doc) => {
  doc.setFont(FONTS.BODY.FAMILY, FONTS.BODY.STYLE);
  doc.setFontSize(FONTS.BODY.SIZE);
  doc.setTextColor(...FONTS.BODY.COLOR);
};

const applyCaptionStyle = (doc) => {
  doc.setFont(FONTS.CAPTION.FAMILY, FONTS.CAPTION.STYLE);
  doc.setFontSize(FONTS.CAPTION.SIZE);
  doc.setTextColor(...FONTS.CAPTION.COLOR);
};

const addBulletPoint = (doc, text, x, y, maxWidth) => {
  doc.text('•', x, y);
  const lines = doc.splitTextToSize(text, maxWidth - 8);
  doc.text(lines, x + 5, y);
  return y + (lines.length * (FONTS.BODY.SIZE * 0.3527)) + 2; // Convert pt to mm
};

const generateClassicPDF = (doc, data) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  let yPos = 20;

  // Header with gradient border
  doc.setFillColor(255, 255, 255); // White background
  doc.rect(0, 0, 210, 50, 'F');
  
  // Gradient border effect
  doc.setDrawColor(229, 231, 235); // gray-200
  doc.setLineWidth(0.5);
  for (let i = 0; i < 4; i++) {
    doc.line(0, 48 + i * 0.5, 210, 48 + i * 0.5);
  }

  // Name with proper font size and weight
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(24); // text-4xl
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(safeText(personalInfo.fullName), 105, 30, { align: 'center' });

  // Contact info with icons
  doc.setFontSize(10); // text-sm
  doc.setTextColor(75, 85, 99); // text-gray-600
  let contactY = 40;
  let contactX = 105;
  
  const contactItems = [];
  
  if (personalInfo.email) {
    // Email icon path
    doc.setDrawColor(75, 85, 99);
    doc.circle(contactX - 40, contactY - 1, 1.5, 'S');
    contactItems.push(personalInfo.email);
  }
  
  if (personalInfo.phone) {
    // Phone icon path
    doc.setDrawColor(75, 85, 99);
    doc.circle(contactX, contactY - 1, 1.5, 'S');
    contactItems.push(personalInfo.phone);
  }
  
  if (personalInfo.location) {
    // Location icon path
    doc.setDrawColor(75, 85, 99);
    doc.circle(contactX + 40, contactY - 1, 1.5, 'S');
    contactItems.push(personalInfo.location);
  }
  
  doc.text(contactItems.join('     '), 105, contactY, { align: 'center' });
  yPos = 70;

  // Summary with elegant border and shadow effect
  if (personalInfo.summary) {
    yPos = addNewPage(doc, yPos);
    
    // Card background with shadow effect
    doc.setFillColor(249, 250, 251); // bg-gray-50
    doc.setDrawColor(229, 231, 235); // border-gray-200
    doc.roundedRect(20, yPos - 5, 170, 40, 3, 3, 'FD');
    
    // Summary content
    doc.setTextColor(55, 65, 81); // text-gray-700
    doc.setFontSize(11);
    const summaryLines = doc.splitTextToSize(safeText(personalInfo.summary), 160);
    doc.text(summaryLines, 25, yPos + 5);
    yPos += summaryLines.length * 6 + 20;
  }

  // Experience section with timeline design
  if (experience.length > 0) {
    yPos = addNewPage(doc, yPos);
    
    // Section title with icon
    doc.setTextColor(17, 24, 39); // text-gray-900
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.text('Experience', 20, yPos);
    yPos += 10;

    experience.forEach((exp, index) => {
      yPos = addNewPage(doc, yPos);
      
      // Timeline dot
      doc.setFillColor(37, 99, 235); // bg-blue-600
      doc.circle(25, yPos - 2, 2, 'F');
      
      // Experience card with shadow
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(30, yPos - 8, 160, exp.description ? 40 : 25, 2, 2, 'FD');
      
      // Title and company
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.setTextColor(17, 24, 39);
      doc.text(safeText(exp.title), 35, yPos);
      
      // Date
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(75, 85, 99);
      const dateText = `${safeText(exp.startDate)} - ${exp.current ? 'Present' : safeText(exp.endDate)}`;
      doc.text(dateText, 185, yPos, { align: 'right' });
      
      yPos += 5;
      // Company and location
      doc.text(`${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ''}`, 35, yPos);
      
      // Description with bullet points
      if (exp.description) {
        yPos += 8;
        const descLines = exp.description.split('\n');
        descLines.forEach(line => {
          if (line.trim()) {
            yPos = addNewPage(doc, yPos);
            const wrappedLines = doc.splitTextToSize(line.trim(), 145);
            wrappedLines.forEach(wrappedLine => {
              doc.circle(38, yPos - 1.5, 0.8, 'F');
              doc.text(wrappedLine, 42, yPos);
              yPos += 5;
            });
          }
        });
      }
      yPos += 15;
    });
  }

  // Education section
  if (education.length > 0) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text('Education', 20, yPos);
    yPos += 10;

    education.forEach((edu) => {
      yPos = addNewPage(doc, yPos);
      
      // Education card
      doc.setFillColor(255, 255, 255);
      doc.setDrawColor(229, 231, 235);
      doc.roundedRect(20, yPos - 8, 170, edu.description ? 40 : 25, 2, 2, 'FD');
      
      // Degree
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(12);
      doc.text(safeText(edu.degree), 25, yPos);
      
      // Graduation date
      if (edu.graduationDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(edu.graduationDate, 185, yPos, { align: 'right' });
      }
      
      yPos += 5;
      // School and location
      doc.setFont('helvetica', 'normal');
      doc.text(`${safeText(edu.school)}${edu.location ? ` • ${edu.location}` : ''}`, 25, yPos);
      
      if (edu.description) {
        yPos += 8;
        const descLines = doc.splitTextToSize(edu.description, 160);
        doc.text(descLines, 25, yPos);
        yPos += descLines.length * 5;
      }
      yPos += 15;
    });
  }

  // Skills section
  if (skills.length > 0) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(17, 24, 39);
    doc.text('Skills', 20, yPos);
    yPos += 10;

    skills.forEach((skillCategory) => {
      yPos = addNewPage(doc, yPos);
      if (skillCategory.category) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(12);
        doc.text(skillCategory.category, 20, yPos);
        yPos += 5;
      }

      if (skillCategory.items?.length > 0) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        skillCategory.items.forEach((skill) => {
          yPos = addNewPage(doc, yPos);
          doc.circle(23, yPos - 1.5, 0.8, 'F');
          const skillLines = doc.splitTextToSize(skill, 160);
          doc.text(skillLines, 27, yPos);
          yPos += skillLines.length * 4 + 2;
        });
      }
      yPos += 5;
    });
  }
};

const generateModernPDF = (doc, data) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  let yPos = 0;

  // Modern Header with colored background
  doc.setFillColor(23, 37, 84); // Dark blue background
  doc.rect(0, 0, 210, 45, 'F');

  // Name in white
  applyHeadingStyle(doc, true);
  doc.text(safeText(personalInfo.fullName), 20, 25);

  // Contact info in white with icons
  applyCaptionStyle(doc);
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);

  contactInfo.forEach((info, index) => {
    doc.text(info, 20 + (index * 60), 35);
  });

  // Reset text color for main content
  doc.setTextColor(0, 0, 0);
  yPos = 60;

  // Professional Summary with modern styling
  if (personalInfo.summary) {
    yPos = addNewPage(doc, yPos);
    // Section title with blue underline
    doc.setFillColor(23, 37, 84);
    doc.rect(20, yPos - 1, 170, 0.5, 'F');
    
    applySubheadingStyle(doc);
    doc.text('PROFESSIONAL SUMMARY', 20, yPos - 5);
    
    yPos += 5;
    applyBodyStyle(doc);
    const summaryLines = doc.splitTextToSize(safeText(personalInfo.summary), 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 6 + 15;
  }

  // Experience Section
  if (experience.length > 0) {
    yPos = addNewPage(doc, yPos);
    // Section title with blue underline
    doc.setFillColor(23, 37, 84);
    doc.rect(20, yPos - 1, 170, 0.5, 'F');
    
    applySubheadingStyle(doc);
    doc.text('PROFESSIONAL EXPERIENCE', 20, yPos - 5);
    yPos += 8;

    experience.forEach((exp, index) => {
      yPos = addNewPage(doc, yPos);
      
      // Company and Title in bold
      applyBodyStyle(doc);
      doc.text(safeText(exp.title), 20, yPos);
      
      // Date on the right
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(10);
      const dateText = `${safeText(exp.startDate)} - ${exp.current ? 'Present' : safeText(exp.endDate)}`;
      doc.text(dateText, 190, yPos, { align: 'right' });
      
      yPos += 5;
      // Company and location in gray
      doc.setTextColor(100, 100, 100);
      doc.text(`${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ''}`, 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;

      // Description with bullet points
      if (exp.description) {
        const descLines = exp.description.split('\n');
        descLines.forEach((line) => {
          if (line.trim()) {
            yPos = addNewPage(doc, yPos);
            const wrappedLines = doc.splitTextToSize(line.trim(), 155);
            wrappedLines.forEach((wrappedLine) => {
              doc.text('•', 20, yPos);
              doc.text(wrappedLine, 25, yPos);
              yPos += 5;
            });
          }
        });
      }
      yPos += 8;
    });
  }

  // Education Section
  if (education.length > 0) {
    yPos = addNewPage(doc, yPos);
    // Section title with blue underline
    doc.setFillColor(23, 37, 84);
    doc.rect(20, yPos - 1, 170, 0.5, 'F');
    
    applySubheadingStyle(doc);
    doc.text('EDUCATION', 20, yPos - 5);
    yPos += 8;

    education.forEach((edu) => {
      yPos = addNewPage(doc, yPos);
      applyBodyStyle(doc);
      doc.text(safeText(edu.degree), 20, yPos);

      // Graduation date on the right
      if (edu.graduationDate) {
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(10);
        doc.text(edu.graduationDate, 190, yPos, { align: 'right' });
      }

      yPos += 5;
      // School and location in gray
      doc.setTextColor(100, 100, 100);
      doc.text(`${safeText(edu.school)}${edu.location ? ` • ${edu.location}` : ''}`, 20, yPos);
      doc.setTextColor(0, 0, 0);
      yPos += 6;

      if (edu.description) {
        yPos = addNewPage(doc, yPos);
        applyBodyStyle(doc);
        const descLines = doc.splitTextToSize(edu.description, 160);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5 + 3;
      }
      yPos += 5;
    });
  }

  // Skills Section
  if (skills.length > 0) {
    yPos = addNewPage(doc, yPos);
    // Section title with blue underline
    doc.setFillColor(23, 37, 84);
    doc.rect(20, yPos - 1, 170, 0.5, 'F');
    
    applySubheadingStyle(doc);
    doc.text('SKILLS', 20, yPos - 5);
    yPos += 8;

    skills.forEach((skillCategory) => {
      yPos = addNewPage(doc, yPos);
      if (skillCategory.category) {
        applyBodyStyle(doc);
        doc.text(skillCategory.category, 20, yPos);
        yPos += 5;
      }

      if (skillCategory.items?.length > 0) {
        applyBodyStyle(doc);
        // Create a grid layout for skills
        const skillsPerRow = 3;
        const maxWidth = 50;
        skillCategory.items.forEach((skill, index) => {
          const xPos = 20 + (index % skillsPerRow) * (maxWidth + 10);
          const currentYPos = yPos + Math.floor(index / skillsPerRow) * 8;
          yPos = addNewPage(doc, currentYPos);
          
          // Add a subtle background for each skill
          doc.setFillColor(240, 240, 240);
          const textWidth = doc.getTextWidth(skill);
          doc.roundedRect(xPos - 2, currentYPos - 4, textWidth + 4, 6, 1, 1, 'F');
          
          doc.text(skill, xPos, currentYPos);
        });
        yPos += Math.ceil(skillCategory.items.length / skillsPerRow) * 8 + 5;
      }
    });
  }
};

const generateTechnicalPDF = (doc, data) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  let yPos = 20;

  // Technical Header with monospace styling
  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.rect(0, 0, 210, 50, 'F');
  
  // Header border
  doc.setDrawColor(229, 231, 235); // border-gray-200
  doc.setLineWidth(0.5);
  doc.rect(20, 10, 170, 35, 'S');

  // Name in monospace
  doc.setFont('courier', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(safeText(personalInfo.fullName), 25, 25);

  // Contact info in command-line style
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(75, 85, 99); // text-gray-600
  
  let contactY = 35;
  if (personalInfo.email) {
    doc.text('> email:', 25, contactY);
    doc.text(personalInfo.email, 60, contactY);
    contactY += 5;
  }
  if (personalInfo.phone) {
    doc.text('> phone:', 25, contactY);
    doc.text(personalInfo.phone, 60, contactY);
    contactY += 5;
  }
  if (personalInfo.location) {
    doc.text('> location:', 25, contactY);
    doc.text(personalInfo.location, 60, contactY);
  }

  yPos = 70;

  // Summary as code comment
  if (personalInfo.summary) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('courier', 'normal');
    doc.setTextColor(100, 150, 100); // Green color for comments
    doc.text('/**', 20, yPos);
    yPos += 5;
    
    const summaryLines = doc.splitTextToSize(safeText(personalInfo.summary), 150);
    summaryLines.forEach(line => {
      doc.text(` * ${line}`, 20, yPos);
      yPos += 5;
    });
    
    doc.text(' */', 20, yPos);
    yPos += 10;
  }

  // Two-column layout
  const leftColX = 20;
  const rightColX = 85;
  const rightColWidth = 105;
  let rightColYPos = yPos;
  let leftColYPos = yPos;

  // Skills section in left column
  if (skills.length > 0) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39);
    doc.text('TECHNICAL SKILLS', leftColX, leftColYPos);
    leftColYPos += 8;

    skills.forEach((skillCategory) => {
      leftColYPos = addNewPage(doc, leftColYPos);
      if (skillCategory.category) {
        doc.setFont('courier', 'bold');
        doc.text(skillCategory.category, leftColX, leftColYPos);
        leftColYPos += 5;
      }

      if (skillCategory.items?.length > 0) {
        doc.setFont('courier', 'normal');
        skillCategory.items.forEach((skill) => {
          leftColYPos = addNewPage(doc, leftColYPos);
          doc.text('>', leftColX, leftColYPos);
          const skillLines = doc.splitTextToSize(skill, 55);
          doc.text(skillLines, leftColX + 4, leftColYPos);
          leftColYPos += skillLines.length * 4 + 2;
        });
      }
      leftColYPos += 5;
    });
  }

  // Education in left column
  if (education.length > 0) {
    leftColYPos += 5;
    leftColYPos = addNewPage(doc, leftColYPos);
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.text('EDUCATION', leftColX, leftColYPos);
    leftColYPos += 8;

    education.forEach((edu) => {
      leftColYPos = addNewPage(doc, leftColYPos);
      
      // Card background
      doc.setFillColor(249, 250, 251); // bg-gray-50
      doc.setDrawColor(229, 231, 235); // border-gray-200
      doc.roundedRect(leftColX, leftColYPos - 5, 60, edu.description ? 35 : 25, 2, 2, 'FD');
      
      doc.setFont('courier', 'bold');
      const degreeLines = doc.splitTextToSize(safeText(edu.degree), 55);
      doc.text(degreeLines, leftColX + 5, leftColYPos);
      leftColYPos += degreeLines.length * 5;

      doc.setFont('courier', 'normal');
      doc.setFontSize(9);
      const schoolLines = doc.splitTextToSize(
        `${safeText(edu.school)}${edu.location ? ` @ ${edu.location}` : ''}`,
        55
      );
      doc.text(schoolLines, leftColX + 5, leftColYPos);
      leftColYPos += schoolLines.length * 4;

      if (edu.graduationDate) {
        doc.text(edu.graduationDate, leftColX + 5, leftColYPos);
        leftColYPos += 4;
      }

      if (edu.description) {
        leftColYPos += 2;
        const descLines = doc.splitTextToSize(edu.description, 55);
        doc.text(descLines, leftColX + 5, leftColYPos);
        leftColYPos += descLines.length * 4 + 5;
      }
      leftColYPos += 10;
    });
  }

  // Experience in right column
  if (experience.length > 0) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(37, 99, 235); // text-blue-500
    doc.text('function getExperience() {', rightColX, rightColYPos);
    rightColYPos += 10;

    experience.forEach((exp, index) => {
      rightColYPos = addNewPage(doc, rightColYPos);
      
      // Experience card
      doc.setFillColor(249, 250, 251); // bg-gray-50
      doc.setDrawColor(229, 231, 235); // border-gray-200
      doc.roundedRect(rightColX, rightColYPos - 5, rightColWidth - 5, exp.description ? 45 : 25, 2, 2, 'FD');
      
      // Title with const keyword
      doc.setTextColor(37, 99, 235); // text-blue-500
      doc.text('const', rightColX + 5, rightColYPos);
      doc.setTextColor(17, 24, 39);
      doc.text(exp.title, rightColX + 25, rightColYPos);
      
      // Company and location
      doc.setFont('courier', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(37, 99, 235);
      doc.text(`${safeText(exp.company)}${exp.location ? ` @ ${exp.location}` : ''}`, rightColX + 5, rightColYPos + 5);
      
      // Date badge
      const dateText = `${safeText(exp.startDate)} → ${exp.current ? 'Present' : safeText(exp.endDate)}`;
      doc.setFillColor(243, 244, 246); // bg-gray-100
      doc.setDrawColor(229, 231, 235);
      const dateWidth = doc.getTextWidth(dateText) + 6;
      doc.roundedRect(rightColX + rightColWidth - dateWidth - 10, rightColYPos - 2, dateWidth, 6, 1, 1, 'FD');
      doc.setTextColor(75, 85, 99);
      doc.text(dateText, rightColX + rightColWidth - dateWidth - 7, rightColYPos + 2);

      // Description with command-line style
      if (exp.description) {
        rightColYPos += 10;
        const descLines = exp.description.split('\n');
        descLines.forEach((line) => {
          if (line.trim()) {
            rightColYPos = addNewPage(doc, rightColYPos);
            doc.text('›', rightColX + 5, rightColYPos);
            const wrappedLines = doc.splitTextToSize(line.trim(), rightColWidth - 15);
            wrappedLines.forEach((wrappedLine) => {
              doc.text(wrappedLine, rightColX + 10, rightColYPos);
              rightColYPos += 4;
            });
          }
        });
      }
      rightColYPos += 10;
    });
    
    // Close the function
    doc.setFont('courier', 'bold');
    doc.setTextColor(37, 99, 235);
    doc.text('}', rightColX, rightColYPos);
  }
};

const generateMinimalPDF = (doc, data) => {
  const { personalInfo = {}, experience = [], education = [], skills = [] } = data || {};
  let yPos = 30;

  // Minimal Header with light font
  doc.setFont('helvetica', 'light');
  doc.setFontSize(18);
  doc.setTextColor(17, 24, 39); // text-gray-900
  doc.text(safeText(personalInfo.fullName), 20, yPos);

  // Subtle border separator
  yPos += 10;
  doc.setDrawColor(229, 231, 235); // border-gray-200
  doc.line(20, yPos, 190, yPos);

  // Contact info with separators
  yPos += 10;
  doc.setFontSize(9);
  doc.setTextColor(75, 85, 99); // text-gray-600
  
  const contactParts = [];
  if (personalInfo.email) contactParts.push(personalInfo.email);
  if (personalInfo.phone) contactParts.push(personalInfo.phone);
  if (personalInfo.location) contactParts.push(personalInfo.location);
  
  doc.text(contactParts.join(' | '), 20, yPos);
  yPos += 20;

  // Summary with clean typography
  if (personalInfo.summary) {
    yPos = addNewPage(doc, yPos);
    doc.setTextColor(55, 65, 81); // text-gray-700
    doc.setFontSize(10);
    const summaryLines = doc.splitTextToSize(safeText(personalInfo.summary), 170);
    doc.text(summaryLines, 20, yPos);
    yPos += summaryLines.length * 5 + 20;
  }

  // Experience
  if (experience.length > 0) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('helvetica', 'light');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // text-gray-900
    doc.text('EXPERIENCE', 20, yPos);
    yPos += 8;

    experience.forEach((exp) => {
      yPos = addNewPage(doc, yPos);
      
      // Title and date
      doc.setFont('helvetica', 'medium');
      doc.setFontSize(10);
      doc.text(safeText(exp.title), 20, yPos);
      
      const dateText = `${safeText(exp.startDate)} — ${exp.current ? 'Present' : safeText(exp.endDate)}`;
      doc.setFont('helvetica', 'light');
      doc.setTextColor(107, 114, 128); // text-gray-500
      doc.text(dateText, 190, yPos, { align: 'right' });
      
      // Company and location
      yPos += 5;
      doc.setTextColor(75, 85, 99); // text-gray-600
      doc.text(`${safeText(exp.company)}${exp.location ? ` · ${exp.location}` : ''}`, 20, yPos);
      
      // Description
      if (exp.description) {
        yPos += 6;
        doc.setTextColor(55, 65, 81); // text-gray-700
        const descLines = doc.splitTextToSize(exp.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5;
      }
      yPos += 10;
    });
  }

  // Education
  if (education.length > 0) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('helvetica', 'light');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // text-gray-900
    doc.text('EDUCATION', 20, yPos);
    yPos += 8;

    education.forEach((edu) => {
      yPos = addNewPage(doc, yPos);
      
      // Degree and date
      doc.setFont('helvetica', 'medium');
      doc.setFontSize(10);
      doc.text(safeText(edu.degree), 20, yPos);
      
      if (edu.graduationDate) {
        doc.setFont('helvetica', 'light');
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text(edu.graduationDate, 190, yPos, { align: 'right' });
      }

      // School and location
      yPos += 5;
      doc.setTextColor(75, 85, 99); // text-gray-600
      doc.text(`${safeText(edu.school)}${edu.location ? ` · ${edu.location}` : ''}`, 20, yPos);
      
      // Description
      if (edu.description) {
        yPos += 6;
        doc.setTextColor(55, 65, 81); // text-gray-700
        const descLines = doc.splitTextToSize(edu.description, 170);
        doc.text(descLines, 20, yPos);
        yPos += descLines.length * 5;
      }
      yPos += 10;
    });
  }

  // Skills with minimal inline layout
  if (skills.length > 0) {
    yPos = addNewPage(doc, yPos);
    doc.setFont('helvetica', 'light');
    doc.setFontSize(12);
    doc.setTextColor(17, 24, 39); // text-gray-900
    doc.text('SKILLS', 20, yPos);
    yPos += 8;

    skills.forEach((skillCategory) => {
      yPos = addNewPage(doc, yPos);
      if (skillCategory.category) {
        doc.setFont('helvetica', 'medium');
        doc.setFontSize(10);
        doc.text(skillCategory.category, 20, yPos);
        yPos += 5;
      }

      if (skillCategory.items?.length > 0) {
        doc.setFont('helvetica', 'light');
        doc.setTextColor(55, 65, 81); // text-gray-700
        const skillsText = skillCategory.items.join(' · ');
        const skillsLines = doc.splitTextToSize(skillsText, 165);
        doc.text(skillsLines, 20, yPos);
        yPos += skillsLines.length * 5 + 8;
      }
    });
  }
};

export const generatePDF = (data, template = 'classic') => {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
    compress: true
  });

  // Add custom font
  doc.setFont('helvetica');
  
  switch (template.toLowerCase()) {
    case 'classic':
      generateClassicPDF(doc, data);
      break;
    case 'modern':
      generateModernPDF(doc, data);
      break;
    case 'minimal':
      generateMinimalPDF(doc, data);
      break;
    case 'technical':
      generateTechnicalPDF(doc, data);
      break;
    default:
      generateClassicPDF(doc, data);
  }

  return doc;
};
