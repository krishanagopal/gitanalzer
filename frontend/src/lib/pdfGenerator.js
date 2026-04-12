import { toPng } from 'html-to-image';
import { jsPDF } from 'jspdf';

/**
 * Generates a professional PDF report from a given element.
 * Uses html-to-image for better compatibility with modern CSS (oklch, oklab) and SVGs.
 * @param {HTMLElement} element - The root element to capture
 * @param {string} filename - The name of the generated PDF
 */
export async function generatePDFReport(element, filename = 'GitAnalyzer-Report.pdf') {
  if (!element) return;

  // Add a class to the body during generation to help with styling
  document.body.classList.add('is-generating-pdf');
  
  // Force the PDF Report Mode class for capture
  element.classList.add('pdf-report-mode');

  try {
    // Small delay to ensure styles are applied and re-rendered by the browser
    await new Promise(resolve => setTimeout(resolve, 500));

    // Capture as PNG (more robust for complex CSS)
    const dataUrl = await toPng(element, {
      backgroundColor: '#ffffff',
      style: {
        transform: 'scale(1)',
        transformOrigin: 'top left',
      },
      quality: 1.0,
      pixelRatio: 2, // High resolution
    });
    
    // PDF calculation
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgProps = pdf.getImageProperties(dataUrl);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    
    const pageHeight = pdf.internal.pageSize.getHeight();
    let heightLeft = pdfHeight;
    let position = 0;

    // First page
    pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    // Multi-page handling
    while (heightLeft >= 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(dataUrl, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(filename);

  } catch (error) {
    console.error('PDF Generation failed:', error);
    // Fallback to basic print if capture fails
    window.print();
  } finally {
    // Clean up
    element.classList.remove('pdf-report-mode');
    document.body.classList.remove('is-generating-pdf');
  }
}
