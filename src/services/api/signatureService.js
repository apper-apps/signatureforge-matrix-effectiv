import signatures from "@/services/mockData/signatures.json";
import templates from "@/services/mockData/templates.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class SignatureService {
  constructor() {
    this.signatures = [...signatures];
    this.templates = [...templates];
  }

  // Signature CRUD operations
  async getAllSignatures() {
    await delay(300);
    return [...this.signatures];
  }

  async getSignatureById(id) {
    await delay(200);
    const signature = this.signatures.find(s => s.Id === parseInt(id));
    if (!signature) {
      throw new Error(`Signature with Id ${id} not found`);
    }
    return { ...signature };
  }

  async createSignature(signatureData) {
    await delay(400);
    const highestId = Math.max(...this.signatures.map(s => s.Id), 0);
    const newSignature = {
      ...signatureData,
      Id: highestId + 1,
      lastModified: new Date().toISOString()
    };
    this.signatures.push(newSignature);
    return { ...newSignature };
  }

  async updateSignature(id, updates) {
    await delay(350);
    const index = this.signatures.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Signature with Id ${id} not found`);
    }
    this.signatures[index] = {
      ...this.signatures[index],
      ...updates,
      Id: parseInt(id),
      lastModified: new Date().toISOString()
    };
    return { ...this.signatures[index] };
  }

  async deleteSignature(id) {
    await delay(250);
    const index = this.signatures.findIndex(s => s.Id === parseInt(id));
    if (index === -1) {
      throw new Error(`Signature with Id ${id} not found`);
    }
    const deleted = this.signatures.splice(index, 1)[0];
    return { ...deleted };
  }

  // Template operations
  async getAllTemplates() {
    await delay(300);
    return [...this.templates];
  }

  async getTemplateById(id) {
    await delay(200);
    const template = this.templates.find(t => t.Id === parseInt(id));
    if (!template) {
      throw new Error(`Template with Id ${id} not found`);
    }
    return { ...template };
  }

  // Parsing operations
  async parseHtmlSignature(htmlContent) {
    await delay(500);
    
    try {
      const parser = new DOMParser();
      const doc = parser.parseFromString(htmlContent, "text/html");
      
      const elements = [];
      const images = [];
      let elementId = 1;

      // Extract text content
      const textNodes = this.extractTextNodes(doc);
      textNodes.forEach(({ text, element }) => {
        const elementType = this.detectElementType(text);
        if (elementType) {
          elements.push({
            Id: elementId++,
            type: elementType.type,
            label: elementType.label,
            value: text,
            xpath: this.getXPath(element),
            validation: elementType.type
          });
        }
      });

// Extract images and add unique identifiers
      const imgElements = doc.querySelectorAll("img");
      imgElements.forEach((img, index) => {
        const imageId = index + 1;
        
        // Add unique data attribute to the image for precise targeting
        img.setAttribute('data-image-id', imageId);
        
        images.push({
          Id: imageId,
          type: this.detectImageType(img),
          src: img.src,
          base64: img.src,
          dimensions: {
            width: parseInt(img.width) || 100,
            height: parseInt(img.height) || 100
          }
        });
      });

      // Update HTML content with the modified DOM
      htmlContent = doc.documentElement.outerHTML;

      return {
        Id: Date.now(),
        htmlContent: htmlContent,
        elements: elements,
        images: images,
        styles: this.extractStyles(htmlContent),
        metadata: {
          parsed: new Date().toISOString(),
          elementCount: elements.length,
          imageCount: images.length
        }
      };
    } catch (error) {
      throw new Error("Failed to parse HTML signature: " + error.message);
    }
  }

// Helper methods
  extractTextNodes(doc) {
    const textNodes = [];
    
    // Simple text extraction using regex patterns
    const textPattern = />([^<]+)</g;
    let match;
    
    while ((match = textPattern.exec(doc.documentElement.innerHTML || '')) !== null) {
      const text = match[1].trim();
      if (text && text.length > 2 && !this.isWhitespaceOnly(text)) {
        textNodes.push({
          text,
          element: { tagName: 'span' } // Mock element for compatibility
        });
      }
    }
    
    return textNodes;
  }

detectElementType(text) {
    const patterns = [
      { type: "name", regex: /^[A-Za-z\s]{2,40}$/, label: "Full Name" },
      { type: "title", regex: /^[A-Za-z\s\-,&]{3,50}$/, label: "Job Title" },
      { type: "email", regex: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, label: "Email Address" },
      { type: "phone", regex: /^[+]?[\d\s\-()]{10,20}$/, label: "Phone Number" },
      { type: "website", regex: /^(https?:\/\/)?(www\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}/, label: "Website" }
    ];
    for (const pattern of patterns) {
      if (pattern.regex.test(text)) {
        return pattern;
      }
    }
    return null;
  }

  detectImageType(img) {
    const alt = (img.alt || "").toLowerCase();
    const src = (img.src || "").toLowerCase();
    
    if (alt.includes("logo") || src.includes("logo")) {
      return "logo";
    }
    if (alt.includes("profile") || alt.includes("photo") || src.includes("profile")) {
      return "profile";
    }
    return "image";
  }

  getXPath(element) {
    const parts = [];
    while (element && element.nodeType === 1) {
      let index = 1;
      let sibling = element.previousSibling;
      while (sibling) {
        if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
          index++;
        }
        sibling = sibling.previousSibling;
      }
      parts.unshift(`${element.tagName.toLowerCase()}[${index}]`);
      element = element.parentElement;
    }
    return "/" + parts.join("/");
  }

  extractStyles(html) {
    const styleMatch = html.match(/<style[^>]*>([\s\S]*?)<\/style>/i);
    return styleMatch ? styleMatch[1] : "";
  }

  isWhitespaceOnly(text) {
    return /^\s*$/.test(text);
  }

  // Export operations
  async exportSignature(signature, format = "html") {
    await delay(300);
    
    if (format === "html") {
      return {
        content: signature.htmlContent,
        filename: `signature-${Date.now()}.html`,
        mimeType: "text/html"
      };
    }
    
    throw new Error(`Export format "${format}" not supported`);
  }

  // Validation operations
  async validateSignature(htmlContent) {
    await delay(200);
    
    const issues = [];
    const warnings = [];

    // Check for basic HTML structure
    if (!htmlContent.includes("<") || !htmlContent.includes(">")) {
      issues.push("Invalid HTML structure");
    }

    // Check for inline styles (email client compatibility)
    if (!htmlContent.includes("style=")) {
      warnings.push("Consider using inline styles for better email client compatibility");
    }

    // Check for external resources
    if (htmlContent.includes('src="http') && !htmlContent.includes('src="data:')) {
      warnings.push("External images may not display in some email clients");
    }

    return {
      isValid: issues.length === 0,
      issues,
      warnings,
      compatibility: {
        outlook: issues.length === 0,
        gmail: issues.length === 0,
        appleMail: issues.length === 0
      }
    };
  }
}

export default new SignatureService();