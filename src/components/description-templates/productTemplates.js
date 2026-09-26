/**
 * Professional eCommerce Description Templates & Block Snippets for TechX Shop.
 * Designed to maximize conversions, highlight key specifications, and provide clear product information.
 */

export const TEMPLATE_CATEGORIES = [
  {
    id: "electronics",
    name: "Electronics & Gadgets",
    icon: "Smartphone",
    badge: "Popular",
    description: "Ideal for smartphones, power banks, smartwatches, chargers, and portable tech gadgets.",
    defaults: {
      tagline: "Engineered for high performance, portability, and reliable daily use.",
      features: [
        { title: "Rapid High-Speed Output", desc: "Equipped with intelligent power delivery ensuring safe and ultra-fast charging." },
        { title: "Aircraft-Grade Build", desc: "Durable aluminum-alloy and heat-resistant polycarbonate chassis." },
        { title: "Intelligent Circuit Protection", desc: "Multi-stage safeguard against over-voltage, short circuits, and extreme temperatures." },
        { title: "Pocket-Ready Compact Profile", desc: "Lightweight and ergonomic form factor crafted for travel and work." },
      ],
      specs: [
        { label: "Battery Capacity", value: "10,000mAh (38.5Wh) Lithium-Polymer" },
        { label: "Charging Standard", value: "PD 3.0 / QC 4.0+ Fast Charging (Up to 22.5W)" },
        { label: "Input Ports", value: "USB Type-C (5V/3A, 9V/2A)" },
        { label: "Output Ports", value: "1x USB-C + 2x USB-A SuperCharge" },
        { label: "Safety Certifications", value: "CE, FCC, RoHS Certified" },
        { label: "Dimensions & Weight", value: "142 × 68 × 16 mm | 215g" },
      ],
      boxItems: [
        "1x Main Product Unit",
        "1x High-Speed Braided USB-C to USB-C Cable",
        "1x User Instruction Manual",
        "1x Official TechX Warranty Card",
      ],
      warranty: "1 Year Official TechX Replacement Warranty with 7-Day Easy Return Policy.",
      faqs: [
        { q: "Is this product safe for daily use?", a: "Yes, it is certified with multi-layer smart temperature and over-voltage protection." },
        { q: "Does this support fast charging on both iOS and Android?", a: "Yes, full compatibility with both Apple PD and Android Quick Charge standards." },
      ],
    },
  },
  {
    id: "computing",
    name: "Computers & PC Hardware",
    icon: "Cpu",
    badge: "Pro Tech",
    description: "Ideal for laptops, processors, GPUs, motherboards, mechanical keyboards, and gaming monitors.",
    defaults: {
      tagline: "Unleash next-level productivity and gaming performance with cutting-edge architecture.",
      features: [
        { title: "High-Throughput Performance", desc: "Optimized for intensive workloads, 4K rendering, and high-FPS gaming." },
        { title: "Advanced Thermal Management", desc: "Dual heat pipes and vapor chamber cooling for sustained peak clock speeds." },
        { title: "Broad Multi-Platform Compatibility", desc: "Seamless driver support across Windows 11, macOS, and modern Linux distributions." },
        { title: "Low-Latency Connectivity", desc: "Ultra-fast response rates with gold-plated connectors and braided cabling." },
      ],
      specs: [
        { label: "Architecture / Chipset", value: "Next-Gen 4nm Process Technology" },
        { label: "Memory / Bandwidth", value: "Up to 6400 MT/s Dual-Channel Support" },
        { label: "Interface / Bus", value: "PCIe 4.0 / USB 3.2 Gen 2 Type-C" },
        { label: "Power Consumption", value: "Energy-efficient 65W TDP profile" },
        { label: "Operating Environment", value: "0°C to 45°C Operational Range" },
        { label: "Form Factor", value: "Standard ATX / Low-Profile Design" },
      ],
      boxItems: [
        "1x Hardware Component / Device",
        "1x Installation Bracket & Mounting Screws",
        "1x Quick Installation & Setup Guide",
        "1x 2-Year Manufacturer Warranty Certificate",
      ],
      warranty: "2 Years Official Manufacturer Warranty with Nationwide Authorized Service Center Support.",
      faqs: [
        { q: "What is the warranty coverage?", a: "Full 24 months replacement and service coverage for manufacturing defects." },
        { q: "Are drivers included or downloadable?", a: "Plug-and-play ready with optional companion software available from official site." },
      ],
    },
  },
  {
    id: "audio",
    name: "Audio & Wearables",
    icon: "Headphones",
    badge: "Acoustics",
    description: "Ideal for headphones, TWS earbuds, Bluetooth speakers, DACs, and smart wearable accessories.",
    defaults: {
      tagline: "Immerse yourself in rich, high-fidelity sound with deep dynamic bass and crystal-clear highs.",
      features: [
        { title: "Hybrid Active Noise Cancellation", desc: "Dual microphones suppress up to 40dB of ambient background chatter and traffic noise." },
        { title: "Hi-Res Audio Certified", desc: "Custom 40mm neodymium drivers deliver precision audio reproduction across all frequencies." },
        { title: "All-Day 35+ Hour Battery", desc: "Enjoy uninterrupted playback on a single charge with 10-minute fast charging giving 5 hours." },
        { title: "Ultra-Low Latency Gaming Mode", desc: "Synchronized audio-video feedback with less than 45ms transmission delay." },
      ],
      specs: [
        { label: "Driver Size", value: "40mm Dynamic Neodymium Magnet Drivers" },
        { label: "Frequency Response", value: "20Hz – 40,000Hz (Hi-Res Audio Profile)" },
        { label: "Wireless Protocol", value: "Bluetooth 5.3 + EDR (AAC, SBC, LDAC Codecs)" },
        { label: "Battery Playback Time", value: "Up to 35 Hours (ANC ON) / 50 Hours (ANC OFF)" },
        { label: "Microphones", value: "4x Beamforming Microphones with ENC Noise Filtering" },
        { label: "Charging Interface", value: "USB Type-C Fast Charge (5V/1A)" },
      ],
      boxItems: [
        "1x Wireless Audio Headset / Earbuds",
        "1x Protective Hard Shell Travel Case",
        "1x 3.5mm Gold-Plated Audio Cable",
        "1x Type-C Braided Charging Cable",
        "1x User Documentation & Warranty Slip",
      ],
      warranty: "1 Year Official Warranty covering internal hardware, drivers, and battery degradation.",
      faqs: [
        { q: "Can this connect to two devices simultaneously?", a: "Yes, Multipoint connection lets you pair phone and laptop at the same time." },
        { q: "Is it sweat and water resistant?", a: "Rated IPX5 splash and sweat resistant for gym workouts and light rain." },
      ],
    },
  },
  {
    id: "fashion",
    name: "Apparel & Lifestyle",
    icon: "Shirt",
    badge: "Lifestyle",
    description: "Ideal for apparel, sportswear, sneakers, leather accessories, bags, and fashion wear.",
    defaults: {
      tagline: "Crafted with premium sustainable materials designed for effortless style, all-day comfort, and longevity.",
      features: [
        { title: "Premium Breathable Fabric", desc: "Soft-touch combed organic cotton blended with moisture-wicking fibers." },
        { title: "Tailored Ergonomic Fit", desc: "Precision-cut silhouette providing comfortable range of motion for work and leisure." },
        { title: "Fade-Resistant Reactive Dyes", desc: "Vibrant coloration engineered to withstand frequent washing without shrinkage." },
        { title: "Reinforced Double Stitching", desc: "Heavy-duty seams along stress points ensuring lasting durability." },
      ],
      specs: [
        { label: "Material Composition", value: "95% Combed Organic Cotton, 5% Elastane Spandex" },
        { label: "Fabric Weight", value: "240 GSM Heavyweight Premium Weave" },
        { label: "Fit Style", value: "Modern Regular / Relaxed Fit" },
        { label: "Care Instructions", value: "Machine wash cold inside-out, tumble dry low, do not bleach" },
        { label: "Origin / Quality", value: "100% Authentic TechX Approved Craftsmanship" },
      ],
      boxItems: [
        "1x Packaged Garment / Product with Authentic Hang-Tag",
        "1x Eco-friendly Waterproof Dust Storage Bag",
        "1x Fabric Care & Sizing Reference Card",
      ],
      warranty: "7-Day Hassle-Free Size Exchange and 100% Genuine Material Guarantee.",
      faqs: [
        { q: "What if the size doesn't fit?", a: "We offer hassle-free 7-day size exchanges as long as tags are intact." },
        { q: "Does the color bleed during washing?", a: "No, our reactive dyeing technology locks color securely into fabric fibers." },
      ],
    },
  },
  {
    id: "homeOffice",
    name: "Home & Office Equipment",
    icon: "Home",
    badge: "Ergonomics",
    description: "Ideal for ergonomic chairs, standing desks, monitor arms, desk organizers, and smart home tools.",
    defaults: {
      tagline: "Transform your workspace with ergonomic excellence, sturdy craftsmanship, and modern aesthetics.",
      features: [
        { title: "Ergonomic Posture Support", desc: "Engineered to alleviate spine pressure and neck fatigue during extended working hours." },
        { title: "Heavy-Duty Structural Integrity", desc: "Reinforced solid steel frame tested for loads up to 150 kg." },
        { title: "Whisper-Quiet Operation", desc: "Smooth mechanical adjustment mechanisms that stay silent under pressure." },
        { title: "Eco-Friendly Scratch-Resistant Finish", desc: "Multi-layer powder coating that resists water rings, scratches, and stains." },
      ],
      specs: [
        { label: "Load Capacity", value: "Up to 150 kg (330 lbs) Heavy-Duty Support" },
        { label: "Materials", value: "Solid Cold-Rolled Carbon Steel & High-Density Foam" },
        { label: "Height / Angle Adjustability", value: "Multi-axis customizable with gas-lift cylinder" },
        { label: "Assembly Time", value: "Approximately 15 minutes with included hex tool" },
        { label: "Warranty Period", value: "3 Years Structural Frame Warranty" },
      ],
      boxItems: [
        "1x Main Modular Component Unit",
        "1x Complete Hardware Screws & Hex-Key Tool Kit",
        "1x Illustrated Step-by-Step Assembly Manual",
        "1x 3-Year Official Warranty Guarantee Document",
      ],
      warranty: "3 Years Comprehensive Frame and Mechanical Mechanism Warranty.",
      faqs: [
        { q: "Is assembly difficult?", a: "All necessary hex keys and illustrated instructions are included. Takes about 15 minutes." },
      ],
    },
  },
  {
    id: "minimalist",
    name: "Minimalist & Fast Conversion",
    icon: "Zap",
    badge: "High-Converting",
    description: "Short, punchy, mobile-optimized format designed for quick reading and high sales conversions.",
    defaults: {
      tagline: "The perfect balance of innovation, durability, and refined minimalist design.",
      features: [
        { title: "Original & Certified", desc: "100% authentic genuine product backed by official brand verification." },
        { title: "Optimized Performance", desc: "Engineered to deliver fast, reliable, and trouble-free daily operation." },
        { title: "Sleek Modern Finish", desc: "Minimalist aesthetic that seamlessly complements your existing setup." },
        { title: "Ready Out Of The Box", desc: "Complete set with all required accessories and immediate plug-and-play setup." },
      ],
      specs: [
        { label: "Product Class", value: "Authentic TechX Certified Series" },
        { label: "Build Quality", value: "High-grade components with rigorous QC testing" },
        { label: "Compatibility", value: "Universal compatibility with all standard platforms" },
        { label: "Warranty Coverage", value: "1 Year Official Replacement Guarantee" },
      ],
      boxItems: [
        "1x Main Product Unit",
        "1x Accessory Pack & Cables",
        "1x Quick Start Guide & Official Warranty Card",
      ],
      warranty: "1 Year Official Warranty & 7 Days Instant Defect Replacement Policy.",
      faqs: [
        { q: "Is this genuine?", a: "100% genuine with verifiable serial number and official invoice." },
      ],
    },
  },
];

/**
 * Individual modular blocks that merchants can insert into the editor with 1 click.
 */
export const MODULAR_BLOCKS = [
  {
    id: "specs_table",
    label: "Specifications Table",
    icon: "Table",
    description: "Clean responsive 2-column technical specifications matrix",
    getHtml: (title = "Product") => `
<div style="margin: 20px 0; overflow-x: auto;">
  <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">
    <thead>
      <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">
        <th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Specification</th>
        <th style="padding: 12px 16px; text-align: left; font-weight: 700; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Technical Detail</th>
      </tr>
    </thead>
    <tbody>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">Brand / Model</td>
        <td style="padding: 10px 16px; color: #475569;">TechX Official Series</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">Connectivity & I/O</td>
        <td style="padding: 10px 16px; color: #475569;">USB Type-C Fast Interface / Bluetooth 5.3</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">Materials & Finish</td>
        <td style="padding: 10px 16px; color: #475569;">Aerospace-grade Aluminum & Matte Polycarbonate</td>
      </tr>
      <tr style="border-bottom: 1px solid #e2e8f0; background-color: #f8fafc;">
        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">Certifications</td>
        <td style="padding: 10px 16px; color: #475569;">CE, FCC, RoHS Tested & Verified</td>
      </tr>
      <tr style="background-color: #ffffff;">
        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">Official Warranty</td>
        <td style="padding: 10px 16px; color: #059669; font-weight: 600;">1 Year Authorized Replacement Warranty</td>
      </tr>
    </tbody>
  </table>
</div>
<p></p>
`,
  },
  {
    id: "feature_grid",
    label: "Key Features & Highlights",
    icon: "Sparkles",
    description: "Structured bullet points with bold lead-ins for customer scannability",
    getHtml: () => `
<h3>Key Features & Highlights</h3>
<ul>
  <li><strong>Engineered for High Performance:</strong> Precision-crafted internals provide rapid response times, outstanding efficiency, and sustained reliability.</li>
  <li><strong>Ergonomic & Modern Aesthetics:</strong> Minimalist footprint designed to elevate comfort and blend seamlessly into any setup.</li>
  <li><strong>Universal Multi-Device Compatibility:</strong> Works flawlessly out of the box with Android, iOS, Windows, and macOS devices.</li>
  <li><strong>Smart Energy Management:</strong> Intelligent standby modes extend battery lifespan and prevent energy waste.</li>
</ul>
<p></p>
`,
  },
  {
    id: "box_checklist",
    label: "\"What's In The Box\" Checklist",
    icon: "Package",
    description: "Unboxing contents checklist with itemized list",
    getHtml: () => `
<h3>What’s In The Box</h3>
<ul>
  <li>1x Main Product Unit</li>
  <li>1x High-Speed Braided Connection Cable</li>
  <li>1x Illustrated Quick Start Guide</li>
  <li>1x Official TechX Warranty & Authenticity Certificate</li>
</ul>
<p></p>
`,
  },
  {
    id: "warranty_badge",
    label: "Warranty & Buyer Protection Box",
    icon: "ShieldCheck",
    description: "High-trust guarantee banner reassuring customers",
    getHtml: (brand = "TechX") => `
<div style="margin: 20px 0; padding: 18px 22px; border-radius: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #a7f3d0;">
  <div style="display: flex; align-items: flex-start; gap: 14px;">
    <div style="font-size: 24px; line-height: 1;">🛡️</div>
    <div>
      <h4 style="margin: 0 0 6px 0; color: #065f46; font-size: 15px; font-weight: 700;">100% Genuine Authentic Guarantee & Official Warranty</h4>
      <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.6;">
        Every ${brand} product sold on TechX Shop is 100% genuine and sourced directly from authorized channels. Includes official replacement warranty, 7-day hassle-free defect replacement, and priority technical consultation.
      </p>
    </div>
  </div>
</div>
<p></p>
`,
  },
  {
    id: "faq_section",
    label: "Frequently Asked Questions (FAQ)",
    icon: "HelpCircle",
    description: "Interactive Q&A block answering common customer doubts",
    getHtml: () => `
<h3>Frequently Asked Questions</h3>
<p><strong>Q1: Is this product 100% original and genuine?</strong></p>
<p>A: Yes. All items at TechX Shop are authentic, brand new, and come with manufacturer credentials and official warranty.</p>
<p><strong>Q2: How fast is shipping across Bangladesh?</strong></p>
<p>A: Dhaka Metro orders are delivered within 24 to 48 hours. Nationwide express delivery takes 2 to 4 business days with live parcel tracking.</p>
<p><strong>Q3: What if I receive a defective or damaged product?</strong></p>
<p>A: We have a hassle-free 7-day return and replacement policy. Simply notify our customer support team for an instant exchange.</p>
<p></p>
`,
  },
  {
    id: "pro_tip",
    label: "Pro Tip / Recommendation Callout",
    icon: "Info",
    description: "Highlighted callout box for expert advice or user tips",
    getHtml: () => `
<div style="margin: 18px 0; padding: 16px 20px; border-radius: 14px; background-color: #eff6ff; border-left: 4px solid #3b82f6;">
  <p style="margin: 0; color: #1e40af; font-size: 13px; line-height: 1.6;">
    <strong>💡 Pro Tip:</strong> For optimal battery longevity and peak performance, fully charge the device prior to initial use and utilize the certified cable included in the box.
  </p>
</div>
<p></p>
`,
  },
];

/**
 * Builds a complete high-converting HTML description string from structured input.
 */
export function buildCompleteDescriptionHtml({
  title = "TechX Premium Device",
  brand = "TechX Official",
  category = "electronics",
  tagline = "",
  features = [],
  specs = [],
  boxItems = [],
  warranty = "",
  faqs = [],
}) {
  const cat = TEMPLATE_CATEGORIES.find((c) => c.id === category) || TEMPLATE_CATEGORIES[0];
  const finalTagline = tagline || cat.defaults.tagline;
  const finalFeatures = features && features.length > 0 ? features : cat.defaults.features;
  const finalSpecs = specs && specs.length > 0 ? specs : cat.defaults.specs;
  const finalBoxItems = boxItems && boxItems.length > 0 ? boxItems : cat.defaults.boxItems;
  const finalWarranty = warranty || cat.defaults.warranty;
  const finalFaqs = faqs && faqs.length > 0 ? faqs : cat.defaults.faqs;

  let html = "";

  // 1. Hook / Lead Paragraph
  html += `<p>Crafted for discerning users who demand reliability, style, and uncompromising performance. The <strong>${title}</strong> by <em>${brand}</em> delivers an exceptional user experience, combining cutting-edge engineering with refined materials. ${finalTagline}</p>\n\n`;

  // 2. Key Features & Highlights
  if (finalFeatures && finalFeatures.length > 0) {
    html += `<h3>Key Features & Highlights</h3>\n<ul>\n`;
    finalFeatures.forEach((feat) => {
      const featTitle = typeof feat === "string" ? feat : feat.title || "";
      const featDesc = typeof feat === "string" ? "" : feat.desc ? `: ${feat.desc}` : "";
      html += `  <li><strong>${featTitle}</strong>${featDesc}</li>\n`;
    });
    html += `</ul>\n\n`;
  }

  // 3. Technical Specifications Table
  if (finalSpecs && finalSpecs.length > 0) {
    html += `<h3>Technical Specifications</h3>\n`;
    html += `<div style="margin: 18px 0; overflow-x: auto;">\n`;
    html += `  <table style="width: 100%; border-collapse: collapse; font-size: 14px; border: 1px solid #e2e8f0; border-radius: 12px; overflow: hidden;">\n`;
    html += `    <thead>\n`;
    html += `      <tr style="background-color: #f8fafc; border-bottom: 2px solid #e2e8f0;">\n`;
    html += `        <th style="padding: 11px 16px; text-align: left; font-weight: 700; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em; width: 35%;">Specification</th>\n`;
    html += `        <th style="padding: 11px 16px; text-align: left; font-weight: 700; color: #0f172a; font-size: 13px; text-transform: uppercase; letter-spacing: 0.05em;">Technical Detail</th>\n`;
    html += `      </tr>\n`;
    html += `    </thead>\n`;
    html += `    <tbody>\n`;
    finalSpecs.forEach((spec, idx) => {
      const isEven = idx % 2 === 1;
      const bg = isEven ? "#f8fafc" : "#ffffff";
      html += `      <tr style="border-bottom: 1px solid #e2e8f0; background-color: ${bg};">\n`;
      html += `        <td style="padding: 10px 16px; font-weight: 600; color: #1e293b;">${spec.label}</td>\n`;
      html += `        <td style="padding: 10px 16px; color: #475569;">${spec.value}</td>\n`;
      html += `      </tr>\n`;
    });
    html += `    </tbody>\n`;
    html += `  </table>\n`;
    html += `</div>\n\n`;
  }

  // 4. What's in the Box
  if (finalBoxItems && finalBoxItems.length > 0) {
    html += `<h3>What’s In The Box</h3>\n<ul>\n`;
    finalBoxItems.forEach((item) => {
      html += `  <li>${item}</li>\n`;
    });
    html += `</ul>\n\n`;
  }

  // 5. Warranty & Guarantee Trust Callout
  if (finalWarranty) {
    html += `<div style="margin: 20px 0; padding: 18px 22px; border-radius: 16px; background: linear-gradient(135deg, #f0fdf4 0%, #ecfdf5 100%); border: 1px solid #a7f3d0;">\n`;
    html += `  <div style="display: flex; align-items: flex-start; gap: 14px;">\n`;
    html += `    <div style="font-size: 24px; line-height: 1;">🛡️</div>\n`;
    html += `    <div>\n`;
    html += `      <h4 style="margin: 0 0 6px 0; color: #065f46; font-size: 15px; font-weight: 700;">Official Warranty & Authentic Guarantee</h4>\n`;
    html += `      <p style="margin: 0; color: #047857; font-size: 13px; line-height: 1.6;">${finalWarranty}</p>\n`;
    html += `    </div>\n`;
    html += `  </div>\n`;
    html += `</div>\n\n`;
  }

  // 6. Frequently Asked Questions
  if (finalFaqs && finalFaqs.length > 0) {
    html += `<h3>Frequently Asked Questions</h3>\n`;
    finalFaqs.forEach((faq, idx) => {
      html += `<p><strong>Q${idx + 1}: ${faq.q}</strong></p>\n`;
      html += `<p>A: ${faq.a}</p>\n`;
    });
  }

  return html;
}
