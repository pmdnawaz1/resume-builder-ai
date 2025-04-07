import jsPDF from "jspdf";

const safeText = (text) => text || "";
const safeArray = (arr) => (Array.isArray(arr) ? arr : []);

// Calculate content length to dynamically adjust font sizes and spacing
const calculateContentLength = (data) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};

  // Calculate experience length
  const experienceLength = experience.reduce((acc, exp) => {
    const titleLength = (exp.title || "").length;
    const companyLength = (exp.company || "").length;
    const descriptionLines = exp.description
      ? exp.description.split("\n").length
      : 0;
    return acc + titleLength + companyLength + descriptionLines * 10;
  }, 0);

  // Calculate education length
  const educationLength = education.reduce((acc, edu) => {
    const degreeLength = (edu.degree || "").length;
    const schoolLength = (edu.school || "").length;
    const descriptionLines = edu.description
      ? edu.description.split("\n").length
      : 0;
    return acc + degreeLength + schoolLength + descriptionLines * 10;
  }, 0);

  // Calculate skills length
  const skillsLength = skills.reduce((acc, skillCategory) => {
    const categoryLength = (skillCategory.category || "").length;
    const itemsLength = skillCategory.items
      ? skillCategory.items.length * 10
      : 0;
    return acc + categoryLength + itemsLength;
  }, 0);

  // Calculate summary length
  const summaryLength = (personalInfo.summary || "").length;

  // Total content length
  return {
    total: experienceLength + educationLength + skillsLength + summaryLength,
    experienceLength,
    educationLength,
    skillsLength,
    summaryLength,
    experienceCount: experience.length,
    educationCount: education.length,
    skillsCount: skills.length,
  };
};

// Determine font sizes and spacing based on content length
const determineSizing = (contentLength) => {
  const { total, experienceCount, educationCount, skillsCount } = contentLength;

  // Base sizes
  let sizes = {
    heading: { size: 14, lineHeight: 1.5 },
    subheading: { size: 12, lineHeight: 1.4 },
    body: { size: 10, lineHeight: 1.3 },
    caption: { size: 9, lineHeight: 1.2 },
    spacing: { section: 12, item: 8, paragraph: 5 },
  };

  // Adjust based on content length
  if (total > 3000 || experienceCount + educationCount > 6) {
    // Very dense content
    sizes = {
      heading: { size: 12, lineHeight: 1.3 },
      subheading: { size: 10, lineHeight: 1.2 },
      body: { size: 8, lineHeight: 1.1 },
      caption: { size: 7, lineHeight: 1.0 },
      spacing: { section: 8, item: 6, paragraph: 3 },
    };
  } else if (total > 2000 || experienceCount + educationCount > 4) {
    // Dense content
    sizes = {
      heading: { size: 13, lineHeight: 1.4 },
      subheading: { size: 11, lineHeight: 1.3 },
      body: { size: 9, lineHeight: 1.2 },
      caption: { size: 8, lineHeight: 1.1 },
      spacing: { section: 10, item: 7, paragraph: 4 },
    };
  }

  return sizes;
};

// Helper function to truncate text if needed to fit on one page
const truncateIfNeeded = (text, maxChars) => {
  if (!text) return "";
  if (text.length <= maxChars) return text;
  return text.substring(0, maxChars) + "...";
};

// Helper functions for consistent styling
const applyStyle = (doc, style, isDark = false) => {
  doc.setFont(style.family || "helvetica", style.style || "normal");
  doc.setFontSize(style.size);
  doc.setTextColor(...(isDark ? [255, 255, 255] : style.color || [0, 0, 0]));
};

// Function to ensure content fits on a single page
const ensureSinglePage = (doc, yPos, remainingHeight, contentLength) => {
  // Check if we are close to exceeding page height
  const buffer = 20; // Buffer space at bottom of page
  if (yPos + remainingHeight > 277 - buffer) {
    // We need to adjust content to fit
    const compressionRatio = (277 - buffer - yPos) / remainingHeight;
    return Math.max(0.7, compressionRatio); // Don't compress more than 30%
  }
  return 1; // No compression needed
};

const generateClassicPDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 20;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "bold",
      size: sizing.heading.size,
      color: [17, 24, 39],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Header
  applyStyle(doc, { ...styles.heading, size: sizing.heading.size + 2 });
  doc.text(safeText(personalInfo.fullName), 105, yPos, { align: "center" });
  yPos += sizing.heading.lineHeight * 6;

  applyStyle(doc, styles.caption);
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);

  doc.text(contactInfo.join(" | "), 105, yPos, { align: "center" });
  yPos += sizing.caption.lineHeight * 5;

  // Draw a separator line
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 5;

  // Summary
  if (personalInfo.summary) {
    applyStyle(doc, styles.subheading);
    doc.text("Professional Summary", 20, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Truncate summary if too long
    const maxSummaryChars = contentLength.total > 2000 ? 300 : 500;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    applyStyle(doc, styles.body);
    const summaryLines = doc.splitTextToSize(summaryText, 170);
    doc.text(summaryLines, 20, yPos);
    yPos +=
      summaryLines.length * styles.body.lineHeight * 3 + sizing.spacing.section;
  }

  // Experience
  if (experience.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("Professional Experience", 20, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Calculate space per experience item
    const maxExperienceItems = experience.length > 3 ? 3 : experience.length;

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(exp.title), 20, yPos);

      // Date on right
      const dateText = `${safeText(exp.startDate)} - ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;
      doc.text(dateText, 190, yPos, { align: "right" });
      yPos += styles.body.lineHeight * 3;

      applyStyle(doc, styles.body);
      doc.text(
        `${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = contentLength.total > 2000 ? 150 : 300;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        const descLines = doc.splitTextToSize(descText, 170);
        const maxLines = contentLength.experienceCount > 2 ? 4 : 8;
        const linesToShow =
          descLines.length > maxLines ? maxLines : descLines.length;

        doc.text(descLines.slice(0, linesToShow), 20, yPos);
        yPos += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Education
  if (education.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("Education", 20, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Calculate space per education item
    const maxEducationItems = education.length > 2 ? 2 : education.length;

    education.slice(0, maxEducationItems).forEach((edu, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(edu.degree), 20, yPos);

      if (edu.graduationDate) {
        doc.text(edu.graduationDate, 190, yPos, { align: "right" });
      }
      yPos += styles.body.lineHeight * 3;

      applyStyle(doc, styles.body);
      doc.text(
        `${safeText(edu.school)}${edu.location ? ` • ${edu.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (edu.description && contentLength.total < 2500) {
        const maxEduDescChars = 150;
        const eduDescText = truncateIfNeeded(edu.description, maxEduDescChars);

        const eduDescLines = doc.splitTextToSize(eduDescText, 170);
        const maxEduLines = 3;
        const eduLinesToShow =
          eduDescLines.length > maxEduLines ? maxEduLines : eduDescLines.length;

        doc.text(eduDescLines.slice(0, eduLinesToShow), 20, yPos);
        yPos += eduLinesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxEducationItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Skills
  if (skills.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("Skills", 20, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Calculate remaining space
    const remainingHeight = 277 - yPos;
    const skillsPerLine = 3;
    const maxSkillCategories = skills.length > 3 ? 3 : skills.length;

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, { ...styles.body, style: "bold" });
        doc.text(skillCategory.category, 20, yPos);
        yPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        applyStyle(doc, styles.body);

        // Determine max skills to show
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 9); // Show at most 9 skills

        // Create a grid of skills
        for (let i = 0; i < maxSkills; i += skillsPerLine) {
          const rowSkills = skillItems.slice(i, i + skillsPerLine);
          const skillsText = rowSkills.join("  •  ");
          doc.text(skillsText, 20, yPos);
          yPos += styles.body.lineHeight * 3;
        }
      }

      if (index < maxSkillCategories - 1) {
        yPos += sizing.spacing.item;
      }
    });
  }
};

const generateModernPDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 0;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "bold",
      size: sizing.heading.size,
      color: [255, 255, 255],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Modern Header with colored background
  doc.setFillColor(37, 99, 235); // Blue
  doc.rect(0, 0, 210, 40, "F");

  // Name and contact info in header
  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 20, 20);

  applyStyle(doc, { ...styles.caption, color: [255, 255, 255] });
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);

  const contactText = contactInfo.join(" | ");
  doc.text(contactText, 20, 30);

  yPos = 50;

  // Summary
  if (personalInfo.summary) {
    applyStyle(doc, styles.subheading);

    // Create a blue icon
    doc.setFillColor(37, 99, 235);
    doc.circle(25, yPos - 1, 3, "F");

    doc.text("Professional Summary", 30, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Truncate summary if too long
    const maxSummaryChars = contentLength.total > 2000 ? 250 : 400;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    applyStyle(doc, styles.body);
    const summaryLines = doc.splitTextToSize(summaryText, 160);
    doc.text(summaryLines, 30, yPos);
    yPos +=
      summaryLines.length * styles.body.lineHeight * 3 + sizing.spacing.section;
  }

  // Experience
  if (experience.length > 0) {
    applyStyle(doc, styles.subheading);

    // Create a blue icon
    doc.setFillColor(37, 99, 235);
    doc.circle(25, yPos - 1, 3, "F");

    doc.text("Experience", 30, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Calculate space per experience item
    const maxExperienceItems = experience.length > 3 ? 3 : experience.length;

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(exp.title), 30, yPos);

      // Date on right
      const dateText = `${safeText(exp.startDate)} - ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;
      doc.text(dateText, 180, yPos, { align: "right" });
      yPos += styles.body.lineHeight * 3;

      // Company with blue text
      doc.setTextColor(37, 99, 235);
      doc.text(
        `${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ""}`,
        30,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = contentLength.total > 2000 ? 120 : 250;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        // Reset text color
        doc.setTextColor(55, 65, 81);

        const descLines = doc.splitTextToSize(descText, 160);
        const maxLines = contentLength.experienceCount > 2 ? 3 : 6;
        const linesToShow =
          descLines.length > maxLines ? maxLines : descLines.length;

        doc.text(descLines.slice(0, linesToShow), 30, yPos);
        yPos += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Education
  if (education.length > 0) {
    applyStyle(doc, styles.subheading);

    // Create a blue icon
    doc.setFillColor(37, 99, 235);
    doc.circle(25, yPos - 1, 3, "F");

    doc.text("Education", 30, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Create a two-column grid for education if we have more than one
    const columnWidth = 75;
    const columnGap = 20;
    const secondColumnX = 30 + columnWidth + columnGap;

    education.slice(0, 2).forEach((edu, index) => {
      const columnX = index % 2 === 0 ? 30 : secondColumnX;
      const currentYPos =
        index % 2 === 0 ? yPos : yPos - styles.body.lineHeight * 6;

      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(edu.degree), columnX, currentYPos, {
        maxWidth: columnWidth,
      });

      const degreeHeight = doc.getTextDimensions(safeText(edu.degree), {
        maxWidth: columnWidth,
      }).h;

      // Blue text for school
      doc.setTextColor(37, 99, 235);
      doc.text(
        `${safeText(edu.school)}`,
        columnX,
        currentYPos + styles.body.lineHeight * 3,
        { maxWidth: columnWidth }
      );

      if (edu.graduationDate) {
        // Gray text for date
        doc.setTextColor(107, 114, 128);
        doc.text(
          edu.graduationDate,
          columnX,
          currentYPos + styles.body.lineHeight * 6,
          { maxWidth: columnWidth }
        );
      }

      // Add to Y position only after every 2 items or at the end
      if (index % 2 === 1 || index === education.length - 1) {
        yPos += styles.body.lineHeight * 9;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Skills
  if (skills.length > 0) {
    applyStyle(doc, styles.subheading);

    // Create a blue icon
    doc.setFillColor(37, 99, 235);
    doc.circle(25, yPos - 1, 3, "F");

    doc.text("Skills", 30, yPos);
    yPos += sizing.subheading.lineHeight * 4;

    // Create a grid of skill categories
    const maxSkillCategories = skills.length > 2 ? 2 : skills.length;

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, { ...styles.body, style: "bold" });
        doc.text(skillCategory.category, 30, yPos);
        yPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        applyStyle(doc, styles.body);
        doc.setTextColor(37, 99, 235);

        // Create a grid of skills with 3 per row
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 6); // Show at most 6 skills
        const skillsPerRow = 2;

        for (let i = 0; i < maxSkills; i += skillsPerRow) {
          const skillX = i % skillsPerRow === 0 ? 30 : 110;
          const currentYPos =
            yPos + Math.floor(i / skillsPerRow) * (styles.body.lineHeight * 3);

          const skill = skillItems[i];
          if (skill) {
            doc.text("• " + skill, skillX, currentYPos);
          }

          if (i + 1 < maxSkills) {
            const nextSkill = skillItems[i + 1];
            if (nextSkill && (i + 1) % skillsPerRow !== 0) {
              doc.text("• " + nextSkill, skillX + 80, currentYPos);
            }
          }
        }

        yPos +=
          Math.ceil(maxSkills / skillsPerRow) * (styles.body.lineHeight * 3);
      }

      if (index < maxSkillCategories - 1) {
        yPos += sizing.spacing.item;
      }
    });
  }
};

const generateMinimalPDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 30;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "light",
      size: sizing.heading.size + 2,
      color: [17, 24, 39],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "light",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Header - minimalist style
  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 20, yPos);
  yPos += styles.heading.lineHeight * 4;

  // Contact info with subtle separator
  applyStyle(doc, styles.caption);
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);

  doc.text(contactInfo.join(" | "), 20, yPos);
  yPos += styles.caption.lineHeight * 4;

  // Subtle divider
  doc.setDrawColor(229, 231, 235);
  doc.setLineWidth(0.2);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  // Summary
  if (personalInfo.summary) {
    applyStyle(doc, styles.subheading);
    doc.text("PROFILE", 20, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Truncate summary if too long
    const maxSummaryChars = contentLength.total > 2000 ? 250 : 400;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    applyStyle(doc, styles.body);
    const summaryLines = doc.splitTextToSize(summaryText, 170);
    doc.text(summaryLines, 20, yPos);
    yPos +=
      summaryLines.length * styles.body.lineHeight * 3 + sizing.spacing.section;
  }

  // Experience
  if (experience.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("EXPERIENCE", 20, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Calculate space per experience item
    const maxExperienceItems = experience.length > 3 ? 3 : experience.length;

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      // Two column layout
      applyStyle(doc, { ...styles.body, style: "medium" });

      // Title on left
      doc.text(safeText(exp.title), 20, yPos);

      // Date on right
      const dateText = `${safeText(exp.startDate)} — ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;
      doc.text(dateText, 190, yPos, { align: "right" });
      yPos += styles.body.lineHeight * 3;

      // Company in gray
      applyStyle(doc, { ...styles.caption, color: [107, 114, 128] });
      doc.text(
        `${safeText(exp.company)}${exp.location ? ` · ${exp.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = contentLength.total > 2000 ? 100 : 200;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        applyStyle(doc, styles.body);
        const descLines = doc.splitTextToSize(descText, 170);
        const maxLines = contentLength.experienceCount > 2 ? 3 : 6;
        const linesToShow =
          descLines.length > maxLines ? maxLines : descLines.length;

        doc.text(descLines.slice(0, linesToShow), 20, yPos);
        yPos += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Education
  if (education.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("EDUCATION", 20, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Calculate space per education item
    const maxEducationItems = education.length > 2 ? 2 : education.length;

    education.slice(0, maxEducationItems).forEach((edu, index) => {
      applyStyle(doc, { ...styles.body, style: "medium" });

      // Degree on left
      doc.text(safeText(edu.degree), 20, yPos);

      // Date on right
      if (edu.graduationDate) {
        doc.text(edu.graduationDate, 190, yPos, { align: "right" });
      }
      yPos += styles.body.lineHeight * 3;

      // School in gray
      applyStyle(doc, { ...styles.caption, color: [107, 114, 128] });
      doc.text(
        `${safeText(edu.school)}${edu.location ? ` · ${edu.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (index < maxEducationItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Skills section for Minimal template
  if (skills.length > 0) {
    applyStyle(doc, styles.subheading);
    doc.text("SKILLS", 20, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Create a compact skills display for minimal template
    // Show up to 3 skill categories
    const maxSkillCategories = skills.length > 3 ? 3 : skills.length;

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, { ...styles.body, style: "medium" });
        doc.text(skillCategory.category, 20, yPos);
        yPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        // Simple inline display for minimal style
        applyStyle(doc, styles.body);

        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 10);
        const truncatedSkills = skillItems.slice(0, maxSkills);

        // Join skills with dots
        const skillsText = truncatedSkills.join(" • ");

        // Wrap text if needed
        const skillLines = doc.splitTextToSize(skillsText, 170);
        doc.text(skillLines, 20, yPos);
        yPos += skillLines.length * styles.body.lineHeight * 2.5;
      }

      if (index < maxSkillCategories - 1) {
        yPos += sizing.spacing.item / 2; // Less spacing between categories for minimal
      }
    });
  }
};

const generateTechnicalPDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 20;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "courier",
      style: "bold",
      size: sizing.heading.size,
      color: [17, 24, 39],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "courier",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "courier",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "courier",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
    code: {
      family: "courier",
      style: "normal",
      size: sizing.body.size,
      color: [79, 70, 229], // indigo-600
      lineHeight: sizing.body.lineHeight,
    },
  };

  // Technical Header with bordered box
  doc.setDrawColor(229, 231, 235); // border-gray-200
  doc.setLineWidth(0.5);
  doc.rect(20, yPos - 5, 170, 30);

  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 25, yPos);
  yPos += styles.heading.lineHeight * 4;

  // Contact info in command line style
  applyStyle(doc, styles.caption);
  if (personalInfo.email) {
    doc.text("> email: " + personalInfo.email, 25, yPos);
    yPos += styles.caption.lineHeight * 3;
  }

  if (personalInfo.phone) {
    doc.text("> phone: " + personalInfo.phone, 25, yPos);
    yPos += styles.caption.lineHeight * 3;
  }

  if (personalInfo.location) {
    doc.text("> location: " + personalInfo.location, 25, yPos);
    yPos += styles.caption.lineHeight * 3;
  }

  yPos += 5;

  // Summary as code comment
  if (personalInfo.summary) {
    applyStyle(doc, { ...styles.body, color: [16, 185, 129] }); // emerald-600
    doc.text("/**", 20, yPos);
    yPos += styles.body.lineHeight * 3;

    // Truncate summary if too long
    const maxSummaryChars = contentLength.total > 2000 ? 200 : 300;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    // Split and add each line as a comment
    const summaryLines = doc.splitTextToSize(" * " + summaryText, 170);
    summaryLines.forEach((line) => {
      doc.text(line, 20, yPos);
      yPos += styles.body.lineHeight * 3;
    });

    doc.text(" */", 20, yPos);
    yPos += styles.body.lineHeight * 4;
  }

  // Now create a two-column layout - Skills and Education on left, Experience on right
  const leftColumnWidth = 60;
  const rightColumnX = 95;
  let leftColYPos = yPos;
  let rightColYPos = yPos;

  // Skills in left column
  if (skills.length > 0) {
    applyStyle(doc, { ...styles.code, style: "bold" });
    doc.text("interface Skills {", 20, leftColYPos);
    leftColYPos += styles.subheading.lineHeight * 3;

    const maxSkillCategories = skills.length > 3 ? 3 : skills.length;

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        doc.setTextColor(16, 185, 129); // emerald-600
        doc.text("  type " + skillCategory.category + " = [", 20, leftColYPos);
        leftColYPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        applyStyle(doc, styles.body);

        // Show up to 6 skills per category
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 6);

        skillItems.slice(0, maxSkills).forEach((skill, skillIndex) => {
          let skillText = `    "${skill}"`;
          if (skillIndex < maxSkills - 1) {
            skillText += ",";
          }

          doc.text(skillText, 20, leftColYPos);
          leftColYPos += styles.body.lineHeight * 2.5;
        });

        doc.text("  ]", 20, leftColYPos);
        leftColYPos += styles.body.lineHeight * 3;
      }
    });

    doc.text("}", 20, leftColYPos);
    leftColYPos += sizing.spacing.section;
  }

  // Education in left column if space remains
  if (education.length > 0 && leftColYPos < 270) {
    applyStyle(doc, { ...styles.code, style: "bold", color: [124, 58, 237] }); // purple-600
    doc.text("class Education {", 20, leftColYPos);
    leftColYPos += styles.subheading.lineHeight * 3;

    const maxEducationItems = Math.min(education.length, 2);

    education.slice(0, maxEducationItems).forEach((edu, index) => {
      applyStyle(doc, { ...styles.body, color: [124, 58, 237] }); // purple-600
      doc.text("  const " + safeText(edu.degree), 20, leftColYPos);
      leftColYPos += styles.body.lineHeight * 3;

      applyStyle(doc, styles.caption);
      doc.text("    @ " + safeText(edu.school), 20, leftColYPos);
      leftColYPos += styles.body.lineHeight * 3;

      if (edu.graduationDate) {
        doc.text("    " + edu.graduationDate, 20, leftColYPos);
        leftColYPos += styles.body.lineHeight * 3;
      }
    });

    doc.text("}", 20, leftColYPos);
  }

  // Experience in right column
  if (experience.length > 0) {
    applyStyle(doc, { ...styles.code, style: "bold", color: [37, 99, 235] }); // blue-600
    doc.text("function getExperience() {", rightColumnX, rightColYPos);
    rightColYPos += styles.subheading.lineHeight * 3;

    const maxExperienceItems = Math.min(experience.length, 3);

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      doc.setFillColor(247, 250, 252); // bg-gray-50
      doc.setDrawColor(229, 231, 235); // border-gray-200
      doc.roundedRect(rightColumnX, rightColYPos - 2, 100, 22, 1, 1, "FD");

      applyStyle(doc, { ...styles.body, color: [37, 99, 235] }); // blue-600
      doc.text(
        "  const " + safeText(exp.title),
        rightColumnX + 3,
        rightColYPos
      );
      rightColYPos += styles.body.lineHeight * 3;

      applyStyle(doc, styles.caption);
      doc.text(
        "    @ " + safeText(exp.company),
        rightColumnX + 3,
        rightColYPos
      );
      rightColYPos += styles.body.lineHeight * 3;

      // Date in technical format
      const dateText = `${safeText(exp.startDate)} → ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;
      doc.text("    " + dateText, rightColumnX + 3, rightColYPos);
      rightColYPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = 150;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        // Show first part of description with code-like formatting
        const descLines = doc.splitTextToSize(descText, 90);
        const maxLines = 3;
        const linesToShow = Math.min(descLines.length, maxLines);

        for (let i = 0; i < linesToShow; i++) {
          doc.text("    > " + descLines[i], rightColumnX + 3, rightColYPos);
          rightColYPos += styles.body.lineHeight * 2.5;
        }
      }

      rightColYPos += 2;
    });

    doc.text("}", rightColumnX, rightColYPos);
  }
};

const generateProfessionalPDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 20;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "bold",
      size: sizing.heading.size + 1,
      color: [17, 24, 39],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Header with border
  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 105, yPos, { align: "center" });
  yPos += styles.heading.lineHeight * 4;

  // Contact info centered
  applyStyle(doc, styles.caption);
  const contactInfo = [];
  if (personalInfo.email) contactInfo.push(personalInfo.email);
  if (personalInfo.phone) contactInfo.push(personalInfo.phone);
  if (personalInfo.location) contactInfo.push(personalInfo.location);

  doc.text(contactInfo.join(" • "), 105, yPos, { align: "center" });
  yPos += styles.caption.lineHeight * 4;

  // Border line
  doc.setDrawColor(37, 99, 235); // border-blue-600
  doc.setLineWidth(0.5);
  doc.line(20, yPos, 190, yPos);
  yPos += 8;

  // Summary
  if (personalInfo.summary) {
    applyStyle(doc, styles.subheading);

    // Blue accent for section heading
    doc.setDrawColor(37, 99, 235); // border-blue-600
    doc.setLineWidth(2);
    doc.line(20, yPos + 4, 30, yPos + 4);

    doc.text("Professional Summary", 40, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Truncate summary if too long
    const maxSummaryChars = contentLength.total > 2000 ? 250 : 400;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    applyStyle(doc, styles.body);
    const summaryLines = doc.splitTextToSize(summaryText, 170);
    doc.text(summaryLines, 20, yPos);
    yPos +=
      summaryLines.length * styles.body.lineHeight * 3 + sizing.spacing.section;
  }

  // Experience
  if (experience.length > 0) {
    applyStyle(doc, styles.subheading);

    // Blue accent for section heading
    doc.setDrawColor(37, 99, 235); // border-blue-600
    doc.setLineWidth(2);
    doc.line(20, yPos + 4, 30, yPos + 4);

    doc.text("Professional Experience", 40, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Calculate space per experience item
    const maxExperienceItems = experience.length > 3 ? 3 : experience.length;

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });

      // Create a flex layout with title and date
      doc.text(safeText(exp.title), 20, yPos);

      // Date on right with proper formatting
      const dateText = `${safeText(exp.startDate)} - ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;

      // Measure text to avoid overlap
      const titleWidth = doc.getTextWidth(safeText(exp.title));
      const dateWidth = doc.getTextWidth(dateText);

      // Ensure date doesn't overlap with title
      const dateX = Math.max(190, 30 + titleWidth + 20);
      doc.text(dateText, dateX, yPos, { align: "right" });
      yPos += styles.body.lineHeight * 3;

      // Company with blue highlight
      doc.setTextColor(37, 99, 235); // text-blue-600
      doc.text(
        `${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = contentLength.total > 2000 ? 120 : 250;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        // Reset text color
        doc.setTextColor(55, 65, 81); // text-gray-700

        const descLines = doc.splitTextToSize(descText, 170);
        const maxLines = contentLength.experienceCount > 2 ? 3 : 6;
        const linesToShow =
          descLines.length > maxLines ? maxLines : descLines.length;

        doc.text(descLines.slice(0, linesToShow), 20, yPos);
        yPos += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Education
  if (education.length > 0) {
    applyStyle(doc, styles.subheading);

    // Blue accent for section heading
    doc.setDrawColor(37, 99, 235); // border-blue-600
    doc.setLineWidth(2);
    doc.line(20, yPos + 4, 30, yPos + 4);

    doc.text("Education", 40, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Calculate space per education item
    const maxEducationItems = education.length > 2 ? 2 : education.length;

    education.slice(0, maxEducationItems).forEach((edu, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });

      // Title and date in same row
      doc.text(safeText(edu.degree), 20, yPos);

      if (edu.graduationDate) {
        doc.text(edu.graduationDate, 190, yPos, { align: "right" });
      }
      yPos += styles.body.lineHeight * 3;

      // School with blue highlight
      doc.setTextColor(37, 99, 235); // text-blue-600
      doc.text(
        `${safeText(edu.school)}${edu.location ? ` • ${edu.location}` : ""}`,
        20,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (index < maxEducationItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Skills
  if (skills.length > 0) {
    applyStyle(doc, styles.subheading);

    // Blue accent for section heading
    doc.setDrawColor(37, 99, 235); // border-blue-600
    doc.setLineWidth(2);
    doc.line(20, yPos + 4, 30, yPos + 4);

    doc.text("Skills", 40, yPos);
    yPos += styles.subheading.lineHeight * 4;

    // Calculate space for skills
    const maxSkillCategories = skills.length > 2 ? 2 : skills.length;

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, { ...styles.body, style: "bold" });
        doc.text(skillCategory.category, 20, yPos);
        yPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        applyStyle(doc, styles.body);

        // Create a grid for skills - up to 10 per category
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 10);
        const skillsPerRow = 3;

        for (let i = 0; i < maxSkills; i += skillsPerRow) {
          let rowText = "";

          for (let j = 0; j < skillsPerRow; j++) {
            if (i + j < maxSkills) {
              if (j > 0) rowText += "  •  ";
              rowText += skillItems[i + j];
            }
          }

          doc.text(rowText, 20, yPos);
          yPos += styles.body.lineHeight * 3;
        }
      }

      if (index < maxSkillCategories - 1) {
        yPos += sizing.spacing.item;
      }
    });
  }
};

const generateCreativePDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 20;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "bold",
      size: sizing.heading.size + 2,
      color: [255, 255, 255],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Creative header with gradient
  doc.setFillColor(79, 70, 229); // indigo-600
  doc.rect(0, 0, 210, 60, "F");

  // Add circle decoration
  doc.setFillColor(255, 255, 255, 0.1); // white with transparency
  doc.circle(180, 15, 20, "F");
  doc.circle(30, 55, 15, "F");

  // Name and contact in white
  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 20, yPos + 10);

  applyStyle(doc, { ...styles.caption, color: [255, 255, 255] });

  let contactYPos = yPos + 20;

  if (personalInfo.email) {
    doc.text(personalInfo.email, 20, contactYPos);
    contactYPos += styles.caption.lineHeight * 3;
  }

  if (personalInfo.phone) {
    doc.text(personalInfo.phone, 20, contactYPos);
    contactYPos += styles.caption.lineHeight * 3;
  }

  if (personalInfo.location) {
    doc.text(personalInfo.location, 20, contactYPos);
  }

  // Summary in header if it exists
  if (personalInfo.summary) {
    const maxSummaryChars = 150; // Very short for creative header
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    const summaryLines = doc.splitTextToSize(summaryText, 120);
    doc.text(summaryLines, 120, yPos + 30, { align: "right" });
  }

  yPos = 70;

  // Experience
  if (experience.length > 0) {
    applyStyle(doc, styles.subheading);

    // Creative underline with highlight
    doc.text("Experience", 20, yPos);

    doc.setFillColor(125, 211, 252, 0.5); // light-blue-300 with transparency
    doc.rect(20, yPos + 2, 40, 8, "F");

    yPos += styles.subheading.lineHeight * 4;

    // Calculate space per experience item
    const maxExperienceItems = experience.length > 3 ? 3 : experience.length;

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      // Add dot marker
      doc.setFillColor(79, 70, 229); // indigo-600
      doc.circle(25, yPos - 2, 2, "F");

      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(exp.title), 30, yPos);

      // Date on right
      const dateText = `${safeText(exp.startDate)} - ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;

      applyStyle(doc, styles.caption);
      doc.text(dateText, 190, yPos, { align: "right" });
      yPos += styles.body.lineHeight * 3;

      // Company with indigo highlight
      doc.setTextColor(79, 70, 229); // indigo-600
      doc.text(
        `${safeText(exp.company)}${exp.location ? ` • ${exp.location}` : ""}`,
        30,
        yPos
      );
      yPos += styles.body.lineHeight * 3;

      if (exp.description) {
        // Truncate description if needed
        const maxDescChars = contentLength.total > 2000 ? 100 : 200;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        // Reset text color
        doc.setTextColor(55, 65, 81); // text-gray-700

        const descLines = doc.splitTextToSize(descText, 160);
        const maxLines = contentLength.experienceCount > 2 ? 2 : 4;
        const linesToShow =
          descLines.length > maxLines ? maxLines : descLines.length;

        doc.text(descLines.slice(0, linesToShow), 30, yPos);
        yPos += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        yPos += sizing.spacing.item;
      }
    });

    yPos += sizing.spacing.section;
  }

  // Education with creative styling
  if (education.length > 0) {
    applyStyle(doc, styles.subheading);

    // Creative underline with highlight
    doc.text("Education", 20, yPos);

    doc.setFillColor(191, 219, 254, 0.5); // blue-200 with transparency
    doc.rect(20, yPos + 2, 40, 8, "F");

    yPos += styles.subheading.lineHeight * 4;

    // Two-column grid for education
    const educationColumns = 2;
    const columnWidth = 85;
    const columnGutter = 10;

    const maxEducationItems = Math.min(education.length, 4); // Show up to 4 education items

    for (let i = 0; i < maxEducationItems; i++) {
      const edu = education[i];
      const columnIndex = i % educationColumns;
      const rowIndex = Math.floor(i / educationColumns);

      const xPos = 20 + columnIndex * (columnWidth + columnGutter);
      const currentYPos = yPos + rowIndex * 30;

      // Add background rectangle
      doc.setFillColor(249, 250, 251); // bg-gray-50
      doc.setDrawColor(225, 229, 238); // light border color
      doc.roundedRect(xPos, currentYPos - 5, columnWidth, 25, 2, 2, "FD");

      // Add left border accent
      doc.setFillColor(79, 70, 229); // indigo-600
      doc.rect(xPos, currentYPos - 5, 2, 25, "F");

      applyStyle(doc, { ...styles.body, style: "bold" });

      // Truncate if too long
      const degreeText = truncateIfNeeded(safeText(edu.degree), 30);
      doc.text(degreeText, xPos + 5, currentYPos);

      applyStyle(doc, styles.caption);

      // School on next line
      const schoolText = truncateIfNeeded(safeText(edu.school), 35);
      doc.text(schoolText, xPos + 5, currentYPos + 7);

      // Date on bottom line
      if (edu.graduationDate) {
        doc.text(edu.graduationDate, xPos + 5, currentYPos + 14);
      }
    }

    // Update yPos based on number of rows
    const rows = Math.ceil(maxEducationItems / educationColumns);
    yPos += rows * 30 + sizing.spacing.section;
  }

  // Skills with creative badges
  if (skills.length > 0) {
    applyStyle(doc, styles.subheading);

    // Creative underline with highlight
    doc.text("Skills", 20, yPos);

    doc.setFillColor(221, 214, 254, 0.5); // purple-200 with transparency
    doc.rect(20, yPos + 2, 25, 8, "F");

    yPos += styles.subheading.lineHeight * 4;

    // Compact skill display for creative layout
    // Show up to 2 skill categories
    const maxSkillCategories = Math.min(skills.length, 2);

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, { ...styles.body, style: "bold" });
        doc.text(skillCategory.category, 20, yPos);
        yPos += styles.body.lineHeight * 3;
      }

      if (skillCategory.items?.length > 0) {
        // Create a creative badge layout for skills
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 12);
        const skillsPerRow = 3;

        let rowY = yPos;
        let badgeWidth = 50;
        let badgeGap = 8;

        for (let i = 0; i < maxSkills; i++) {
          const columnIndex = i % skillsPerRow;
          const xPos = 20 + columnIndex * (badgeWidth + badgeGap);

          if (columnIndex === 0 && i > 0) {
            rowY += 12; // Move to next row
          }

          // Draw gradient-like badge
          const colors = [
            [79, 70, 229], // indigo-600
            [124, 58, 237], // purple-600
            [219, 39, 119], // pink-600
          ];

          const colorIndex = i % colors.length;
          doc.setFillColor(
            colors[colorIndex][0],
            colors[colorIndex][1],
            colors[colorIndex][2]
          );
          doc.roundedRect(xPos, rowY - 4, badgeWidth, 10, 5, 5, "F");

          // Add skill text in white
          doc.setFontSize(sizing.caption.size);
          doc.setTextColor(255, 255, 255);

          // Center text in badge
          const text = skillItems[i];
          const textWidth =
            (doc.getStringUnitWidth(text) * doc.internal.getFontSize()) /
            doc.internal.scaleFactor;
          const textX = xPos + (badgeWidth - textWidth) / 2;

          doc.text(text, textX, rowY + 1);
        }

        // Update yPos based on number of rows
        const rows = Math.ceil(maxSkills / skillsPerRow);
        yPos = rowY + rows * 12;
      }

      if (index < maxSkillCategories - 1) {
        yPos += sizing.spacing.item;
      }
    });
  }
};

const generateExecutivePDF = (doc, data, fontSizes) => {
  const {
    personalInfo = {},
    experience = [],
    education = [],
    skills = [],
  } = data || {};
  let yPos = 20;

  // Calculate content to fit on one page
  const contentLength = calculateContentLength(data);
  const sizing = determineSizing(contentLength);

  // Apply dynamic styling
  const styles = {
    heading: {
      family: "helvetica",
      style: "bold",
      size: sizing.heading.size,
      color: [255, 255, 255],
      lineHeight: sizing.heading.lineHeight,
    },
    subheading: {
      family: "helvetica",
      style: "bold",
      size: sizing.subheading.size,
      color: [31, 41, 55],
      lineHeight: sizing.subheading.lineHeight,
    },
    body: {
      family: "helvetica",
      style: "normal",
      size: sizing.body.size,
      color: [55, 65, 81],
      lineHeight: sizing.body.lineHeight,
    },
    caption: {
      family: "helvetica",
      style: "normal",
      size: sizing.caption.size,
      color: [107, 114, 128],
      lineHeight: sizing.caption.lineHeight,
    },
  };

  // Header with dark background
  doc.setFillColor(31, 41, 55); // gray-800
  doc.rect(0, 0, 210, 40, "F");

  // Name and contact in white
  applyStyle(doc, styles.heading);
  doc.text(safeText(personalInfo.fullName), 20, yPos + 10);

  let contactX = 20;
  const contactY = yPos + 20;

  // Contact info in header row
  applyStyle(doc, { ...styles.caption, color: [209, 213, 219] }); // gray-300
  if (personalInfo.email) {
    doc.text(personalInfo.email, contactX, contactY);
    contactX += doc.getTextWidth(personalInfo.email) + 10;
  }

  if (personalInfo.phone) {
    doc.text(personalInfo.phone, contactX, contactY);
    contactX += doc.getTextWidth(personalInfo.phone) + 10;
  }

  if (personalInfo.location) {
    doc.text(personalInfo.location, contactX, contactY);
  }

  yPos = 50;

  // Two-column layout for executive template
  const leftColX = 20;
  const leftColWidth = 50;
  const rightColX = 80;
  const rightColWidth = 110;

  let leftColY = yPos;
  let rightColY = yPos;

  // Left column - Profile, Education, Skills

  // Profile/Summary
  if (personalInfo.summary) {
    applyStyle(doc, { ...styles.subheading, color: [31, 41, 55] });
    doc.text("PROFILE", leftColX, leftColY);

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(
      leftColX,
      leftColY + 3,
      leftColX + leftColWidth - 10,
      leftColY + 3
    );

    leftColY += styles.subheading.lineHeight * 3;

    // Truncate summary for limited space
    const maxSummaryChars = 200;
    const summaryText = truncateIfNeeded(personalInfo.summary, maxSummaryChars);

    applyStyle(doc, { ...styles.body, size: sizing.body.size - 0.5 });
    const summaryLines = doc.splitTextToSize(summaryText, leftColWidth);
    doc.text(summaryLines, leftColX, leftColY);
    leftColY +=
      summaryLines.length * styles.body.lineHeight * 2.5 +
      sizing.spacing.section / 2;
  }

  // Skills
  if (skills.length > 0) {
    applyStyle(doc, { ...styles.subheading, color: [31, 41, 55] });
    doc.text("SKILLS", leftColX, leftColY);

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(
      leftColX,
      leftColY + 3,
      leftColX + leftColWidth - 10,
      leftColY + 3
    );

    leftColY += styles.subheading.lineHeight * 3;

    // Compact skill display
    const maxSkillCategories = Math.min(skills.length, 4);

    skills.slice(0, maxSkillCategories).forEach((skillCategory, index) => {
      if (skillCategory.category) {
        applyStyle(doc, {
          ...styles.body,
          style: "bold",
          size: sizing.body.size - 0.5,
        });
        doc.text(skillCategory.category, leftColX, leftColY);
        leftColY += styles.body.lineHeight * 2;
      }

      if (skillCategory.items?.length > 0) {
        applyStyle(doc, { ...styles.body, size: sizing.body.size - 0.5 });

        // Show up to 4 skills per category
        const skillItems = skillCategory.items;
        const maxSkills = Math.min(skillItems.length, 4);

        for (let i = 0; i < maxSkills; i++) {
          doc.circle(leftColX + 2, leftColY - 1.5, 0.8, "F");
          doc.text(skillItems[i], leftColX + 5, leftColY);
          leftColY += styles.body.lineHeight * 2;
        }
      }

      if (index < maxSkillCategories - 1) {
        leftColY += 2;
      }
    });

    leftColY += sizing.spacing.section / 2;
  }

  // Education
  if (education.length > 0) {
    applyStyle(doc, { ...styles.subheading, color: [31, 41, 55] });
    doc.text("EDUCATION", leftColX, leftColY);

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(
      leftColX,
      leftColY + 3,
      leftColX + leftColWidth - 10,
      leftColY + 3
    );

    leftColY += styles.subheading.lineHeight * 3;

    // Education items
    const maxEducationItems = Math.min(education.length, 2);

    education.slice(0, maxEducationItems).forEach((edu, index) => {
      applyStyle(doc, {
        ...styles.body,
        style: "bold",
        size: sizing.body.size - 0.5,
      });

      // Truncate if needed
      const degreeText = truncateIfNeeded(safeText(edu.degree), 25);
      doc.text(degreeText, leftColX, leftColY);
      leftColY += styles.body.lineHeight * 2;

      applyStyle(doc, { ...styles.body, size: sizing.body.size - 0.5 });
      const schoolText = truncateIfNeeded(safeText(edu.school), 25);
      doc.text(schoolText, leftColX, leftColY);
      leftColY += styles.body.lineHeight * 2;

      if (edu.graduationDate) {
        applyStyle(doc, { ...styles.caption, size: sizing.caption.size - 0.5 });
        doc.text(edu.graduationDate, leftColX, leftColY);
        leftColY += styles.caption.lineHeight * 2;
      }

      if (index < maxEducationItems - 1) {
        leftColY += 2;
      }
    });
  }

  // Right column - Professional Experience
  if (experience.length > 0) {
    applyStyle(doc, { ...styles.subheading, color: [31, 41, 55] });
    doc.text("PROFESSIONAL EXPERIENCE", rightColX, rightColY);

    // Divider line
    doc.setDrawColor(229, 231, 235);
    doc.setLineWidth(0.5);
    doc.line(
      rightColX,
      rightColY + 3,
      rightColX + rightColWidth - 20,
      rightColY + 3
    );

    rightColY += styles.subheading.lineHeight * 3;

    // Calculate space per experience item
    const maxExperienceItems = Math.min(experience.length, 4);

    experience.slice(0, maxExperienceItems).forEach((exp, index) => {
      applyStyle(doc, { ...styles.body, style: "bold" });
      doc.text(safeText(exp.title), rightColX, rightColY);
      rightColY += styles.body.lineHeight * 3;

      // Company with dates
      applyStyle(doc, styles.body);
      doc.text(safeText(exp.company), rightColX, rightColY);

      const dateText = `${safeText(exp.startDate)} - ${
        exp.current ? "Present" : safeText(exp.endDate)
      }`;
      const dateWidth = doc.getTextWidth(dateText);

      doc.setTextColor(107, 114, 128); // text-gray-500
      doc.text(dateText, rightColX + rightColWidth - dateWidth, rightColY);
      rightColY += styles.body.lineHeight * 3;

      if (exp.location) {
        doc.setTextColor(107, 114, 128); // text-gray-500
        doc.text(exp.location, rightColX, rightColY);
        rightColY += styles.body.lineHeight * 2;
      }

      if (exp.description) {
        // Truncate description for space
        const maxDescChars = contentLength.total > 2000 ? 100 : 200;
        const descText = truncateIfNeeded(exp.description, maxDescChars);

        doc.setTextColor(55, 65, 81); // text-gray-700
        const descLines = doc.splitTextToSize(descText, rightColWidth);
        const maxLines = contentLength.experienceCount > 3 ? 2 : 4;
        const linesToShow = Math.min(descLines.length, maxLines);

        doc.text(descLines.slice(0, linesToShow), rightColX, rightColY);
        rightColY += linesToShow * styles.body.lineHeight * 2.5;
      }

      if (index < maxExperienceItems - 1) {
        rightColY += sizing.spacing.item;
      }
    });
  }

  // Add a light gray background to the left column
  doc.setFillColor(249, 250, 251); // bg-gray-50
  doc.setDrawOpacity(0.5);
  doc.rect(
    0,
    40,
    leftColX + leftColWidth + 5,
    doc.internal.pageSize.height,
    "F"
  );
  doc.setDrawOpacity(1);
};

export const generatePDF = (data, template = "classic") => {
  const doc = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });

  // Calculate content length to determine appropriate font sizes
  const contentLength = calculateContentLength(data);
  const fontSizes = determineSizing(contentLength);

  // Call the appropriate template function
  switch (template.toLowerCase()) {
    case "classic":
      generateClassicPDF(doc, data, fontSizes);
      break;
    case "modern":
      generateModernPDF(doc, data, fontSizes);
      break;
    case "minimal":
      generateMinimalPDF(doc, data, fontSizes);
      break;
    case "technical":
      generateTechnicalPDF(doc, data, fontSizes);
      break;
    case "professional":
      generateProfessionalPDF(doc, data, fontSizes);
      break;
    case "creative":
      generateCreativePDF(doc, data, fontSizes);
      break;
    case "executive":
      generateExecutivePDF(doc, data, fontSizes);
      break;
    default:
      generateClassicPDF(doc, data, fontSizes);
  }

  return doc;
};
