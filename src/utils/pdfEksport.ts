// utils/pdfExport.ts
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

interface ExportToPDFOptions {
  title?: string;
  filename?: string;
  pageOrientation?: 'portrait' | 'landscape';
  addDateToFilename?: boolean;
  includeTimestamp?: boolean;
  quality?: number; // 0.1 to 1.0
  scale?: number; // 1 to 5
  margin?: number; // in mm
}

export const exportComponentToPDF = async (
  elementRef: React.RefObject<HTMLElement>,
  options: ExportToPDFOptions = {}
): Promise<boolean> => {
  if (!elementRef.current) return false;
  
  const {
    title,
    filename = 'export',
    pageOrientation = 'landscape',
    addDateToFilename = true,
    includeTimestamp = true,
    quality = 1.0,
    scale = 2,
    margin = 10
  } = options;
  
  try {
    // Create an empty div for capturing the component
    const captureContainer = document.createElement('div');
    captureContainer.style.position = 'absolute';
    captureContainer.style.left = '-9999px';
    captureContainer.style.top = '-9999px';
    
    // Clone the component to avoid modifying the original
    const componentClone = elementRef.current.cloneNode(true) as HTMLElement;
    
    // Apply any necessary styles for PDF rendering
    componentClone.style.backgroundColor = 'white';
    
    // Append the clone to our container
    captureContainer.appendChild(componentClone);
    document.body.appendChild(captureContainer);
    
    // Capture as canvas
    const canvas = await html2canvas(componentClone, {
      scale: scale,
      useCORS: true,
      allowTaint: true,
      logging: false,
      backgroundColor: '#FFFFFF',
      imageTimeout: 15000
    });
    
    // Generate PDF
    const imgData = canvas.toDataURL('image/jpeg', quality);
    
    const orientation = pageOrientation === 'landscape' ? 'l' : 'p';
    const pdf = new jsPDF({
      orientation,
      unit: 'mm',
      format: 'a4'
    });
    
    // Get dimensions
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    // Calculate image dimensions to fit the page with margins
    const imgWidth = pdfWidth - (margin * 2);
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Add title if provided
    if (title) {
      pdf.setFontSize(16);
      pdf.text(title, margin, margin + 5);
      
      // Add timestamp if requested
      if (includeTimestamp) {
        pdf.setFontSize(10);
        pdf.text(`Generated on: ${new Date().toLocaleString()}`, margin, margin + 12);
      }
      
      // Add the image further down to accommodate the title
      pdf.addImage(imgData, 'JPEG', margin, margin + 20, imgWidth, imgHeight);
    } else {
      // Add the image at the top if no title
      pdf.addImage(imgData, 'JPEG', margin, margin, imgWidth, imgHeight);
    }
    
    // Generate filename with date if requested
    let finalFilename = filename;
    if (addDateToFilename) {
      const date = new Date();
      const dateStr = date.toISOString().split('T')[0];
      finalFilename = `${filename}-${dateStr}`;
    }
    
    // Save the PDF
    pdf.save(`${finalFilename}.pdf`);
    
    // Clean up
    document.body.removeChild(captureContainer);
    
    return true;
  } catch (error) {
    console.error('Error generating PDF:', error);
    return false;
  }
};

export const exportTableToPDF = async (
  tableRef: React.RefObject<HTMLTableElement>,
  title: string,
  filename: string = 'table-export'
): Promise<boolean> => {
  if (!tableRef.current) return false;
  
  try {
    const pdf = new jsPDF('landscape', 'mm', 'a4');
    
    // Add title
    pdf.setFontSize(16);
    pdf.text(title, 14, 15);
    
    // Add timestamp
    pdf.setFontSize(10);
    pdf.text(`Generated on: ${new Date().toLocaleString()}`, 14, 22);
    
    // Convert table to canvas and add to PDF
    const canvas = await html2canvas(tableRef.current, { 
      scale: 2,
      useCORS: true,
      logging: false
    });
    
    const imgData = canvas.toDataURL('image/png');
    
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = pdf.internal.pageSize.getHeight();
    
    const imgWidth = pdfWidth - 28;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 14, 30, imgWidth, imgHeight);
    
    // Generate filename with date
    const date = new Date();
    const dateStr = date.toISOString().split('T')[0];
    
    pdf.save(`${filename}-${dateStr}.pdf`);
    return true;
  } catch (error) {
    console.error('Error generating table PDF:', error);
    return false;
  }
};