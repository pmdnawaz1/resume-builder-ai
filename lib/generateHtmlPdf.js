import html2pdf from 'html2pdf.js';

/**
 * Generates a PDF from an HTML element
 * @param {HTMLElement} element - The HTML element to convert to PDF
 * @param {string} filename - The name of the PDF file
 * @param {Object} options - Options for the PDF generation
 * @returns {Promise} - Promise that resolves when the PDF is generated
 */
export const generatePDFFromHTML = (element, filename, options = {}) => {
  // Default options with good quality settings
  const defaultOptions = {
    margin: [10, 10, 10, 10],
    filename: filename || 'resume.pdf',
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      dpi: 300,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  // Merge custom options with defaults
  const mergedOptions = { ...defaultOptions, ...options };

  // Return a promise
  return html2pdf()
    .set(mergedOptions)
    .from(element)
    .save();
};

/**
 * Captures an HTML element for preview without saving
 * @param {HTMLElement} element - The HTML element to convert
 * @param {Object} options - Options for the conversion
 * @returns {Promise<Blob>} - Promise that resolves with the PDF blob
 */
export const previewPDFFromHTML = async (element, options = {}) => {
  // Default options with good quality settings
  const defaultOptions = {
    margin: [10, 10, 10, 10],
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { 
      scale: 2,
      useCORS: true,
      letterRendering: true,
      logging: false,
      dpi: 300,
    },
    jsPDF: { 
      unit: 'mm', 
      format: 'a4', 
      orientation: 'portrait',
      compress: true
    }
  };

  // Merge custom options with defaults example
  const mergedOptions = { ...defaultOptions, ...options };

  // Return a promise that resolves with the PDF blob example 1
  return html2pdf()
    .set(mergedOptions)
    .from(element)
    .outputPdf('blob');
}; 