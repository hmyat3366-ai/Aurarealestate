// Vane & Sterling Luxury Real Estate Design System & Complete Site Generator
// Compatible with Figma Plugin API (Desktop App & Figma Web)

async function run() {
  figma.notify("Generating Vane & Sterling Design System & Site Canvas...", { timeout: 3000 });

  // 1. Color Helper Functions
  function hexToRgb(hex) {
    let c = hex.replace("#", "");
    if (c.length === 3) c = c.split("").map((x) => x + x).join("");
    const num = parseInt(c, 16);
    return {
      r: ((num >> 16) & 255) / 255,
      g: ((num >> 8) & 255) / 255,
      b: (num & 255) / 255,
    };
  }

  function solidPaint(hex, opacity = 1) {
    const rgb = hexToRgb(hex);
    return [{ type: "SOLID", color: rgb, opacity }];
  }

  // Exact Design System Tokens
  const TOKENS = {
    canvas: {
      default: "#FBFBF9",
      secondary: "#F3F1EC",
      card: "#FFFFFF",
      dark: "#121312",
      darkElevated: "#1C1E1C",
    },
    ink: {
      primary: "#121312",
      secondary: "#4A4C48",
      muted: "#63655E",
      inverse: "#FBFBF9",
    },
    hairline: {
      subtle: "#E6E4DE",
      medium: "#D5D1C7",
      interactive: "#8E8A80",
    },
    bronze: {
      default: "#78542E",
      hover: "#614324",
      light: "#F4EDE2",
    },
    badge: {
      saleBg: "#EEF2EE",
      saleText: "#23362A",
      rentBg: "#EAF0F6",
      rentText: "#192C3D",
      exclusiveBg: "#F4EDE2",
      exclusiveText: "#78542E",
    },
  };

  // 2. Safe Font Loading
  const fontPrimaryRegular = { family: "Inter", style: "Regular" };
  const fontPrimaryMedium = { family: "Inter", style: "Medium" };
  const fontPrimarySemiBold = { family: "Inter", style: "Semi Bold" };
  const fontPrimaryBold = { family: "Inter", style: "Bold" };
  const fontSerifRegular = { family: "Georgia", style: "Regular" };
  const fontSerifBold = { family: "Georgia", style: "Bold" };
  const fontSerifItalic = { family: "Georgia", style: "Italic" };

  try {
    await Promise.all([
      figma.loadFontAsync(fontPrimaryRegular),
      figma.loadFontAsync(fontPrimaryMedium),
      figma.loadFontAsync(fontPrimarySemiBold),
      figma.loadFontAsync(fontPrimaryBold),
      figma.loadFontAsync(fontSerifRegular),
      figma.loadFontAsync(fontSerifBold),
      figma.loadFontAsync(fontSerifItalic),
    ]);
  } catch (err) {
    console.warn("Some fonts could not be loaded, falling back to Inter Regular", err);
    await figma.loadFontAsync(fontPrimaryRegular);
  }

  // 3. Create Figma Native Variables (Tokens)
  if (figma.variables && figma.variables.createVariableCollection) {
    try {
      const variableCollection = figma.variables.createVariableCollection("Vane & Sterling / Design Tokens");
      const defaultModeId = variableCollection.modes[0].modeId;

      function addColorVar(name, hex) {
        try {
          const v = figma.variables.createVariable(name, variableCollection.id, "COLOR");
          const rgb = hexToRgb(hex);
          v.setValueForMode(defaultModeId, { r: rgb.r, g: rgb.g, b: rgb.b, a: 1 });
        } catch (e) {}
      }

      function addFloatVar(name, val) {
        try {
          const v = figma.variables.createVariable(name, variableCollection.id, "FLOAT");
          v.setValueForMode(defaultModeId, val);
        } catch (e) {}
      }

      // Colors
      addColorVar("color/canvas/default", TOKENS.canvas.default);
      addColorVar("color/canvas/secondary", TOKENS.canvas.secondary);
      addColorVar("color/canvas/card", TOKENS.canvas.card);
      addColorVar("color/canvas/dark", TOKENS.canvas.dark);
      addColorVar("color/canvas/dark-elevated", TOKENS.canvas.darkElevated);
      addColorVar("color/ink/primary", TOKENS.ink.primary);
      addColorVar("color/ink/secondary", TOKENS.ink.secondary);
      addColorVar("color/ink/muted", TOKENS.ink.muted);
      addColorVar("color/ink/inverse", TOKENS.ink.inverse);
      addColorVar("color/hairline/subtle", TOKENS.hairline.subtle);
      addColorVar("color/hairline/medium", TOKENS.hairline.medium);
      addColorVar("color/hairline/interactive", TOKENS.hairline.interactive);
      addColorVar("color/bronze/default", TOKENS.bronze.default);
      addColorVar("color/bronze/light", TOKENS.bronze.light);
      addColorVar("color/badge/sale-bg", TOKENS.badge.saleBg);
      addColorVar("color/badge/sale-text", TOKENS.badge.saleText);
      addColorVar("color/badge/rent-bg", TOKENS.badge.rentBg);
      addColorVar("color/badge/rent-text", TOKENS.badge.rentText);

      // Spacing & Radii
      [4, 8, 12, 16, 20, 24, 32, 48, 64, 80].forEach((s) => addFloatVar(`spacing/${s}`, s));
      [0, 2, 4, 8, 9999].forEach((r) => addFloatVar(`radius/${r}`, r));

      console.log("Figma Variables generated successfully!");
    } catch (e) {
      console.warn("Figma Variables API skipped:", e);
    }
  }

  // Text Node Creation Utility
  function createText(chars, options = {}) {
    const text = figma.createText();
    text.fontName = options.fontName || fontPrimaryRegular;
    text.fontSize = options.fontSize || 14;
    text.characters = chars;
    if (options.letterSpacing) text.letterSpacing = options.letterSpacing;
    if (options.lineHeight) text.lineHeight = options.lineHeight;
    text.fills = solidPaint(options.color || TOKENS.ink.primary);
    text.autoRename = false;
    if (options.align) text.textAlignHorizontal = options.align;
    return text;
  }

  // Auto-Layout Frame Creation Utility
  function createAutoFrame(name, direction = "VERTICAL", spacing = 16, padding = [0, 0, 0, 0]) {
    const frame = figma.createFrame();
    frame.name = name;
    frame.layoutMode = direction;
    frame.itemSpacing = spacing;
    frame.paddingTop = padding[0];
    frame.paddingRight = padding[1];
    frame.paddingBottom = padding[2];
    frame.paddingLeft = padding[3];
    frame.fills = [];
    frame.clipsContent = false;
    return frame;
  }

  function createMockInput(label, placeholder, width) {
    const inputF = createAutoFrame(`Input: ${label}`, "VERTICAL", 2, [8, 14, 8, 14]);
    inputF.resize(width, 48);
    inputF.fills = solidPaint(TOKENS.canvas.default);
    inputF.strokes = solidPaint(TOKENS.hairline.subtle);
    inputF.strokeWeight = 1;
    inputF.cornerRadius = 2;
    inputF.appendChild(
      createText(label.toUpperCase(), {
        fontName: fontPrimaryMedium,
        fontSize: 9,
        letterSpacing: { value: 1, unit: "PIXELS" },
        color: TOKENS.ink.muted,
      })
    );
    inputF.appendChild(
      createText(placeholder, {
        fontName: fontPrimaryRegular,
        fontSize: 13,
        color: TOKENS.ink.primary,
      })
    );
    return inputF;
  }

  // 4. MASTER COMPONENTS LIBRARY

  // COMPONENT 1: Header Desktop (1440px)
  const compHeaderDesktop = figma.createComponent();
  compHeaderDesktop.name = "Component / Header - Desktop (1440px)";
  compHeaderDesktop.resize(1440, 88);
  compHeaderDesktop.layoutMode = "HORIZONTAL";
  compHeaderDesktop.primaryAxisAlignItems = "SPACE_BETWEEN";
  compHeaderDesktop.counterAxisAlignItems = "CENTER";
  compHeaderDesktop.paddingLeft = 56;
  compHeaderDesktop.paddingRight = 56;
  compHeaderDesktop.paddingTop = 20;
  compHeaderDesktop.paddingBottom = 20;
  compHeaderDesktop.fills = solidPaint(TOKENS.canvas.default);
  compHeaderDesktop.strokes = solidPaint(TOKENS.hairline.subtle);
  compHeaderDesktop.strokeWeight = 1;
  compHeaderDesktop.strokeAlign = "INSIDE";

  const logoCol = createAutoFrame("Brand Logo", "VERTICAL", 2);
  logoCol.appendChild(
    createText("VANE & STERLING", {
      fontName: fontSerifBold,
      fontSize: 22,
      letterSpacing: { value: 3, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  logoCol.appendChild(
    createText("PRIVATE RESIDENTIAL ADVISORY · LONDON & NEW YORK", {
      fontName: fontPrimaryMedium,
      fontSize: 8,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.ink.muted,
    })
  );
  compHeaderDesktop.appendChild(logoCol);

  const navRow = createAutoFrame("Nav Links", "HORIZONTAL", 36);
  navRow.counterAxisAlignItems = "CENTER";
  ["Buy", "Rent", "Sell with Us", "About Us", "Contact"].forEach((linkName) => {
    navRow.appendChild(
      createText(linkName, {
        fontName: fontPrimaryMedium,
        fontSize: 13,
        letterSpacing: { value: 0.5, unit: "PIXELS" },
        color: linkName === "Buy" ? TOKENS.ink.primary : TOKENS.ink.secondary,
      })
    );
  });
  compHeaderDesktop.appendChild(navRow);

  const ctaBtn = createAutoFrame("Header CTA", "HORIZONTAL", 8, [10, 20, 10, 20]);
  ctaBtn.counterAxisAlignItems = "CENTER";
  ctaBtn.primaryAxisAlignItems = "CENTER";
  ctaBtn.fills = solidPaint(TOKENS.canvas.card);
  ctaBtn.strokes = solidPaint(TOKENS.hairline.medium);
  ctaBtn.strokeWeight = 1;
  ctaBtn.cornerRadius = 2;
  ctaBtn.appendChild(
    createText("REQUEST VALUATION", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.2, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  compHeaderDesktop.appendChild(ctaBtn);

  // COMPONENT 2: Header Mobile (390px)
  const compHeaderMobile = figma.createComponent();
  compHeaderMobile.name = "Component / Header - Mobile (390px)";
  compHeaderMobile.resize(390, 68);
  compHeaderMobile.layoutMode = "HORIZONTAL";
  compHeaderMobile.primaryAxisAlignItems = "SPACE_BETWEEN";
  compHeaderMobile.counterAxisAlignItems = "CENTER";
  compHeaderMobile.paddingLeft = 20;
  compHeaderMobile.paddingRight = 20;
  compHeaderMobile.fills = solidPaint(TOKENS.canvas.default);
  compHeaderMobile.strokes = solidPaint(TOKENS.hairline.subtle);
  compHeaderMobile.strokeWeight = 1;

  const mobLogo = createText("VANE & STERLING", {
    fontName: fontSerifBold,
    fontSize: 18,
    letterSpacing: { value: 2, unit: "PIXELS" },
    color: TOKENS.ink.primary,
  });
  const mobMenu = createText("MENU ☰", {
    fontName: fontPrimaryMedium,
    fontSize: 12,
    letterSpacing: { value: 1, unit: "PIXELS" },
    color: TOKENS.ink.primary,
  });
  compHeaderMobile.appendChild(mobLogo);
  compHeaderMobile.appendChild(mobMenu);

  // COMPONENT 3: QuickDiscoveryConsole
  const compConsole = figma.createComponent();
  compConsole.name = "Component / QuickDiscoveryConsole";
  compConsole.resize(1180, 160);
  compConsole.layoutMode = "VERTICAL";
  compConsole.itemSpacing = 20;
  compConsole.paddingTop = 24;
  compConsole.paddingBottom = 24;
  compConsole.paddingLeft = 32;
  compConsole.paddingRight = 32;
  compConsole.fills = solidPaint(TOKENS.canvas.card);
  compConsole.strokes = solidPaint(TOKENS.hairline.subtle);
  compConsole.strokeWeight = 1;
  compConsole.cornerRadius = 2;
  compConsole.effects = [
    {
      type: "DROP_SHADOW",
      color: { r: 18 / 255, g: 19 / 255, b: 18 / 255, a: 0.08 },
      offset: { x: 0, y: 12 },
      radius: 32,
      spread: -4,
      visible: true,
      blendMode: "NORMAL",
    },
  ];

  const tabsRow = createAutoFrame("Console Tabs", "HORIZONTAL", 16);
  const tabActive = createAutoFrame("Tab Active", "HORIZONTAL", 8, [6, 16, 6, 16]);
  tabActive.fills = solidPaint(TOKENS.canvas.dark);
  tabActive.cornerRadius = 2;
  tabActive.appendChild(
    createText("FOR SALE / BUY", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  const tabInactive = createAutoFrame("Tab Inactive", "HORIZONTAL", 8, [6, 16, 6, 16]);
  tabInactive.fills = solidPaint(TOKENS.canvas.secondary);
  tabInactive.cornerRadius = 2;
  tabInactive.appendChild(
    createText("TO LET / RENT", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      letterSpacing: { value: 1, unit: "PIXELS" },
      color: TOKENS.ink.secondary,
    })
  );
  tabsRow.appendChild(tabActive);
  tabsRow.appendChild(tabInactive);
  compConsole.appendChild(tabsRow);

  const inputsRow = createAutoFrame("Inputs Row", "HORIZONTAL", 12);
  inputsRow.counterAxisAlignItems = "CENTER";
  inputsRow.resize(1116, 48);
  inputsRow.appendChild(createMockInput("Location", "Mayfair, Belgravia, SoHo...", 320));
  inputsRow.appendChild(createMockInput("Property Typology", "All Typologies ▾", 220));
  inputsRow.appendChild(createMockInput("Price Range", "Any Price ▾", 200));
  inputsRow.appendChild(createMockInput("Bedrooms", "Any Beds ▾", 160));

  const searchBtn = createAutoFrame("Search Action", "HORIZONTAL", 8, [14, 24, 14, 24]);
  searchBtn.resize(170, 48);
  searchBtn.counterAxisAlignItems = "CENTER";
  searchBtn.primaryAxisAlignItems = "CENTER";
  searchBtn.fills = solidPaint(TOKENS.canvas.dark);
  searchBtn.cornerRadius = 2;
  searchBtn.appendChild(
    createText("SEARCH", {
      fontName: fontPrimarySemiBold,
      fontSize: 12,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  inputsRow.appendChild(searchBtn);
  compConsole.appendChild(inputsRow);

  const tagsRow = createAutoFrame("Tags Row", "HORIZONTAL", 8);
  tagsRow.appendChild(
    createText("POPULAR ENCLAVES:", {
      fontName: fontPrimarySemiBold,
      fontSize: 10,
      letterSpacing: { value: 1, unit: "PIXELS" },
      color: TOKENS.ink.muted,
    })
  );
  ["Mayfair", "Belgravia", "Kensington", "Chelsea", "SoHo"].forEach((loc) => {
    const tag = createAutoFrame(`Tag ${loc}`, "HORIZONTAL", 4, [2, 8, 2, 8]);
    tag.fills = solidPaint(TOKENS.canvas.secondary);
    tag.cornerRadius = 2;
    tag.appendChild(
      createText(loc, {
        fontName: fontPrimaryMedium,
        fontSize: 11,
        color: TOKENS.ink.secondary,
      })
    );
    tagsRow.appendChild(tag);
  });
  compConsole.appendChild(tagsRow);

  // COMPONENT 4: PropertyCard
  const compCard = figma.createComponent();
  compCard.name = "Component / PropertyCard";
  compCard.resize(370, 480);
  compCard.layoutMode = "VERTICAL";
  compCard.itemSpacing = 0;
  compCard.fills = solidPaint(TOKENS.canvas.card);
  compCard.strokes = solidPaint(TOKENS.hairline.subtle);
  compCard.strokeWeight = 1;
  compCard.cornerRadius = 2;
  compCard.clipsContent = true;

  const photoFrame = figma.createFrame();
  photoFrame.name = "Photo Container (4:3)";
  photoFrame.resize(370, 260);
  photoFrame.fills = solidPaint("#E2DDD5");

  const badgeFrame = createAutoFrame("Status Badge", "HORIZONTAL", 4, [6, 12, 6, 12]);
  badgeFrame.x = 16;
  badgeFrame.y = 16;
  badgeFrame.fills = solidPaint(TOKENS.badge.saleBg);
  badgeFrame.cornerRadius = 2;
  badgeFrame.appendChild(
    createText("FOR SALE · EXCLUSIVE", {
      fontName: fontPrimarySemiBold,
      fontSize: 10,
      letterSpacing: { value: 1, unit: "PIXELS" },
      color: TOKENS.badge.saleText,
    })
  );
  photoFrame.appendChild(badgeFrame);
  compCard.appendChild(photoFrame);

  const cardBody = createAutoFrame("Card Body", "VERTICAL", 12, [20, 20, 20, 20]);
  cardBody.resize(370, 220);
  cardBody.appendChild(
    createText("£4,850,000", {
      fontName: fontSerifBold,
      fontSize: 24,
      color: TOKENS.ink.primary,
    })
  );
  cardBody.appendChild(
    createText("The Grosvenor Skyline Penthouse", {
      fontName: fontPrimarySemiBold,
      fontSize: 16,
      color: TOKENS.ink.primary,
    })
  );
  cardBody.appendChild(
    createText("Upper Grosvenor Street, Mayfair, London W1K", {
      fontName: fontPrimaryRegular,
      fontSize: 13,
      color: TOKENS.ink.muted,
    })
  );

  const cardDivider = figma.createRectangle();
  cardDivider.name = "Divider";
  cardDivider.resize(330, 1);
  cardDivider.fills = solidPaint(TOKENS.hairline.subtle);
  cardBody.appendChild(cardDivider);

  const specsRow = createAutoFrame("Specs Row", "HORIZONTAL", 16);
  specsRow.appendChild(
    createText("3 BEDS", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      letterSpacing: { value: 0.8, unit: "PIXELS" },
      color: TOKENS.ink.secondary,
    })
  );
  specsRow.appendChild(
    createText("·", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      color: TOKENS.hairline.interactive,
    })
  );
  specsRow.appendChild(
    createText("3.5 BATHS", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      letterSpacing: { value: 0.8, unit: "PIXELS" },
      color: TOKENS.ink.secondary,
    })
  );
  specsRow.appendChild(
    createText("·", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      color: TOKENS.hairline.interactive,
    })
  );
  specsRow.appendChild(
    createText("2,850 SQ FT", {
      fontName: fontPrimaryMedium,
      fontSize: 11,
      letterSpacing: { value: 0.8, unit: "PIXELS" },
      color: TOKENS.ink.secondary,
    })
  );
  cardBody.appendChild(specsRow);
  compCard.appendChild(cardBody);

  // COMPONENT 5: ValuationCallout Banner
  const compValuation = figma.createComponent();
  compValuation.name = "Component / ValuationBanner";
  compValuation.resize(1180, 120);
  compValuation.layoutMode = "HORIZONTAL";
  compValuation.counterAxisAlignItems = "CENTER";
  compValuation.primaryAxisAlignItems = "SPACE_BETWEEN";
  compValuation.paddingLeft = 40;
  compValuation.paddingRight = 40;
  compValuation.fills = solidPaint(TOKENS.canvas.secondary);
  compValuation.strokes = solidPaint(TOKENS.hairline.subtle);
  compValuation.strokeWeight = 1;
  compValuation.cornerRadius = 2;

  const valLeft = createAutoFrame("Valuation Text", "VERTICAL", 6);
  valLeft.appendChild(
    createText("THINKING OF SELLING OR LETTING YOUR RESIDENCE?", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  valLeft.appendChild(
    createText("Request a discreet market valuation from our senior advisory partners.", {
      fontName: fontSerifBold,
      fontSize: 20,
      color: TOKENS.ink.primary,
    })
  );
  compValuation.appendChild(valLeft);

  const valCta = createAutoFrame("Val CTA", "HORIZONTAL", 8, [12, 24, 12, 24]);
  valCta.fills = solidPaint(TOKENS.canvas.dark);
  valCta.cornerRadius = 2;
  valCta.appendChild(
    createText("BOOK VALUATION →", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  compValuation.appendChild(valCta);

  // COMPONENT 6: Footer (1440px)
  const compFooter = figma.createComponent();
  compFooter.name = "Component / Footer (1440px)";
  compFooter.resize(1440, 420);
  compFooter.layoutMode = "VERTICAL";
  compFooter.itemSpacing = 48;
  compFooter.paddingTop = 64;
  compFooter.paddingBottom = 48;
  compFooter.paddingLeft = 72;
  compFooter.paddingRight = 72;
  compFooter.fills = solidPaint(TOKENS.canvas.dark);

  const footerTopRow = createAutoFrame("Footer Columns", "HORIZONTAL", 64);
  footerTopRow.resize(1296, 220);

  const fCol1 = createAutoFrame("Col 1 Brand", "VERTICAL", 12);
  fCol1.resize(320, 200);
  fCol1.appendChild(
    createText("VANE & STERLING", {
      fontName: fontSerifBold,
      fontSize: 20,
      letterSpacing: { value: 2, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  fCol1.appendChild(
    createText(
      "A discreet private real estate advisory curating the world's finest architectural residences across London, New York, and prime European destinations.",
      {
        fontName: fontPrimaryRegular,
        fontSize: 13,
        color: "#9C9E98",
        lineHeight: { value: 20, unit: "PIXELS" },
      }
    )
  );
  footerTopRow.appendChild(fCol1);

  const fCol2 = createAutoFrame("Col 2 Enclaves", "VERTICAL", 12);
  fCol2.resize(220, 200);
  fCol2.appendChild(
    createText("PRIME ENCLAVES", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.bronze.light,
    })
  );
  ["Mayfair & St. James's", "Belgravia & Knightsbridge", "Kensington & Chelsea", "SoHo & Tribeca, NYC", "The Cotswolds"].forEach(
    (loc) => {
      fCol2.appendChild(
        createText(loc, {
          fontName: fontPrimaryRegular,
          fontSize: 13,
          color: "#CAC8C0",
        })
      );
    }
  );
  footerTopRow.appendChild(fCol2);

  const fCol3 = createAutoFrame("Col 3 Advisory", "VERTICAL", 12);
  fCol3.resize(220, 200);
  fCol3.appendChild(
    createText("PRIVATE ADVISORY", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.bronze.light,
    })
  );
  [
    "Discreet Acquisitions",
    "Private Office Representation",
    "Architectural Valuations",
    "Turnkey Diplomatic Leases",
    "Global Family Office",
  ].forEach((srv) => {
    fCol3.appendChild(
      createText(srv, {
        fontName: fontPrimaryRegular,
        fontSize: 13,
        color: "#CAC8C0",
      })
    );
  });
  footerTopRow.appendChild(fCol3);

  const fCol4 = createAutoFrame("Col 4 Dispatch", "VERTICAL", 12);
  fCol4.resize(360, 200);
  fCol4.appendChild(
    createText("THE ARCHITECTURAL DISPATCH", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.bronze.light,
    })
  );
  fCol4.appendChild(
    createText("Receive confidential off-market briefings and quarterly global luxury property research.", {
      fontName: fontPrimaryRegular,
      fontSize: 13,
      color: "#9C9E98",
    })
  );
  footerTopRow.appendChild(fCol4);
  compFooter.appendChild(footerTopRow);

  const footerBot = createAutoFrame("Footer Legal", "HORIZONTAL", 24);
  footerBot.appendChild(
    createText("© 2026 Vane & Sterling Private Advisory Ltd. All rights reserved. Member of RICS.", {
      fontName: fontPrimaryRegular,
      fontSize: 12,
      color: "#72746D",
    })
  );
  compFooter.appendChild(footerBot);

  // Position Master Components in library strip (x = 0)
  compHeaderDesktop.x = 0;
  compHeaderDesktop.y = 0;
  compHeaderMobile.x = 0;
  compHeaderMobile.y = 120;
  compConsole.x = 0;
  compConsole.y = 220;
  compCard.x = 0;
  compCard.y = 420;
  compValuation.x = 0;
  compValuation.y = 940;
  compFooter.x = 0;
  compFooter.y = 1100;

  // 5. ASSEMBLE COMPLETE FULL PAGE ARTBOARDS

  // PAGE 1: 🖥️ Homepage (Desktop 1440px)
  const pageHome = figma.createFrame();
  pageHome.name = "🖥️ 01 - Homepage (Desktop 1440px)";
  pageHome.resize(1440, 2900);
  pageHome.layoutMode = "VERTICAL";
  pageHome.itemSpacing = 0;
  pageHome.fills = solidPaint(TOKENS.canvas.default);
  pageHome.x = 1600;
  pageHome.y = 0;

  pageHome.appendChild(compHeaderDesktop.createInstance());

  // Hero Section
  const heroSec = createAutoFrame("Hero Section", "HORIZONTAL", 48, [80, 72, 80, 72]);
  heroSec.resize(1440, 620);
  heroSec.counterAxisAlignItems = "CENTER";

  const heroLeft = createAutoFrame("Hero Left", "VERTICAL", 24);
  heroLeft.resize(680, 460);
  heroLeft.appendChild(
    createText("PRIVATE RESIDENTIAL ADVISORY · LONDON & NEW YORK", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 2.5, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  heroLeft.appendChild(
    createText("Architecturally Significant Residences for Connoisseurs.", {
      fontName: fontSerifBold,
      fontSize: 54,
      lineHeight: { value: 62, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  heroLeft.appendChild(
    createText(
      "Discreet representation for extraordinary estates, landmark penthouses, and private acquisitions across the globe's premier enclaves.",
      {
        fontName: fontPrimaryRegular,
        fontSize: 16,
        lineHeight: { value: 26, unit: "PIXELS" },
        color: TOKENS.ink.secondary,
      }
    )
  );

  const heroCtaRow = createAutoFrame("Hero CTAs", "HORIZONTAL", 16);
  const heroPrimaryBtn = createAutoFrame("Explore Button", "HORIZONTAL", 8, [14, 28, 14, 28]);
  heroPrimaryBtn.fills = solidPaint(TOKENS.canvas.dark);
  heroPrimaryBtn.cornerRadius = 2;
  heroPrimaryBtn.appendChild(
    createText("EXPLORE RESIDENCES", {
      fontName: fontPrimarySemiBold,
      fontSize: 12,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  const heroSecBtn = createAutoFrame("Valuation Button", "HORIZONTAL", 8, [14, 28, 14, 28]);
  heroSecBtn.fills = solidPaint(TOKENS.canvas.card);
  heroSecBtn.strokes = solidPaint(TOKENS.hairline.medium);
  heroSecBtn.strokeWeight = 1;
  heroSecBtn.cornerRadius = 2;
  heroSecBtn.appendChild(
    createText("PRIVATE VALUATION", {
      fontName: fontPrimarySemiBold,
      fontSize: 12,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  heroCtaRow.appendChild(heroPrimaryBtn);
  heroCtaRow.appendChild(heroSecBtn);
  heroLeft.appendChild(heroCtaRow);
  heroSec.appendChild(heroLeft);

  const heroImage = figma.createFrame();
  heroImage.name = "Hero Architectural Photo";
  heroImage.resize(560, 460);
  heroImage.cornerRadius = 2;
  heroImage.fills = solidPaint("#D8D4CC");
  heroSec.appendChild(heroImage);
  pageHome.appendChild(heroSec);

  // Quick Discovery Wrapper
  const consoleWrap = createAutoFrame("Console Wrapper", "VERTICAL", 0, [0, 130, 40, 130]);
  consoleWrap.counterAxisAlignItems = "CENTER";
  consoleWrap.appendChild(compConsole.createInstance());
  pageHome.appendChild(consoleWrap);

  // Valuation Strip
  const valStripWrap = createAutoFrame("Valuation Strip Wrapper", "VERTICAL", 0, [0, 130, 48, 130]);
  valStripWrap.counterAxisAlignItems = "CENTER";
  valStripWrap.appendChild(compValuation.createInstance());
  pageHome.appendChild(valStripWrap);

  // Featured Residences Section
  const featSec = createAutoFrame("Featured Residences", "VERTICAL", 32, [48, 72, 64, 72]);
  featSec.resize(1440, 640);
  const featHead = createAutoFrame("Section Header", "HORIZONTAL", 16);
  featHead.resize(1296, 48);
  featHead.counterAxisAlignItems = "CENTER";
  featHead.primaryAxisAlignItems = "SPACE_BETWEEN";
  featHead.appendChild(
    createText("CURATED RESIDENCES FOR SALE", {
      fontName: fontSerifBold,
      fontSize: 28,
      color: TOKENS.ink.primary,
    })
  );
  featHead.appendChild(
    createText("VIEW ALL PROPERTIES →", {
      fontName: fontPrimarySemiBold,
      fontSize: 12,
      letterSpacing: { value: 1, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  featSec.appendChild(featHead);

  const featCards = createAutoFrame("Cards Row", "HORIZONTAL", 32);
  featCards.resize(1296, 480);
  featCards.appendChild(compCard.createInstance());
  featCards.appendChild(compCard.createInstance());
  featCards.appendChild(compCard.createInstance());
  featSec.appendChild(featCards);
  pageHome.appendChild(featSec);

  // Metrics Bar
  const metricsBar = createAutoFrame("Global Metrics Bar", "HORIZONTAL", 48, [48, 72, 48, 72]);
  metricsBar.resize(1440, 160);
  metricsBar.fills = solidPaint(TOKENS.canvas.secondary);
  metricsBar.counterAxisAlignItems = "CENTER";
  metricsBar.primaryAxisAlignItems = "SPACE_BETWEEN";

  function createMetric(val, label) {
    const m = createAutoFrame(`Metric ${val}`, "VERTICAL", 4);
    m.appendChild(
      createText(val, {
        fontName: fontSerifBold,
        fontSize: 36,
        color: TOKENS.ink.primary,
      })
    );
    m.appendChild(
      createText(label.toUpperCase(), {
        fontName: fontPrimaryMedium,
        fontSize: 10,
        letterSpacing: { value: 1.2, unit: "PIXELS" },
        color: TOKENS.ink.muted,
      })
    );
    return m;
  }
  metricsBar.appendChild(createMetric("125+ Years", "Architectural Heritage"));
  metricsBar.appendChild(createMetric("500+", "Global Partner Offices"));
  metricsBar.appendChild(createMetric("£50B+", "Private Transacted Volume"));
  metricsBar.appendChild(createMetric("16,000+", "Real Estate Specialists"));
  pageHome.appendChild(metricsBar);

  pageHome.appendChild(compFooter.createInstance());

  // PAGE 2: 🖥️ Sell with Us (Desktop 1440px)
  const pageSell = figma.createFrame();
  pageSell.name = "🖥️ 02 - Sell with Us (Desktop 1440px)";
  pageSell.resize(1440, 2100);
  pageSell.layoutMode = "VERTICAL";
  pageSell.itemSpacing = 0;
  pageSell.fills = solidPaint(TOKENS.canvas.default);
  pageSell.x = 3200;
  pageSell.y = 0;

  pageSell.appendChild(compHeaderDesktop.createInstance());

  const sellHero = createAutoFrame("Sell Hero", "HORIZONTAL", 48, [72, 72, 72, 72]);
  sellHero.resize(1440, 540);
  sellHero.counterAxisAlignItems = "CENTER";

  const sellHeroLeft = createAutoFrame("Sell Hero Left", "VERTICAL", 20);
  sellHeroLeft.resize(650, 400);
  sellHeroLeft.appendChild(
    createText("CONFIDENTIAL DISPOSITION & VALUATION", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 2, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  sellHeroLeft.appendChild(
    createText("Discreet Representation for Architecturally Significant Residences.", {
      fontName: fontSerifBold,
      fontSize: 44,
      lineHeight: { value: 52, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  sellHeroLeft.appendChild(
    createText(
      "From bespoke public debuts to confidential off-market transactions, our private advisory team provides unparalleled market valuation and discreet buyer representation.",
      {
        fontName: fontPrimaryRegular,
        fontSize: 15,
        lineHeight: { value: 24, unit: "PIXELS" },
        color: TOKENS.ink.secondary,
      }
    )
  );

  const sellHeroCtaRow = createAutoFrame("Sell CTA Row", "HORIZONTAL", 16);
  const sellPrimaryBtn = createAutoFrame("Sell CTA Btn", "HORIZONTAL", 8, [14, 24, 14, 24]);
  sellPrimaryBtn.fills = solidPaint(TOKENS.canvas.dark);
  sellPrimaryBtn.cornerRadius = 2;
  sellPrimaryBtn.appendChild(
    createText("REQUEST A CONFIDENTIAL VALUATION", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  sellHeroCtaRow.appendChild(sellPrimaryBtn);
  sellHeroLeft.appendChild(sellHeroCtaRow);
  sellHero.appendChild(sellHeroLeft);

  const sellHeroImg = figma.createFrame();
  sellHeroImg.name = "Sell Architectural Photography";
  sellHeroImg.resize(590, 400);
  sellHeroImg.cornerRadius = 2;
  sellHeroImg.fills = solidPaint("#D2CDC4");
  sellHero.appendChild(sellHeroImg);
  pageSell.appendChild(sellHero);

  // Valuation Form Container
  const formSection = createAutoFrame("Valuation Form Section", "VERTICAL", 24, [64, 200, 64, 200]);
  formSection.resize(1440, 520);
  formSection.counterAxisAlignItems = "CENTER";
  formSection.fills = solidPaint(TOKENS.canvas.secondary);

  formSection.appendChild(
    createText("CONFIDENTIAL VALUATION ADVISORY FORM", {
      fontName: fontSerifBold,
      fontSize: 28,
      color: TOKENS.ink.primary,
    })
  );

  const formBox = createAutoFrame("Form Container", "VERTICAL", 16, [32, 40, 32, 40]);
  formBox.resize(800, 340);
  formBox.fills = solidPaint(TOKENS.canvas.card);
  formBox.strokes = solidPaint(TOKENS.hairline.subtle);
  formBox.strokeWeight = 1;
  formBox.cornerRadius = 2;

  formBox.appendChild(createMockInput("Client Full Name", "Lord / Lady / Mr / Ms...", 720));
  formBox.appendChild(createMockInput("Contact Email & Phone", "client@domain.com · +44 ...", 720));
  formBox.appendChild(createMockInput("Property Address & Postal Code", "e.g. Upper Grosvenor Street, Mayfair...", 720));

  const submitBtn = createAutoFrame("Form Submit", "HORIZONTAL", 8, [14, 24, 14, 24]);
  submitBtn.fills = solidPaint(TOKENS.bronze.default);
  submitBtn.cornerRadius = 2;
  submitBtn.appendChild(
    createText("SUBMIT CONFIDENTIAL VALUATION INQUIRY", {
      fontName: fontPrimarySemiBold,
      fontSize: 12,
      letterSpacing: { value: 1.5, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  formBox.appendChild(submitBtn);
  formSection.appendChild(formBox);
  pageSell.appendChild(formSection);

  pageSell.appendChild(compFooter.createInstance());

  // PAGE 3: 🖥️ About Us (Desktop 1440px)
  const pageAbout = figma.createFrame();
  pageAbout.name = "🖥️ 03 - About Us (Desktop 1440px)";
  pageAbout.resize(1440, 2200);
  pageAbout.layoutMode = "VERTICAL";
  pageAbout.itemSpacing = 0;
  pageAbout.fills = solidPaint(TOKENS.canvas.default);
  pageAbout.x = 4800;
  pageAbout.y = 0;

  pageAbout.appendChild(compHeaderDesktop.createInstance());

  const aboutHero = createAutoFrame("About Hero", "HORIZONTAL", 48, [72, 72, 72, 72]);
  aboutHero.resize(1440, 540);
  aboutHero.counterAxisAlignItems = "CENTER";

  const aboutHeroLeft = createAutoFrame("About Hero Left", "VERTICAL", 20);
  aboutHeroLeft.resize(650, 420);
  aboutHeroLeft.appendChild(
    createText("FOUNDED 2014 · LONDON & NEW YORK", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 2, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  aboutHeroLeft.appendChild(
    createText("Curating the World's Most Architecturally Distinguished Residences.", {
      fontName: fontSerifBold,
      fontSize: 44,
      lineHeight: { value: 52, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  aboutHeroLeft.appendChild(
    createText(
      "Vane & Sterling was established on a single uncompromising principle: architecturally significant properties demand a curatorial discipline far beyond traditional real estate brokerage.",
      {
        fontName: fontPrimaryRegular,
        fontSize: 15,
        lineHeight: { value: 24, unit: "PIXELS" },
        color: TOKENS.ink.secondary,
      }
    )
  );
  aboutHero.appendChild(aboutHeroLeft);

  const aboutHeroImg = figma.createFrame();
  aboutHeroImg.name = "About Architectural Heritage Image";
  aboutHeroImg.resize(590, 400);
  aboutHeroImg.cornerRadius = 2;
  aboutHeroImg.fills = solidPaint("#D0CCC4");
  aboutHero.appendChild(aboutHeroImg);
  pageAbout.appendChild(aboutHero);

  // Curatorial Pillars Section
  const pillarsSec = createAutoFrame("Curatorial Pillars", "VERTICAL", 32, [64, 72, 64, 72]);
  pillarsSec.resize(1440, 520);
  pillarsSec.fills = solidPaint(TOKENS.canvas.secondary);

  pillarsSec.appendChild(
    createText("CURATORIAL PRINCIPLES", {
      fontName: fontSerifBold,
      fontSize: 28,
      color: TOKENS.ink.primary,
    })
  );

  const pillarsRow = createAutoFrame("Pillars Row", "HORIZONTAL", 32);
  pillarsRow.resize(1296, 340);

  function createPillarCard(num, title, desc) {
    const p = createAutoFrame(`Pillar ${num}`, "VERTICAL", 12, [24, 24, 24, 24]);
    p.resize(300, 320);
    p.fills = solidPaint(TOKENS.canvas.card);
    p.strokes = solidPaint(TOKENS.hairline.subtle);
    p.strokeWeight = 1;
    p.cornerRadius = 2;
    p.appendChild(
      createText(num, {
        fontName: fontSerifBold,
        fontSize: 24,
        color: TOKENS.bronze.default,
      })
    );
    p.appendChild(
      createText(title, {
        fontName: fontPrimarySemiBold,
        fontSize: 16,
        color: TOKENS.ink.primary,
      })
    );
    p.appendChild(
      createText(desc, {
        fontName: fontPrimaryRegular,
        fontSize: 13,
        lineHeight: { value: 20, unit: "PIXELS" },
        color: TOKENS.ink.secondary,
      })
    );
    return p;
  }

  pillarsRow.appendChild(createPillarCard("01", "Architectural Integrity", "Representing properties where spatial proportion, materiality, and light create lasting value."));
  pillarsRow.appendChild(createPillarCard("02", "Absolute Discretion", "Operating under rigorous non-disclosure agreements, protecting client identity and security."));
  pillarsRow.appendChild(createPillarCard("03", "Monograph Marketing", "Commissioning leading historians and photographers to produce bespoke architectural narratives."));
  pillarsRow.appendChild(createPillarCard("04", "Global Capital Access", "Direct personal relationships with family offices, foundations, and collectors of architecture."));
  pillarsSec.appendChild(pillarsRow);
  pageAbout.appendChild(pillarsSec);

  pageAbout.appendChild(compFooter.createInstance());

  // PAGE 4: 🖥️ Contact Us (Desktop 1440px)
  const pageContact = figma.createFrame();
  pageContact.name = "🖥️ 04 - Contact Us (Desktop 1440px)";
  pageContact.resize(1440, 2000);
  pageContact.layoutMode = "VERTICAL";
  pageContact.itemSpacing = 0;
  pageContact.fills = solidPaint(TOKENS.canvas.default);
  pageContact.x = 6400;
  pageContact.y = 0;

  pageContact.appendChild(compHeaderDesktop.createInstance());

  const contactHero = createAutoFrame("Contact Hero", "HORIZONTAL", 48, [72, 72, 72, 72]);
  contactHero.resize(1440, 540);
  contactHero.counterAxisAlignItems = "CENTER";

  const contactLeft = createAutoFrame("Contact Left", "VERTICAL", 20);
  contactLeft.resize(650, 400);
  contactLeft.appendChild(
    createText("GLOBAL OFFICES & PRIVATE DESKS", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 2, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  contactLeft.appendChild(
    createText("Initiate a Confidential Dialogue with Our Advisory Desks.", {
      fontName: fontSerifBold,
      fontSize: 44,
      lineHeight: { value: 52, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );
  contactLeft.appendChild(
    createText(
      "Whether seeking to acquire a landmark residence, commission a discreet market appraisal, or schedule a private viewing, our desks in Mayfair and Manhattan respond within 24 hours.",
      {
        fontName: fontPrimaryRegular,
        fontSize: 15,
        lineHeight: { value: 24, unit: "PIXELS" },
        color: TOKENS.ink.secondary,
      }
    )
  );

  const contactInfoRow = createAutoFrame("Contact Details", "HORIZONTAL", 32);
  const infoLondon = createAutoFrame("London HQ", "VERTICAL", 4);
  infoLondon.appendChild(createText("LONDON HEADQUARTERS", { fontName: fontPrimarySemiBold, fontSize: 10, letterSpacing: { value: 1, unit: "PIXELS" }, color: TOKENS.bronze.default }));
  infoLondon.appendChild(createText("14 Berkeley Square, Mayfair, London W1J 6BD", { fontName: fontPrimaryRegular, fontSize: 12, color: TOKENS.ink.primary }));
  infoLondon.appendChild(createText("+44 (0)20 7946 0880", { fontName: fontPrimaryMedium, fontSize: 12, color: TOKENS.ink.secondary }));

  const infoNYC = createAutoFrame("NYC Office", "VERTICAL", 4);
  infoNYC.appendChild(createText("NEW YORK PRIVATE OFFICE", { fontName: fontPrimarySemiBold, fontSize: 10, letterSpacing: { value: 1, unit: "PIXELS" }, color: TOKENS.bronze.default }));
  infoNYC.appendChild(createText("767 Fifth Avenue, New York, NY 10153", { fontName: fontPrimaryRegular, fontSize: 12, color: TOKENS.ink.primary }));
  infoNYC.appendChild(createText("+1 (212) 555-0180", { fontName: fontPrimaryMedium, fontSize: 12, color: TOKENS.ink.secondary }));

  contactInfoRow.appendChild(infoLondon);
  contactInfoRow.appendChild(infoNYC);
  contactLeft.appendChild(contactInfoRow);
  contactHero.appendChild(contactLeft);

  const contactHeroImg = figma.createFrame();
  contactHeroImg.name = "Contact Architectural Photo";
  contactHeroImg.resize(590, 400);
  contactHeroImg.cornerRadius = 2;
  contactHeroImg.fills = solidPaint("#CECAC0");
  contactHero.appendChild(contactHeroImg);
  pageContact.appendChild(contactHero);

  pageContact.appendChild(compFooter.createInstance());

  // PAGE 5: 📱 Homepage - Mobile (390px)
  const pageMobile = figma.createFrame();
  pageMobile.name = "📱 05 - Homepage (Mobile 390px)";
  pageMobile.resize(390, 2400);
  pageMobile.layoutMode = "VERTICAL";
  pageMobile.itemSpacing = 24;
  pageMobile.paddingBottom = 48;
  pageMobile.fills = solidPaint(TOKENS.canvas.default);
  pageMobile.x = 8000;
  pageMobile.y = 0;

  pageMobile.appendChild(compHeaderMobile.createInstance());

  const mobHero = createAutoFrame("Mobile Hero", "VERTICAL", 16, [24, 20, 24, 20]);
  mobHero.appendChild(
    createText("PRIVATE RESIDENTIAL ADVISORY", {
      fontName: fontPrimarySemiBold,
      fontSize: 10,
      letterSpacing: { value: 2, unit: "PIXELS" },
      color: TOKENS.bronze.default,
    })
  );
  mobHero.appendChild(
    createText("Architecturally Significant Residences.", {
      fontName: fontSerifBold,
      fontSize: 32,
      lineHeight: { value: 38, unit: "PIXELS" },
      color: TOKENS.ink.primary,
    })
  );

  const mobHeroImg = figma.createFrame();
  mobHeroImg.name = "Mobile Hero Image";
  mobHeroImg.resize(350, 220);
  mobHeroImg.cornerRadius = 2;
  mobHeroImg.fills = solidPaint("#D8D4CC");
  mobHero.appendChild(mobHeroImg);

  const mobBtn = createAutoFrame("Mobile Explore CTA", "HORIZONTAL", 8, [12, 20, 12, 20]);
  mobBtn.resize(350, 48);
  mobBtn.counterAxisAlignItems = "CENTER";
  mobBtn.primaryAxisAlignItems = "CENTER";
  mobBtn.fills = solidPaint(TOKENS.canvas.dark);
  mobBtn.cornerRadius = 2;
  mobBtn.appendChild(
    createText("EXPLORE RESIDENCES", {
      fontName: fontPrimarySemiBold,
      fontSize: 11,
      letterSpacing: { value: 1.2, unit: "PIXELS" },
      color: TOKENS.canvas.default,
    })
  );
  mobHero.appendChild(mobBtn);
  pageMobile.appendChild(mobHero);

  const mobCardWrap = createAutoFrame("Mobile Card Wrap", "VERTICAL", 16, [0, 10, 0, 10]);
  mobCardWrap.appendChild(compCard.createInstance());
  pageMobile.appendChild(mobCardWrap);

  // Zoom into full workspace
  figma.viewport.scrollAndZoomIntoView([
    compHeaderDesktop,
    pageHome,
    pageSell,
    pageAbout,
    pageContact,
    pageMobile,
  ]);

  figma.notify("✨ Vane & Sterling Design System, Variables & 5 Full Artboards generated!", { timeout: 5000 });
}

run();
