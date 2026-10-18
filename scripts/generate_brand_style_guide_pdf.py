import os
import shutil
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, PageBreak, KeepTogether, HRFlowable
)
from reportlab.pdfgen import canvas

class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_decorations(num_pages)
            super().showPage()
        super().save()

    def draw_page_decorations(self, page_count):
        self.saveState()
        self.setFont("Helvetica", 7)
        self.setFillColor(colors.HexColor("#63655E"))
        
        # Header (Pages 2+)
        if self._pageNumber > 1:
            self.drawString(36, 815, "AURA REAL ESTATE  |  COLOR & TYPOGRAPHY ARCHITECTURAL STYLE GUIDE")
            self.drawRightString(559, 815, "OCTOBER 2026")
            self.setStrokeColor(colors.HexColor("#E6E3DC"))
            self.setLineWidth(0.5)
            self.line(36, 808, 559, 808)

        # Footer (All pages)
        self.setStrokeColor(colors.HexColor("#E6E3DC"))
        self.setLineWidth(0.5)
        self.line(36, 42, 559, 42)
        self.drawString(36, 30, "CONFIDENTIAL & PROPRIETARY  —  AURA REAL ESTATE PRIVATE SPECIFICATION")
        self.drawRightString(559, 30, f"PAGE {self._pageNumber} OF {page_count}")
        self.restoreState()


def build_pdf(output_path):
    doc = SimpleDocTemplate(
        output_path,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=42
    )

    styles = getSampleStyleSheet()
    
    # Custom Brand Typography Styles
    title_style = ParagraphStyle(
        'CoverTitle',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=21,
        leading=25,
        textColor=colors.HexColor('#121312'),
        spaceAfter=3
    )
    
    subtitle_style = ParagraphStyle(
        'CoverSubtitle',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=10,
        leading=13,
        textColor=colors.HexColor('#78542E'),
        spaceAfter=8
    )
    
    section_heading = ParagraphStyle(
        'SectionHeading',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=12,
        leading=15,
        textColor=colors.HexColor('#121312'),
        spaceBefore=10,
        spaceAfter=5,
        keepWithNext=True
    )
    
    body_style = ParagraphStyle(
        'BodyDark',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#4A4C48'),
        spaceAfter=5
    )

    code_style = ParagraphStyle(
        'CodeStyle',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=7,
        leading=9.5,
        textColor=colors.HexColor('#121312')
    )

    table_header = ParagraphStyle(
        'TableHeader',
        parent=styles['Normal'],
        fontName='Helvetica-Bold',
        fontSize=7.5,
        leading=9.5,
        textColor=colors.HexColor('#FBFBF9')
    )

    table_cell = ParagraphStyle(
        'TableCell',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=7,
        leading=9,
        textColor=colors.HexColor('#121312')
    )
    
    table_cell_code = ParagraphStyle(
        'TableCellCode',
        parent=styles['Normal'],
        fontName='Courier',
        fontSize=6.5,
        leading=8.5,
        textColor=colors.HexColor('#121312')
    )

    table_cell_desc = ParagraphStyle(
        'TableCellDesc',
        parent=styles['Normal'],
        fontName='Helvetica',
        fontSize=6.5,
        leading=8.5,
        textColor=colors.HexColor('#4A4C48')
    )

    story = []

    # Title Banner
    story.append(Paragraph("AURA REAL ESTATE", title_style))
    story.append(Paragraph("Design System Specification — Colors, Typography, Responsive Scales & Design Tokens", subtitle_style))
    story.append(Paragraph("This document provides the authoritative architectural design tokens and visual standards powering the AURA Real Estate agency platform. All colors conform to WCAG 2.2 AA / AAA contrast ratios, and typography enforces fluid CSS clamp() scaling across all device form factors.", body_style))
    story.append(HRFlowable(width="100%", thickness=1, color=colors.HexColor("#78542E"), spaceAfter=8))

    # SECTION 1: COLOR PALETTE
    story.append(Paragraph("1. ARCHITECTURAL COLOR SYSTEM & DESIGN TOKENS", section_heading))
    story.append(Paragraph("A restrained, editorial color system built around Warm Alabaster surfaces, Obsidian typography, and Heritage Bronze accents.", body_style))

    # Colors Data: [Role, Token, HEX, RGB, HSL, Contrast Ratio, Tailwind / CSS Variable, Usage]
    color_data = [
        [
            Paragraph("<b>Token & Role</b>", table_header),
            Paragraph("<b>HEX Code</b>", table_header),
            Paragraph("<b>RGB / HSL</b>", table_header),
            Paragraph("<b>Contrast / WCAG</b>", table_header),
            Paragraph("<b>CSS / Tailwind Token</b>", table_header),
            Paragraph("<b>Architectural Usage</b>", table_header),
        ],
        # Canvas
        [
            Paragraph("<b>Warm Alabaster</b><br/>Base Canvas", table_cell),
            Paragraph("<b>#FBFBF9</b>", table_cell_code),
            Paragraph("rgb(251, 251, 249)<br/>hsl(60, 14%, 98%)", table_cell_code),
            Paragraph("Base (0:1)", table_cell),
            Paragraph("<code>bg-canvas</code><br/><code>--color-canvas</code>", table_cell_code),
            Paragraph("Primary background canvas across all pages.", table_cell_desc),
        ],
        [
            Paragraph("<b>Ivory Sand</b><br/>Secondary Canvas", table_cell),
            Paragraph("<b>#F3F1EC</b>", table_cell_code),
            Paragraph("rgb(243, 241, 236)<br/>hsl(43, 22%, 94%)", table_cell_code),
            Paragraph("1.08:1 on base", table_cell),
            Paragraph("<code>bg-canvas-secondary</code><br/><code>--color-canvas-secondary</code>", table_cell_code),
            Paragraph("Filter consoles, search bars, inputs, tabs.", table_cell_desc),
        ],
        [
            Paragraph("<b>Pure White</b><br/>Elevated Card", table_cell),
            Paragraph("<b>#FFFFFF</b>", table_cell_code),
            Paragraph("rgb(255, 255, 255)<br/>hsl(0, 0%, 100%)", table_cell_code),
            Paragraph("1.04:1 on base", table_cell),
            Paragraph("<code>bg-canvas-card</code><br/><code>--color-canvas-card</code>", table_cell_code),
            Paragraph("Elevated property cards, dialog modals, flyouts.", table_cell_desc),
        ],
        [
            Paragraph("<b>Obsidian Dark</b><br/>Primary Surface", table_cell),
            Paragraph("<b>#121312</b>", table_cell_code),
            Paragraph("rgb(18, 19, 18)<br/>hsl(120, 3%, 7%)", table_cell_code),
            Paragraph("17.97:1 (AAA)", table_cell),
            Paragraph("<code>bg-obsidian</code><br/><code>--color-obsidian</code>", table_cell_code),
            Paragraph("Footer, primary buttons, inverted hero sections.", table_cell_desc),
        ],
        [
            Paragraph("<b>Obsidian Hover</b><br/>Interactive State", table_cell),
            Paragraph("<b>#282A27</b>", table_cell_code),
            Paragraph("rgb(40, 42, 39)<br/>hsl(100, 4%, 16%)", table_cell_code),
            Paragraph("13.62:1 (AAA)", table_cell),
            Paragraph("<code>hover:bg-obsidian-hover</code>", table_cell_code),
            Paragraph("Hover state for dark CTA buttons and chips.", table_cell_desc),
        ],
        # Inks
        [
            Paragraph("<b>Obsidian Ink</b><br/>Primary Text", table_cell),
            Paragraph("<b>#121312</b>", table_cell_code),
            Paragraph("rgb(18, 19, 18)<br/>hsl(120, 3%, 7%)", table_cell_code),
            Paragraph("17.97:1 (AAA)", table_cell),
            Paragraph("<code>text-ink-primary</code><br/><code>text-obsidian</code>", table_cell_code),
            Paragraph("All headlines, prices, primary titles, nav items.", table_cell_desc),
        ],
        [
            Paragraph("<b>Graphite</b><br/>Secondary Body Text", table_cell),
            Paragraph("<b>#4A4C48</b>", table_cell_code),
            Paragraph("rgb(74, 76, 72)<br/>hsl(90, 3%, 29%)", table_cell_code),
            Paragraph("8.38:1 (AAA)", table_cell),
            Paragraph("<code>text-ink-secondary</code><br/><code>text-graphite</code>", table_cell_code),
            Paragraph("Editorial body paragraphs, specs, descriptions.", table_cell_desc),
        ],
        [
            Paragraph("<b>Mineral Muted</b><br/>Captions & Meta", table_cell),
            Paragraph("<b>#63655E</b>", table_cell_code),
            Paragraph("rgb(99, 101, 94)<br/>hsl(77, 4%, 38%)", table_cell_code),
            Paragraph("5.70:1 (AA)", table_cell),
            Paragraph("<code>text-ink-muted</code><br/><code>text-mineral</code>", table_cell_code),
            Paragraph("Metadata labels, helper text, timestamps, tags.", table_cell_desc),
        ],
        [
            Paragraph("<b>Inverse Alabaster</b><br/>Light on Dark", table_cell),
            Paragraph("<b>#FBFBF9</b>", table_cell_code),
            Paragraph("rgb(251, 251, 249)<br/>hsl(60, 14%, 98%)", table_cell_code),
            Paragraph("17.97:1 on dark", table_cell),
            Paragraph("<code>text-ink-inverse</code><br/><code>text-alabaster</code>", table_cell_code),
            Paragraph("Headings and text on Obsidian/footer surfaces.", table_cell_desc),
        ],
        # Hairlines
        [
            Paragraph("<b>Hairline Subtle</b><br/>1px Grid Lines", table_cell),
            Paragraph("<b>#E6E3DC</b>", table_cell_code),
            Paragraph("rgb(230, 227, 220)<br/>hsl(42, 17%, 88%)", table_cell_code),
            Paragraph("1.21:1 structural", table_cell),
            Paragraph("<code>border-hairline-subtle</code><br/><code>--border-hairline</code>", table_cell_code),
            Paragraph("Architectural grid borders, section horizontal rules.", table_cell_desc),
        ],
        [
            Paragraph("<b>Hairline Medium</b><br/>Card Outlines", table_cell),
            Paragraph("<b>#D5D1C7</b>", table_cell_code),
            Paragraph("rgb(213, 209, 199)<br/>hsl(43, 15%, 81%)", table_cell_code),
            Paragraph("1.42:1 structural", table_cell),
            Paragraph("<code>border-hairline-medium</code><br/><code>--border-medium</code>", table_cell_code),
            Paragraph("Property card borders, table dividers, dialogs.", table_cell_desc),
        ],
        [
            Paragraph("<b>Interactive Border</b><br/>Form Inputs", table_cell),
            Paragraph("<b>#8E8A80</b>", table_cell_code),
            Paragraph("rgb(142, 138, 128)<br/>hsl(43, 5%, 53%)", table_cell_code),
            Paragraph("3.32:1 (AA UI)", table_cell),
            Paragraph("<code>border-hairline-interactive</code><br/><code>--border-interactive</code>", table_cell_code),
            Paragraph("Text inputs, dropdowns, checkbox borders, focus states.", table_cell_desc),
        ],
        # Bronze Accents
        [
            Paragraph("<b>Heritage Bronze</b><br/>Signature Accent", table_cell),
            Paragraph("<b>#78542E</b>", table_cell_code),
            Paragraph("rgb(120, 84, 46)<br/>hsl(31, 45%, 33%)", table_cell_code),
            Paragraph("6.53:1 (AA)", table_cell),
            Paragraph("<code>text-bronze</code><br/><code>bg-bronze</code>", table_cell_code),
            Paragraph("Eyebrow tags, star accents, active tabs, links.", table_cell_desc),
        ],
        [
            Paragraph("<b>Bronze Hover</b><br/>Active Hover Accent", table_cell),
            Paragraph("<b>#614324</b>", table_cell_code),
            Paragraph("rgb(97, 67, 36)<br/>hsl(30, 46%, 26%)", table_cell_code),
            Paragraph("8.61:1 (AAA)", table_cell),
            Paragraph("<code>hover:text-bronze-hover</code>", table_cell_code),
            Paragraph("Hover and pressed state for bronze buttons/links.", table_cell_desc),
        ],
        [
            Paragraph("<b>Champagne Light</b><br/>Accent Badge Tint", table_cell),
            Paragraph("<b>#F4EDE2</b>", table_cell_code),
            Paragraph("rgb(244, 237, 226)<br/>hsl(37, 45%, 92%)", table_cell_code),
            Paragraph("1.11:1 on base", table_cell),
            Paragraph("<code>bg-bronze-light</code><br/><code>--color-bronze-light</code>", table_cell_code),
            Paragraph("Exclusive badges, subtle highlight containers.", table_cell_desc),
        ],
        [
            Paragraph("<b>Champagne Gold</b><br/>Brand Highlight", table_cell),
            Paragraph("<b>#C5A880</b>", table_cell_code),
            Paragraph("rgb(197, 168, 128)<br/>hsl(35, 38%, 64%)", table_cell_code),
            Paragraph("2.14:1 decorative", table_cell),
            Paragraph("<code>text-bronze-champagne</code>", table_cell_code),
            Paragraph("Brand architectural arch highlights, luxury details.", table_cell_desc),
        ],
        # Domain Status Badges
        [
            Paragraph("<b>For Sale Badge</b><br/>Financial Status", table_cell),
            Paragraph("<b>#23362A</b> (Text)<br/><b>#EEF2EE</b> (Bg)", table_cell_code),
            Paragraph("Forest Sage on Mint<br/>hsl(142, 21%, 18%)", table_cell_code),
            Paragraph("12.1:1 (AAA)", table_cell),
            Paragraph("<code>bg-badge-sale-bg</code><br/><code>text-badge-sale-text</code>", table_cell_code),
            Paragraph("'FOR SALE' property status badge.", table_cell_desc),
        ],
        [
            Paragraph("<b>To Let / Rent Badge</b><br/>Financial Status", table_cell),
            Paragraph("<b>#192C3D</b> (Text)<br/><b>#EAF0F6</b> (Bg)", table_cell_code),
            Paragraph("Deep Slate on Ice<br/>hsl(208, 42%, 17%)", table_cell_code),
            Paragraph("12.8:1 (AAA)", table_cell),
            Paragraph("<code>bg-badge-rent-bg</code><br/><code>text-badge-rent-text</code>", table_cell_code),
            Paragraph("'TO LET' property rental badge.", table_cell_desc),
        ],
        [
            Paragraph("<b>Pending Badge</b><br/>Workflow Status", table_cell),
            Paragraph("<b>#5A3B18</b> (Text)<br/><b>#F7EFE6</b> (Bg)", table_cell_code),
            Paragraph("Warm Amber on Ecru<br/>hsl(32, 58%, 23%)", table_cell_code),
            Paragraph("9.4:1 (AAA)", table_cell),
            Paragraph("<code>bg-badge-pending-bg</code><br/><code>text-badge-pending-text</code>", table_cell_code),
            Paragraph("'PENDING CONFIRMATION' viewing requests.", table_cell_desc),
        ],
    ]

    col_widths = [88, 65, 88, 68, 98, 116]
    color_table = Table(color_data, colWidths=col_widths, repeatRows=1)
    color_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#121312')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#FBFBF9')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E6E3DC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#FBFBF9')]),
    ]))

    story.append(color_table)
    story.append(Spacer(1, 8))

    # SECTION 2: TRIPARTITE TYPOGRAPHIC SYSTEM
    story.append(PageBreak())
    story.append(Paragraph("2. TRIPARTITE TYPOGRAPHIC SYSTEM", section_heading))
    story.append(Paragraph("A carefully orchestrated tripartite type hierarchy uniting editorial elegance (Playfair Display), precision user interface readability (Montserrat), and structured technical metadata (Space Mono).", body_style))

    fonts_data = [
        [
            Paragraph("<b>Role & Stack</b>", table_header),
            Paragraph("<b>Primary Font</b>", table_header),
            Paragraph("<b>Fallback Font Stack</b>", table_header),
            Paragraph("<b>Styling Character</b>", table_header),
            Paragraph("<b>Target Elements</b>", table_header),
        ],
        [
            Paragraph("<b>Primary Editorial Serif</b><br/><code>font-serif</code>", table_cell),
            Paragraph("<b>Playfair Display</b>", table_cell),
            Paragraph("Cormorant Garamond, Didot, Bodoni MT, Cinzel, Georgia, serif", table_cell_desc),
            Paragraph("High contrast serifs, classical proportions, architectural pedigree.", table_cell_desc),
            Paragraph("H1 Hero, Page Titles, Section H2 Titles, Editorial Quotes.", table_cell_desc),
        ],
        [
            Paragraph("<b>Functional Sans-Serif</b><br/><code>font-sans</code>", table_cell),
            Paragraph("<b>Montserrat</b>", table_cell),
            Paragraph("Plus Jakarta Sans, Inter, -apple-system, BlinkMacSystemFont, Segoe UI, sans-serif", table_cell_desc),
            Paragraph("Geometric clarity, open apertures, maximum legibility across viewports.", table_cell_desc),
            Paragraph("Navigation links, buttons, body copy, form fields, filter chips.", table_cell_desc),
        ],
        [
            Paragraph("<b>Technical Monospace</b><br/><code>font-mono</code>", table_cell),
            Paragraph("<b>Space Mono</b>", table_cell),
            Paragraph("JetBrains Mono, SFMono-Regular, Menlo, Monaco, Consolas, monospace", table_cell_desc),
            Paragraph("Fixed-pitch precision, bracketed notation, editorial catalog indexing.", table_cell_desc),
            Paragraph("Property IDs (e.g. [AURA-MAY-01]), image counters (1 / 5), metrics, tags.", table_cell_desc),
        ],
    ]

    fonts_table = Table(fonts_data, colWidths=[105, 90, 130, 100, 98], repeatRows=1)
    fonts_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#121312')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#FBFBF9')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
        ('TOPPADDING', (0, 0), (-1, -1), 4),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E6E3DC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#FBFBF9')]),
    ]))
    story.append(fonts_table)
    story.append(Spacer(1, 14))

    # SECTION 3: FLUID RESPONSIVE TYPOGRAPHY MATRIX
    story.append(Paragraph("3. FLUID RESPONSIVE TYPOGRAPHY MATRIX (CSS CLAMP)", section_heading))
    story.append(Paragraph("All semantic headings scale smoothly between 360px mobile viewports and 1440px+ ultra-wide desktop viewports via CSS clamp() formulas. Form inputs strictly enforce a 16px base size to eliminate iOS Safari auto-zoom.", body_style))

    type_scale_data = [
        [
            Paragraph("<b>Semantic Token</b>", table_header),
            Paragraph("<b>Tailwind Class</b>", table_header),
            Paragraph("<b>CSS Fluid Clamp Formula</b>", table_header),
            Paragraph("<b>360px</b>", table_header),
            Paragraph("<b>768px</b>", table_header),
            Paragraph("<b>1280px</b>", table_header),
            Paragraph("<b>1440px+</b>", table_header),
            Paragraph("<b>Line Ht</b>", table_header),
            Paragraph("<b>Tracking</b>", table_header),
        ],
        [
            Paragraph("<b>Hero H1</b>", table_cell),
            Paragraph("<code>text-hero</code>", table_cell_code),
            Paragraph("clamp(2.125rem, 1.35rem + 2.95vw, 4rem)", table_cell_code),
            Paragraph("34px", table_cell),
            Paragraph("42px", table_cell),
            Paragraph("56px", table_cell),
            Paragraph("64px", table_cell),
            Paragraph("1.05", table_cell),
            Paragraph("-0.035em", table_cell),
        ],
        [
            Paragraph("<b>Page H1</b>", table_cell),
            Paragraph("<code>text-page-title</code>", table_cell_code),
            Paragraph("clamp(2rem, 1.45rem + 1.85vw, 3.25rem)", table_cell_code),
            Paragraph("32px", table_cell),
            Paragraph("38px", table_cell),
            Paragraph("48px", table_cell),
            Paragraph("52px", table_cell),
            Paragraph("1.15", table_cell),
            Paragraph("-0.025em", table_cell),
        ],
        [
            Paragraph("<b>Section H2</b>", table_cell),
            Paragraph("<code>text-section-title</code>", table_cell_code),
            Paragraph("clamp(1.625rem, 1.25rem + 1.4vw, 2.625rem)", table_cell_code),
            Paragraph("26px", table_cell),
            Paragraph("31px", table_cell),
            Paragraph("38px", table_cell),
            Paragraph("42px", table_cell),
            Paragraph("1.20", table_cell),
            Paragraph("-0.02em", table_cell),
        ],
        [
            Paragraph("<b>Section H3</b>", table_cell),
            Paragraph("<code>text-section-h3</code>", table_cell_code),
            Paragraph("clamp(1.25rem, 1.05rem + 0.75vw, 1.75rem)", table_cell_code),
            Paragraph("20px", table_cell),
            Paragraph("22px", table_cell),
            Paragraph("26px", table_cell),
            Paragraph("28px", table_cell),
            Paragraph("1.30", table_cell),
            Paragraph("-0.015em", table_cell),
        ],
        [
            Paragraph("<b>Card Title</b>", table_cell),
            Paragraph("<code>text-card-title</code>", table_cell_code),
            Paragraph("clamp(1rem, 0.9rem + 0.35vw, 1.25rem)", table_cell_code),
            Paragraph("16px", table_cell),
            Paragraph("18px", table_cell),
            Paragraph("19px", table_cell),
            Paragraph("20px", table_cell),
            Paragraph("1.35", table_cell),
            Paragraph("-0.01em", table_cell),
        ],
        [
            Paragraph("<b>Property Price</b>", table_cell),
            Paragraph("<code>text-property-price</code>", table_cell_code),
            Paragraph("clamp(1.0625rem, 0.95rem + 0.5vw, 1.5rem)", table_cell_code),
            Paragraph("17px", table_cell),
            Paragraph("19px", table_cell),
            Paragraph("22px", table_cell),
            Paragraph("24px", table_cell),
            Paragraph("1.25", table_cell),
            Paragraph("-0.015em", table_cell),
        ],
        [
            Paragraph("<b>Body Large (Lead)</b>", table_cell),
            Paragraph("<code>text-body-large</code>", table_cell_code),
            Paragraph("clamp(1rem, 0.95rem + 0.2vw, 1.125rem)", table_cell_code),
            Paragraph("16px", table_cell),
            Paragraph("17px", table_cell),
            Paragraph("18px", table_cell),
            Paragraph("18px", table_cell),
            Paragraph("1.65", table_cell),
            Paragraph("-0.005em", table_cell),
        ],
        [
            Paragraph("<b>Body Regular</b>", table_cell),
            Paragraph("<code>text-body-regular</code>", table_cell_code),
            Paragraph("1rem (Fixed)", table_cell_code),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("1.60", table_cell),
            Paragraph("0em", table_cell),
        ],
        [
            Paragraph("<b>Body Small</b>", table_cell),
            Paragraph("<code>text-body-small</code>", table_cell_code),
            Paragraph("0.875rem (Fixed)", table_cell_code),
            Paragraph("14px", table_cell),
            Paragraph("14px", table_cell),
            Paragraph("14px", table_cell),
            Paragraph("14px", table_cell),
            Paragraph("1.50", table_cell),
            Paragraph("+0.005em", table_cell),
        ],
        [
            Paragraph("<b>Caption / Meta</b>", table_cell),
            Paragraph("<code>text-caption-meta</code>", table_cell_code),
            Paragraph("0.8125rem (Fixed)", table_cell_code),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("1.40", table_cell),
            Paragraph("+0.02em", table_cell),
        ],
        [
            Paragraph("<b>Eyebrow Tag</b>", table_cell),
            Paragraph("<code>text-eyebrow-label</code>", table_cell_code),
            Paragraph("0.75rem (Uppercase)", table_cell_code),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("1.20", table_cell),
            Paragraph("+0.14em", table_cell),
        ],
        [
            Paragraph("<b>Nav Link</b>", table_cell),
            Paragraph("<code>text-nav-link</code>", table_cell_code),
            Paragraph("0.8125rem (Uppercase)", table_cell_code),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("1.30", table_cell),
            Paragraph("+0.08em", table_cell),
        ],
        [
            Paragraph("<b>Button Action</b>", table_cell),
            Paragraph("<code>text-btn</code>", table_cell_code),
            Paragraph("0.8125rem (Uppercase)", table_cell_code),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("1.30", table_cell),
            Paragraph("+0.10em", table_cell),
        ],
        [
            Paragraph("<b>Form Label</b>", table_cell),
            Paragraph("<code>text-form-lbl</code>", table_cell_code),
            Paragraph("0.8125rem", table_cell_code),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("13px", table_cell),
            Paragraph("1.35", table_cell),
            Paragraph("+0.04em", table_cell),
        ],
        [
            Paragraph("<b>Form Input</b>", table_cell),
            Paragraph("<code>text-form-inp</code>", table_cell_code),
            Paragraph("1rem (Strict Safari Anti-Zoom)", table_cell_code),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("16px", table_cell),
            Paragraph("1.50", table_cell),
            Paragraph("0em", table_cell),
        ],
        [
            Paragraph("<b>Helper Hint</b>", table_cell),
            Paragraph("<code>text-helper</code>", table_cell_code),
            Paragraph("0.75rem", table_cell_code),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("12px", table_cell),
            Paragraph("1.40", table_cell),
            Paragraph("0em", table_cell),
        ],
    ]

    type_scale_table = Table(type_scale_data, colWidths=[76, 74, 135, 30, 30, 34, 38, 38, 48], repeatRows=1)
    type_scale_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#121312')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#FBFBF9')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('LEFTPADDING', (0, 0), (-1, -1), 3),
        ('RIGHTPADDING', (0, 0), (-1, -1), 3),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E6E3DC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#FBFBF9')]),
    ]))
    story.append(type_scale_table)
    story.append(Spacer(1, 14))

    # SECTION 4: READING LINE LENGTH & SPACING TOKENS
    story.append(PageBreak())
    story.append(Paragraph("4. READING LINE CONSTRAINTS, LETTER-SPACING & RADII", section_heading))
    story.append(Paragraph("Refined architectural geometry enforcing sharp borders (2px radius), atmospheric ambient shadows, and strict typographic measure constraints.", body_style))

    # Tracking & Measure Table
    spec_data = [
        [
            Paragraph("<b>Category</b>", table_header),
            Paragraph("<b>Token Name</b>", table_header),
            Paragraph("<b>Value</b>", table_header),
            Paragraph("<b>Tailwind Class</b>", table_header),
            Paragraph("<b>Design Intent & Usage</b>", table_header),
        ],
        [
            Paragraph("<b>Measure (Width)</b>", table_cell),
            Paragraph("Prose Max Width", table_cell),
            Paragraph("65ch (~650px)", table_cell_code),
            Paragraph("<code>max-w-prose</code>", table_cell_code),
            Paragraph("Editorial articles, about narrative, property long description.", table_cell_desc),
        ],
        [
            Paragraph("<b>Measure (Width)</b>", table_cell),
            Paragraph("Lead Statement", table_cell),
            Paragraph("60ch (~600px)", table_cell_code),
            Paragraph("<code>max-w-lead</code>", table_cell_code),
            Paragraph("Hero subhead and section lead paragraphs.", table_cell_desc),
        ],
        [
            Paragraph("<b>Measure (Width)</b>", table_cell),
            Paragraph("Headline Max Width", table_cell),
            Paragraph("26ch (~550px)", table_cell_code),
            Paragraph("<code>max-w-heading</code>", table_cell_code),
            Paragraph("Prevents headlines from spanning awkwardly wide on 1440px+.", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Wordmark Tracking", table_cell),
            Paragraph("+0.35em", table_cell_code),
            Paragraph("<code>tracking-tracked-wordmark</code>", table_cell_code),
            Paragraph("AURA primary logo mark lettering.", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Descriptor Tracking", table_cell),
            Paragraph("+0.28em", table_cell_code),
            Paragraph("<code>tracking-tracked-descriptor</code>", table_cell_code),
            Paragraph("REAL ESTATE subtitle under logo mark.", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Eyebrow Tracking", table_cell),
            Paragraph("+0.14em", table_cell_code),
            Paragraph("<code>tracking-tracked-eyebrow</code>", table_cell_code),
            Paragraph("Section eyebrow badges and small uppercase tags.", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Button Tracking", table_cell),
            Paragraph("+0.10em", table_cell_code),
            Paragraph("<code>tracking-tracked-button</code>", table_cell_code),
            Paragraph("Uppercase interactive buttons and primary CTAs.", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Nav Tracking", table_cell),
            Paragraph("+0.08em", table_cell_code),
            Paragraph("<code>tracking-tracked-caps</code>", table_cell_code),
            Paragraph("Navigation menu items (BUY, RENT, SELL WITH US).", table_cell_desc),
        ],
        [
            Paragraph("<b>Letter Spacing</b>", table_cell),
            Paragraph("Hero H1 Tight", table_cell),
            Paragraph("-0.035em", table_cell_code),
            Paragraph("<code>tracking-tight-monumental</code>", table_cell_code),
            Paragraph("Monumental editorial headline optical kerning.", table_cell_desc),
        ],
        [
            Paragraph("<b>Border Radius</b>", table_cell),
            Paragraph("Signature Sharp", table_cell),
            Paragraph("2px (0.125rem)", table_cell_code),
            Paragraph("<code>rounded-xs</code>", table_cell_code),
            Paragraph("Cards, buttons, inputs, modal dialogs, search filter bars.", table_cell_desc),
        ],
        [
            Paragraph("<b>Box Shadow</b>", table_cell),
            Paragraph("Ambient Subtle", table_cell),
            Paragraph("0 2px 12px -2px rgba(18,19,18,0.04)", table_cell_code),
            Paragraph("<code>shadow-ambient-sm</code>", table_cell_code),
            Paragraph("Default elevated card shadow.", table_cell_desc),
        ],
        [
            Paragraph("<b>Box Shadow</b>", table_cell),
            Paragraph("Ambient Elevated", table_cell),
            Paragraph("0 12px 32px -8px rgba(18,19,18,0.08)", table_cell_code),
            Paragraph("<code>shadow-ambient-md</code>", table_cell_code),
            Paragraph("Floating search console and card hover lift.", table_cell_desc),
        ],
        [
            Paragraph("<b>Motion Easing</b>", table_cell),
            Paragraph("Editorial Ease-Out", table_cell),
            Paragraph("cubic-bezier(0.16, 1, 0.3, 1)", table_cell_code),
            Paragraph("<code>ease-editorial-ease</code>", table_cell_code),
            Paragraph("Lusion-inspired signature deceleration curve.", table_cell_desc),
        ],
    ]

    spec_table = Table(spec_data, colWidths=[95, 95, 125, 100, 108], repeatRows=1)
    spec_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#121312')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#FBFBF9')),
        ('ALIGN', (0, 0), (-1, -1), 'LEFT'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E6E3DC')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.HexColor('#FFFFFF'), colors.HexColor('#FBFBF9')]),
    ]))
    story.append(spec_table)
    story.append(Spacer(1, 14))

    # SECTION 5: READY-TO-USE CSS SNIPPET
    story.append(Paragraph("5. DIRECT CSS / TAILWIND IMPLEMENTATION CHEAT SHEET", section_heading))
    story.append(Paragraph("Copy-pasteable CSS tokens directly from src/app/globals.css and tailwind.config.ts:", body_style))

    css_text = """/* --- AURA REAL ESTATE CORE TOKENS --- */
:root {
  /* Architectural Canvas */
  --color-canvas: #FBFBF9;           /* Warm Alabaster */
  --color-canvas-secondary: #F3F1EC; /* Ivory Sand */
  --color-canvas-card: #FFFFFF;      /* Pure White */
  --color-obsidian: #121312;         /* Obsidian Ink */
  --color-graphite: #4A4C48;         /* Graphite Body */
  --color-mineral: #63655E;          /* Mineral Muted */
  --color-bronze: #78542E;           /* Heritage Bronze */
  --color-bronze-light: #F4EDE2;     /* Champagne Light */
  --border-hairline: #E6E3DC;        /* 1px Subtle Grid */
  --border-medium: #D5D1C7;          /* Card Outlines */
  --border-interactive: #8E8A80;     /* Form Inputs */

  /* Type Families */
  --font-serif: "Playfair Display", "Cormorant Garamond", Georgia, serif;
  --font-sans: "Montserrat", "Plus Jakarta Sans", Inter, sans-serif;
  --font-mono: "Space Mono", monospace;

  /* Fluid Clamp Scales */
  --text-hero: clamp(2.125rem, 1.35rem + 2.95vw, 4rem);
  --text-page-title: clamp(2rem, 1.45rem + 1.85vw, 3.25rem);
  --text-section-title: clamp(1.625rem, 1.25rem + 1.4vw, 2.625rem);
  --text-section-h3: clamp(1.25rem, 1.05rem + 0.75vw, 1.75rem);
  --text-card-title: clamp(1rem, 0.9rem + 0.35vw, 1.25rem);
  --text-property-price: clamp(1.0625rem, 0.95rem + 0.5vw, 1.5rem);
}"""

    story.append(Table([[Paragraph(f"<pre>{css_text}</pre>", code_style)]], colWidths=[523], style=[
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F3F1EC')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#D5D1C7')),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
        ('TOPPADDING', (0, 0), (-1, -1), 6),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 6),
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    print(f"Successfully generated style guide PDF: {output_path}")

if __name__ == "__main__":
    out_pdf = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..", "public", "AURA_Real_Estate_Brand_Style_Guide.pdf")
    out_pdf = os.path.abspath(out_pdf)
    build_pdf(out_pdf)
    
    # Also copy to artifact dir
    artifact_dir = r"C:\Users\Aniz Wiz Gouki\.gemini\antigravity\brain\0cae285a-9757-4d80-86f0-aa88bb10a362"
    if os.path.exists(artifact_dir):
        dest_artifact = os.path.join(artifact_dir, "AURA_Real_Estate_Brand_Style_Guide.pdf")
        shutil.copyfile(out_pdf, dest_artifact)
        print(f"Successfully copied PDF to artifact directory: {dest_artifact}")
