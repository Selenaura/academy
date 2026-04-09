"""
Selene Academia — Máster en Guía Espiritual Profesional
PDF Brochure Generator v2.0

10-page premium brochure with:
- Proper Spanish accents throughout
- Justified text via Paragraph/Frame system
- Market data motivation section
- University-style design (IE/ESADE inspired)
- Dark theme with gold accents
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black, Color
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY, TA_RIGHT
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
import os
import random

# ── Colors ──
BG = HexColor('#0C0E1A')
BG_LIGHT = HexColor('#0E0E18')
BG_CARD = HexColor('#141420')
BG_CARD2 = HexColor('#1A1A2E')
GOLD = HexColor('#D4A843')
GOLD_DIM = HexColor('#8B7535')
GOLD_LIGHT = HexColor('#D4B85C')
TEAL = HexColor('#006B77')
WHITE = HexColor('#F0EDE4')
WHITE_DIM = HexColor('#9A9AB0')
WHITE_DIMMER = HexColor('#6A6A80')
PURPLE = HexColor('#2D1B4E')
PURPLE_LIGHT = HexColor('#3D2B5E')
SUCCESS = HexColor('#00D68F')
BORDER = HexColor('#2A2A3C')
RED_DIM = HexColor('#FF6B6B')

W, H = A4
MARGIN = 50
CONTENT_W = W - 2 * MARGIN

OUTPUT = os.path.join(os.path.dirname(__file__), 'master-brochure.pdf')

# ── Paragraph Styles ──
STYLE_BODY = ParagraphStyle(
    'body', fontName='Helvetica', fontSize=9.5, leading=14,
    textColor=WHITE_DIM, alignment=TA_JUSTIFY, spaceAfter=6,
)
STYLE_BODY_WHITE = ParagraphStyle(
    'body_white', fontName='Helvetica', fontSize=9.5, leading=14,
    textColor=WHITE, alignment=TA_JUSTIFY, spaceAfter=6,
)
STYLE_BODY_CENTER = ParagraphStyle(
    'body_center', fontName='Helvetica', fontSize=10, leading=15,
    textColor=WHITE_DIM, alignment=TA_CENTER, spaceAfter=6,
)
STYLE_BODY_SMALL = ParagraphStyle(
    'body_small', fontName='Helvetica', fontSize=8.5, leading=12,
    textColor=WHITE_DIM, alignment=TA_JUSTIFY, spaceAfter=4,
)
STYLE_QUOTE = ParagraphStyle(
    'quote', fontName='Helvetica-Oblique', fontSize=11, leading=16,
    textColor=GOLD_LIGHT, alignment=TA_CENTER, spaceAfter=6,
    leftIndent=20, rightIndent=20,
)
STYLE_PULL_QUOTE = ParagraphStyle(
    'pull_quote', fontName='Helvetica-Oblique', fontSize=13, leading=19,
    textColor=GOLD, alignment=TA_CENTER, spaceAfter=6,
    leftIndent=30, rightIndent=30,
)


# ═══════════════════════════════════════════════
# UTILITY FUNCTIONS
# ═══════════════════════════════════════════════

def draw_bg(c):
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def draw_constellation_dots(c, seed=42):
    random.seed(seed)
    c.saveState()
    for _ in range(35):
        x = random.randint(30, int(W) - 30)
        y = random.randint(30, int(H) - 30)
        c.setFillAlpha(random.uniform(0.02, 0.06))
        c.setFillColor(GOLD)
        c.circle(x, y, random.uniform(0.5, 1.5), fill=1, stroke=0)
    c.restoreState()


def draw_gold_line(c, y, x1=None, x2=None, alpha=1.0):
    if x1 is None:
        x1 = MARGIN
    if x2 is None:
        x2 = W - MARGIN
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setStrokeAlpha(alpha * 0.4)
    c.setLineWidth(0.5)
    c.line(x1, y, x2, y)
    c.restoreState()


def draw_header(c, y=None):
    """Standard page header: brand + gold line"""
    if y is None:
        y = H - 55
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 9)
    c.drawString(MARGIN, y, 'S E L E N E   A C A D E M I A')
    # Page number on right
    draw_gold_line(c, y - 10)
    return y - 35


def draw_footer(c):
    c.saveState()
    c.setFillColor(WHITE_DIM)
    c.setFillAlpha(0.3)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, 28, 'Selene Academia  |  info@selenaura.com  |  academy.selenaura.com')
    c.restoreState()


def draw_star(c, x, y, size=3):
    c.saveState()
    c.setFillColor(GOLD)
    p = c.beginPath()
    p.moveTo(x, y + size)
    p.lineTo(x + size * 0.6, y)
    p.lineTo(x, y - size)
    p.lineTo(x - size * 0.6, y)
    p.close()
    c.drawPath(p, fill=1, stroke=0)
    c.restoreState()


def draw_section_title(c, y, title, centered=True):
    """Big section title in white"""
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 22)
    if centered:
        c.drawCentredString(W / 2, y, title)
    else:
        c.drawString(MARGIN, y, title)
    y -= 12
    if centered:
        draw_gold_line(c, y, W / 2 - 60, W / 2 + 60)
    else:
        draw_gold_line(c, y, MARGIN, MARGIN + 120)
    return y - 18


def draw_paragraph(c, text, x, y, width, style=None):
    """Draw justified paragraph text using Frame. Returns the y position after text."""
    if style is None:
        style = STYLE_BODY
    p = Paragraph(text, style)
    pw, ph = p.wrap(width, 500)
    p.drawOn(c, x, y - ph)
    return y - ph - 4


def draw_big_number(c, x, y, number, label, width=120):
    """University-style big stat number with label below"""
    c.saveState()
    # Card bg
    c.setFillColor(BG_CARD)
    c.setStrokeColor(GOLD_DIM)
    c.setStrokeAlpha(0.3)
    c.setLineWidth(0.5)
    c.roundRect(x, y - 55, width, 70, 8, fill=1, stroke=1)
    # Number
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(x + width / 2, y - 5, number)
    # Label
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 8)
    lines = label.split('\n')
    for i, line in enumerate(lines):
        c.drawCentredString(x + width / 2, y - 28 - i * 10, line)
    c.restoreState()


def draw_card(c, x, y, w, h, border_color=None):
    """Draw a dark card with optional border"""
    c.saveState()
    c.setFillColor(BG_CARD)
    if border_color:
        c.setStrokeColor(border_color)
        c.setLineWidth(0.5)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    else:
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.4)
        c.roundRect(x, y, w, h, 8, fill=1, stroke=1)
    c.restoreState()


def draw_glow(c, cx, cy, radius, color=PURPLE, alpha=0.12):
    """Draw a radial glow effect"""
    c.saveState()
    c.setFillColor(color)
    c.setFillAlpha(alpha)
    c.circle(cx, cy, radius, fill=1, stroke=0)
    c.setFillAlpha(alpha * 0.5)
    c.circle(cx, cy, radius * 0.6, fill=1, stroke=0)
    c.restoreState()


# ═══════════════════════════════════════════════
# PAGE 1: COVER
# ═══════════════════════════════════════════════
def page_cover(c):
    draw_bg(c)
    draw_constellation_dots(c)

    # Top glow
    draw_glow(c, W / 2, H - 100, 200, PURPLE, 0.15)
    draw_glow(c, W / 2, H - 100, 120, GOLD, 0.06)

    # Moon crescent
    cy = H - 155
    c.saveState()
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.circle(W / 2, cy, 25, fill=0, stroke=1)
    c.setFillColor(BG)
    c.circle(W / 2 + 10, cy + 5, 20, fill=1, stroke=0)
    c.restoreState()

    # Brand
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 11)
    c.drawCentredString(W / 2, cy - 45, 'S E L E N E   A C A D E M I A')

    draw_gold_line(c, cy - 60, W / 2 - 80, W / 2 + 80)

    # Title
    title_y = H / 2 + 50
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 30)
    c.drawCentredString(W / 2, title_y, u'M\u00e1ster en')
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 30)
    c.drawCentredString(W / 2, title_y - 38, u'Gu\u00eda Espiritual')
    c.drawCentredString(W / 2, title_y - 73, u'Profesional')

    # Subtitle
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 12)
    c.drawCentredString(W / 2, title_y - 115, u'Convierte tu don en tu profesi\u00f3n')

    # Key facts strip
    y_facts = title_y - 165
    draw_gold_line(c, y_facts + 15, W / 2 - 150, W / 2 + 150)
    facts = [u'80 horas', u'12 m\u00f3dulos', u'7 casos pr\u00e1cticos', u'Certificaci\u00f3n']
    c.setFont('Helvetica', 9)
    x_start = 85
    spacing = (W - 170) / (len(facts) - 1)
    for i, fact in enumerate(facts):
        x = x_start + i * spacing
        draw_star(c, x, y_facts - 5)
        c.setFillColor(WHITE_DIM)
        c.drawCentredString(x, y_facts - 20, fact)
    draw_gold_line(c, y_facts - 35, W / 2 - 150, W / 2 + 150)

    # Price block
    y_price = 155

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 26)
    c.drawCentredString(W / 2, y_price + 8, u'149,99 \u20ac')

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y_price - 18, u'o 3 cuotas de 50 \u20ac/mes  \u00b7  Garant\u00eda 14 d\u00edas')

    # Multi-currency
    c.setFillColor(WHITE_DIMMER)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W / 2, y_price - 38, u'$164 USD  \u00b7  $2.899 MXN  \u00b7  \u00a3129 GBP  \u00b7  $179 AUD')

    # Footer
    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 2: VISION — WHY NOW + MARKET OPPORTUNITY
# ═══════════════════════════════════════════════
def page_vision(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=77)

    y = draw_header(c)

    # Pull quote — more breathing room at top
    y -= 15
    y = draw_paragraph(c,
        u'\u00abHay personas que nacen con un don: la capacidad de ver m\u00e1s all\u00e1 '
        u'de lo visible, de sentir lo que otros no perciben, de guiar en la oscuridad. '
        u'Si est\u00e1s leyendo esto, probablemente t\u00fa seas una de ellas.\u00bb',
        MARGIN + 20, y, CONTENT_W - 40, STYLE_PULL_QUOTE
    )
    y -= 20
    draw_gold_line(c, y)
    y -= 30

    # Section: The spiritual services revolution
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 20)
    c.drawString(MARGIN, y, u'Una profesi\u00f3n en plena expansi\u00f3n')
    y -= 26

    y = draw_paragraph(c,
        u'El sector de los servicios espirituales y el bienestar hol\u00edstico vive un momento '
        u'hist\u00f3rico. Lo que antes se consideraba un nicho marginal se ha convertido en una '
        u'industria global multimillonaria, impulsada por una generaci\u00f3n que busca significado, '
        u'autoconocimiento y orientaci\u00f3n aut\u00e9ntica.',
        MARGIN, y, CONTENT_W, STYLE_BODY_WHITE
    )
    y -= 18

    # Big number stats — market data (3 cards for readability)
    stats = [
        (u'$22.800M', u'Mercado global\nastrolog\u00eda 2031'),
        (u'$5,6T', u'Econom\u00eda global\ndel bienestar'),
        (u'40-50%', u'Millennials y GenZ\ninteresados'),
    ]
    card_w = (CONTENT_W - 20) / 3
    for i, (num, label) in enumerate(stats):
        x = MARGIN + i * (card_w + 10)
        draw_big_number(c, x, y, num, label, card_w)
    y -= 82

    # Source line
    c.saveState()
    c.setFillColor(WHITE_DIMMER)
    c.setFillAlpha(0.5)
    c.setFont('Helvetica', 6.5)
    c.drawString(MARGIN, y, u'Fuentes: Allied Market Research 2024, Global Wellness Institute 2022, YouGov/Pew Research 2023')
    c.restoreState()
    y -= 25

    draw_gold_line(c, y)
    y -= 28

    # Why now subsection
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 16)
    c.drawString(MARGIN, y, u'\u00bfPor qu\u00e9 ahora?')
    y -= 24

    reasons = [
        (u'Demanda real y creciente',
         u'Tras la pandemia, el 50% de consumidores priorizan su bienestar emocional. '
         u'Solo en TikTok, #astrology supera los 40.000 millones de vistas. '
         u'La demanda de gu\u00edas espirituales cualificados crece cada a\u00f1o.'),
        (u'Los clientes pagan m\u00e1s por profesionales',
         u'El 85% de clientes prefieren profesionales certificados (ICF 2023) y pagan '
         u'un 20-40% m\u00e1s por sesiones acreditadas. Sesi\u00f3n media: 40-180\u20ac en Espa\u00f1a, '
         u'$50-200 USD en Latinoam\u00e9rica.'),
        (u'Sin competencia directa en espa\u00f1ol',
         u'No existe un programa en espa\u00f1ol que integre astrolog\u00eda, tarot, psicolog\u00eda aplicada, '
         u'pr\u00e1cticas supervisadas y emprendimiento en una sola formaci\u00f3n. '
         u'Selene es la primera.'),
    ]

    for i, (title, desc) in enumerate(reasons):
        # Number circle
        cx = MARGIN + 14
        cy_n = y - 2
        c.saveState()
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.setFillColor(BG_CARD)
        c.circle(cx, cy_n, 11, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(cx, cy_n - 4, str(i + 1))
        c.restoreState()

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 10.5)
        c.drawString(MARGIN + 32, y, title)
        y -= 16
        y = draw_paragraph(c, desc, MARGIN + 32, y, CONTENT_W - 32, STYLE_BODY)
        y -= 10

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 3: MOTIVATION — YOUR CALLING
# ═══════════════════════════════════════════════
def page_motivation(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=33)

    y = draw_header(c)

    y = draw_section_title(c, y, u'\u00bfSientes que es tu momento?')
    y -= 5

    y = draw_paragraph(c,
        u'Quiz\u00e1 llevas a\u00f1os leyendo cartas natales para amigos, interpretando sue\u00f1os, '
        u'sacando el tarot en momentos clave. Quiz\u00e1 la gente te busca porque confía '
        u'en tu intuici\u00f3n. Quiz\u00e1 sientes que tienes un don, pero no sabes c\u00f3mo '
        u'convertirlo en algo m\u00e1s.',
        MARGIN, y, CONTENT_W, STYLE_BODY_WHITE
    )
    y -= 8

    y = draw_paragraph(c,
        u'<b>No est\u00e1s sola.</b> Miles de personas comparten esa misma inquietud: '
        u'la vocaci\u00f3n de ayudar a otros mediante la gu\u00eda espiritual, pero sin la '
        u'estructura, la formaci\u00f3n profesional y la confianza para dar el paso.',
        MARGIN, y, CONTENT_W, STYLE_BODY_WHITE
    )
    y -= 15

    # Pain points in cards
    draw_gold_line(c, y + 5)
    y -= 15

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(MARGIN, y, u'\u00bfTe identificas?')
    y -= 18

    pain_points = [
        u'Ya lees cartas, tarot o sue\u00f1os, pero no te atreves a cobrar',
        u'Quieres vivir de tu don, pero no sabes por d\u00f3nde empezar',
        u'Te falta estructura: \u00bfc\u00f3mo cobro? \u00bfqu\u00e9 digo? \u00bfes legal?',
        u'Necesitas practicar con casos reales antes de lanzarte',
        u'Te preocupa no tener la formaci\u00f3n suficiente para ejercer',
        u'Quieres diferenciarte de las lecturas gen\u00e9ricas de internet',
    ]

    for i, item in enumerate(pain_points):
        yy = y - i * 22
        draw_star(c, MARGIN + 8, yy + 3)
        c.setFillColor(WHITE)
        c.setFont('Helvetica', 10)
        c.drawString(MARGIN + 22, yy, item)

    y -= len(pain_points) * 22 + 10

    # Transformation statement
    draw_card(c, MARGIN, y - 75, CONTENT_W, 85, GOLD_DIM)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 14)
    c.drawCentredString(W / 2, y - 15, u'Este m\u00e1ster es para ti.')
    y_text = y - 32
    draw_paragraph(c,
        u'En 12 m\u00f3dulos y 80 horas de formaci\u00f3n intensiva, pasarás de tener un don '
        u'a tener una <b>profesi\u00f3n</b>. Con casos reales, pr\u00e1cticas supervisadas, '
        u'tu marca personal lista y un plan de lanzamiento de 90 d\u00edas para empezar a ejercer.',
        MARGIN + 15, y_text, CONTENT_W - 30, STYLE_BODY_CENTER
    )
    y -= 95

    # Market opportunity callout
    draw_gold_line(c, y)
    y -= 22

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(MARGIN, y, u'La oportunidad econ\u00f3mica')
    y -= 18

    y = draw_paragraph(c,
        u'El sector del bienestar y los servicios espirituales factura m\u00e1s de '
        u'<b>5,6 billones de d\u00f3lares anuales a nivel global</b> (Global Wellness Institute, 2022). '
        u'Solo el mercado de astrolog\u00eda crece un 12% anual y superar\u00e1 los '
        u'$22.800 millones en 2031.',
        MARGIN, y, CONTENT_W, STYLE_BODY
    )
    y -= 5

    y = draw_paragraph(c,
        u'Los profesionales del coaching espiritual y hol\u00edstico con certificaci\u00f3n '
        u'reportan ingresos de <b>40.000 a 70.000 \u20ac anuales</b> en Espa\u00f1a '
        u'(ICF Global Study 2023). Y la industria de coaching, cercana a este sector, '
        u'alcanz\u00f3 los $4.564 millones en 2023.',
        MARGIN, y, CONTENT_W, STYLE_BODY
    )
    y -= 5

    y = draw_paragraph(c,
        u'En redes sociales, #astrology acumula m\u00e1s de <b>40.000 millones de vistas en TikTok</b>. '
        u'La demanda existe. Lo que falta son profesionales bien formados que puedan responder a ella.',
        MARGIN, y, CONTENT_W, STYLE_BODY
    )

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 4: WHY SELENE — DIFFERENTIATORS
# ═══════════════════════════════════════════════
def page_why_selene(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=55)

    y = draw_header(c)
    y = draw_section_title(c, y, u'\u00bfPor qu\u00e9 estudiar en Selene?')
    y -= 5

    differentiators = [
        (u'Ciencia + Consciencia',
         u'Metodolog\u00eda \u00fanica que integra neurociencia, cronobiolog\u00eda y tradiciones '
         u'milenarias. Cada lecci\u00f3n incluye estudios citados y base cient\u00edfica verificable.'),
        (u'Certificaci\u00f3n verificable',
         u'Certificado digital con c\u00f3digo QR verificable al instante. Tu perfil profesional '
         u'en el directorio premium Selene, visible para potenciales clientes.'),
        (u'7 casos pr\u00e1cticos reales',
         u'No solo teor\u00eda: primera consulta, pareja, crisis existencial, duelo, '
         u'transici\u00f3n vital, conflicto familiar y bloqueo creativo.'),
        (u'3 sesiones supervisadas',
         u'Pr\u00e1ctica real con protocolo progresivo: observar, co-facilitar y facilitar '
         u'con feedback profesional detallado.'),
        (u'Gu\u00eda legal y fiscal completa',
         u'Alta como aut\u00f3noma, facturaci\u00f3n, impuestos, RGPD. Adaptado a Espa\u00f1a '
         u'y Latinoam\u00e9rica (M\u00e9xico, Argentina, Colombia, Chile).'),
        (u'Plan de lanzamiento 90 d\u00edas',
         u'Sales del m\u00e1ster con tu marca lista, tu oferta definida, tu precio calculado '
         u'y un plan paso a paso para empezar a ejercer desde el d\u00eda uno.'),
    ]

    col_w = (CONTENT_W - 15) / 2
    card_h = 95

    for i, (title, desc) in enumerate(differentiators):
        col = i % 2
        row = i // 2
        x = MARGIN + col * (col_w + 15)
        yy = y - row * (card_h + 10)

        draw_card(c, x, yy - card_h + 20, col_w, card_h, BORDER)

        # Gold accent bar at top
        c.saveState()
        c.setFillColor(GOLD)
        c.setFillAlpha(0.12)
        c.roundRect(x, yy + 12, col_w, 8, 4, fill=1, stroke=0)
        c.restoreState()

        # Number
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 18)
        c.drawString(x + 12, yy - 2, u'0%d' % (i + 1))

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(x + 40, yy, title)

        # Description — use paragraph for wrapping
        draw_paragraph(c, desc, x + 14, yy - 16, col_w - 28, STYLE_BODY_SMALL)

    y -= 3 * (card_h + 10) + 5

    # Comparison strip
    draw_gold_line(c, y + 5)
    y -= 20

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 12)
    c.drawCentredString(W / 2, y, u'Lo que nos diferencia')
    y -= 22

    others = [
        u'Predicciones gen\u00e9ricas',
        u'Sin base cient\u00edfica',
        u'Solo hor\u00f3scopo solar',
        u'Sin pr\u00e1ctica real',
    ]
    selene = [
        u'Neurociencia + astrolog\u00eda',
        u'Estudios citados en cada lecci\u00f3n',
        u'10 planetas + nodos + casas',
        u'7 casos + 3 sesiones supervisadas',
    ]

    # Two column comparison
    mid = W / 2
    c.setFont('Helvetica-Bold', 8)
    c.setFillColor(RED_DIM)
    c.drawCentredString(mid - 100, y, u'OTRAS FORMACIONES')
    c.setFillColor(GOLD)
    c.drawCentredString(mid + 100, y, u'SELENE')
    y -= 16

    for i in range(4):
        yy = y - i * 16
        # X mark
        c.setFillColor(RED_DIM)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(mid - 185, yy, u'\u2717')
        c.setFont('Helvetica', 8)
        c.drawString(mid - 173, yy, others[i])
        # Check mark
        c.setFillColor(SUCCESS)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(mid + 20, yy, u'\u2713')
        c.setFont('Helvetica', 8)
        c.drawString(mid + 32, yy, selene[i])

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 5: METHODOLOGY
# ═══════════════════════════════════════════════
def page_methodology(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=22)

    y = draw_header(c)
    y = draw_section_title(c, y, u'El M\u00e9todo Selene')
    y -= 5

    y = draw_paragraph(c,
        u'Nuestro m\u00e9todo integra cuatro pilares fundamentales en una formaci\u00f3n '
        u'progresiva y estructurada. Cada pilar se refuerza con el siguiente, '
        u'creando una base s\u00f3lida para tu pr\u00e1ctica profesional.',
        MARGIN, y, CONTENT_W, STYLE_BODY_WHITE
    )
    y -= 15

    # 4 pillars in a 2x2 grid
    pillars = [
        (u'Conocimiento', u'Astrolog\u00eda, tarot, interpretaci\u00f3n\nde sue\u00f1os, numerolog\u00eda',
         u'Domina las herramientas fundamentales con base cient\u00edfica y rigor metodol\u00f3gico.'),
        (u'Psicolog\u00eda aplicada', u'Escucha activa, l\u00edmites,\ngesti\u00f3n emocional',
         u'Aprende a facilitar sin dirigir, a contener sin absorber, a derivar cuando sea necesario.'),
        (u'Pr\u00e1ctica real', u'7 casos + 3 sesiones\nsupervisadas',
         u'No hay mejor formaci\u00f3n que la experiencia. Practicar\u00e1s con escenarios reales y feedback profesional.'),
        (u'Emprendimiento', u'Marca, pricing, legalidad,\nmarketing',
         u'Sales con todo listo para ejercer: tu marca, tu oferta, tu precio y tu plan de 90 d\u00edas.'),
    ]

    card_w = (CONTENT_W - 15) / 2
    card_h = 115

    STYLE_CARD_CENTER = ParagraphStyle(
        'card_center', fontName='Helvetica', fontSize=8.5, leading=12,
        textColor=WHITE_DIM, alignment=TA_CENTER, spaceAfter=4,
    )

    for i, (title, subtitle, desc) in enumerate(pillars):
        col = i % 2
        row = i // 2
        x = MARGIN + col * (card_w + 15)
        yy = y - row * (card_h + 12)

        draw_card(c, x, yy - card_h + 15, card_w, card_h, GOLD_DIM)

        card_cx = x + card_w / 2

        # Pillar number pill — centered
        pill_w = 32
        c.saveState()
        c.setFillColor(GOLD)
        c.setFillAlpha(0.15)
        c.roundRect(card_cx - pill_w / 2, yy - 2, pill_w, 20, 4, fill=1, stroke=0)
        c.setFillAlpha(1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(card_cx, yy + 2, u'P%d' % (i + 1))
        c.restoreState()

        # Title — centered
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 11)
        c.drawCentredString(card_cx, yy - 18, title)

        # Subtitle — centered
        c.setFillColor(GOLD_DIM)
        c.setFont('Helvetica', 8)
        sub_lines = subtitle.split('\n')
        for j, sl in enumerate(sub_lines):
            c.drawCentredString(card_cx, yy - 32 - j * 10, sl)

        # Description — centered
        draw_paragraph(c, desc, x + 14, yy - 55, card_w - 28, STYLE_CARD_CENTER)

    y -= 2 * (card_h + 12) + 15

    # Process flow
    draw_gold_line(c, y + 5)
    y -= 20

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 14)
    c.drawCentredString(W / 2, y, u'Tu recorrido formativo')
    y -= 35

    steps = [
        (u'01', u'Fundamentos', u'M\u00f3d. 1-3'),
        (u'02', u'Pr\u00e1ctica', u'M\u00f3d. 4-7'),
        (u'03', u'Negocio', u'M\u00f3d. 8-10'),
        (u'04', u'Lanzamiento', u'M\u00f3d. 11-12'),
    ]

    step_w = (CONTENT_W) / 4
    for i, (num, label, refs) in enumerate(steps):
        x = MARGIN + i * step_w + step_w / 2

        # Circle
        c.saveState()
        c.setStrokeColor(GOLD)
        c.setLineWidth(1.2)
        c.setFillColor(BG_CARD)
        c.circle(x, y, 20, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 13)
        c.drawCentredString(x, y - 5, num)
        c.restoreState()

        # Label
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(x, y - 30, label)
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 7.5)
        c.drawCentredString(x, y - 42, refs)

        # Arrow
        if i < 3:
            ax = x + 25
            c.saveState()
            c.setStrokeColor(GOLD_DIM)
            c.setStrokeAlpha(0.5)
            c.setLineWidth(0.7)
            end_x = ax + step_w - 50
            c.line(ax, y, end_x, y)
            c.line(end_x, y, end_x - 5, y + 3)
            c.line(end_x, y, end_x - 5, y - 3)
            c.restoreState()

    # Duration strip at bottom
    y -= 60
    draw_card(c, MARGIN, y - 30, CONTENT_W, 35, GOLD_DIM)
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 10)
    c.drawCentredString(W / 2, y - 18,
        u'80 horas  \u00b7  12 m\u00f3dulos  \u00b7  40 lecciones  \u00b7  9 evaluaciones  \u00b7  1 examen final')

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 6: CURRICULUM PART 1 (Modules 1-6)
# ═══════════════════════════════════════════════
def page_curriculum_1(c):
    draw_bg(c)

    y = draw_header(c)
    y = draw_section_title(c, y, u'Plan de estudios')
    y -= 2

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y,
        u'Fase 1: Fundamentos  +  Fase 2: Pr\u00e1ctica cl\u00ednica')
    y -= 25

    modules_1 = [
        (u'M1', u'El M\u00e9todo Selene',
         u'Filosof\u00eda Selene, tu perfil como gu\u00eda, \u00e9tica y c\u00f3digo de conducta profesional.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M2', u'Integraci\u00f3n de disciplinas',
         u'Combinar astrolog\u00eda + tarot + sue\u00f1os + constelaciones. Tu toolkit personalizado.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M3', u'Psicolog\u00eda para gu\u00edas',
         u'Escucha activa (Carl Rogers), transferencia, l\u00edmites profesionales, cu\u00e1ndo derivar.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M4', u'La sesi\u00f3n profesional',
         u'Estructura de sesi\u00f3n, preguntas poderosas, gesti\u00f3n emocional: llanto, silencio, resistencia.',
         u'3 lecciones'),
        (u'M5', u'Casos pr\u00e1cticos I',
         u'Caso 1: Primera consulta. Caso 2: Pareja. Caso 3: Crisis existencial. Caso 4: Duelo y p\u00e9rdida.',
         u'4 lecciones + evaluaci\u00f3n'),
        (u'M6', u'Casos pr\u00e1cticos II',
         u'Caso 5: Transici\u00f3n vital. Caso 6: Conflicto familiar intergeneracional. Caso 7: Bloqueo creativo.',
         u'3 lecciones + evaluaci\u00f3n'),
    ]

    _draw_module_list(c, y, modules_1)
    draw_footer(c)


def page_curriculum_2(c):
    draw_bg(c)

    y = draw_header(c)

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, y, u'Plan de estudios (cont.)')
    y -= 12
    draw_gold_line(c, y, W / 2 - 60, W / 2 + 60)
    y -= 18

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y,
        u'Fase 2: Pr\u00e1ctica supervisada  +  Fase 3: Negocio  +  Fase 4: Lanzamiento')
    y -= 25

    modules_2 = [
        (u'M7', u'Pr\u00e1cticas supervisadas',
         u'Protocolo de supervisi\u00f3n. Sesi\u00f3n 1: observar y analizar. Sesi\u00f3n 2: co-facilitar. Sesi\u00f3n 3: facilitar con feedback.',
         u'3 sesiones + autoevaluaci\u00f3n'),
        (u'M8', u'Tu marca personal',
         u'Posicionamiento y nicho, presencia online (web y redes), testimonios y portfolio profesional.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M9', u'Modelo de negocio',
         u'Pricing con datos reales del mercado. Formatos: 1:1, grupales, talleres, retiros. Herramientas: agenda, pagos, CRM.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M10', u'Marketing y captaci\u00f3n',
         u'Pinterest + Instagram: atraer sin vender. Email marketing: tu lista es tu activo. Referidos y boca a boca.',
         u'3 lecciones'),
        (u'M11', u'Legalidad y fiscalidad',
         u'Alta como profesional en Espa\u00f1a y Latam. Facturaci\u00f3n, impuestos, contabilidad. RGPD y protecci\u00f3n de datos.',
         u'3 lecciones + evaluaci\u00f3n'),
        (u'M12', u'Plan de lanzamiento',
         u'Tu plan de 90 d\u00edas. Las 30 lecturas gratuitas: tu rito de paso. Mentor\u00eda continua. Examen final + proyecto de marca.',
         u'3 lecciones + examen final'),
    ]

    _draw_module_list(c, y, modules_2)
    draw_footer(c)


def _draw_module_list(c, y, modules):
    """Draw a list of module cards"""
    row_h = 68
    col_w = (CONTENT_W - 12) / 2

    for i, (code, title, desc, meta) in enumerate(modules):
        col = i % 2
        row = i // 2
        x = MARGIN + col * (col_w + 12)
        yy = y - row * (row_h + 8)

        draw_card(c, x, yy - row_h + 15, col_w, row_h)

        # Module badge
        c.saveState()
        c.setFillColor(GOLD)
        c.setFillAlpha(0.15)
        c.roundRect(x + 8, yy - 5, 32, 20, 4, fill=1, stroke=0)
        c.setFillAlpha(1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(x + 24, yy - 1, code)
        c.restoreState()

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9.5)
        c.drawString(x + 46, yy + 1, title)

        # Description
        draw_paragraph(c, desc, x + 12, yy - 16, col_w - 24, STYLE_BODY_SMALL)

        # Meta
        c.setFillColor(GOLD_DIM)
        c.setFont('Helvetica', 7)
        c.drawString(x + 12, yy - row_h + 20, meta)


# ═══════════════════════════════════════════════
# PAGE 8: CAREER OUTCOMES + ROI
# ═══════════════════════════════════════════════
def page_outcomes(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=88)

    y = draw_header(c)
    y = draw_section_title(c, y, u'Salidas profesionales')
    y -= 5

    # ROI cards — 3 per row for better spacing
    roi_data = [
        (u'40-180 \u20ac', u'Precio por sesi\u00f3n\n(Espa\u00f1a 2025)'),
        (u'2-3 sesiones', u'Para recuperar\ntu inversi\u00f3n'),
        (u'1.200+ \u20ac/mes', u'Con 4 sesiones\npor semana'),
    ]
    card_w = (CONTENT_W - 20) / 3
    for i, (big, small) in enumerate(roi_data):
        x = MARGIN + i * (card_w + 10)
        draw_big_number(c, x, y, big, small, card_w)
    y -= 80

    # What you can do
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(MARGIN, y, u'Al terminar podr\u00e1s:')
    y -= 18

    outcomes = [
        u'Ejercer como gu\u00eda espiritual profesional de forma independiente',
        u'Ofrecer sesiones de astrolog\u00eda, tarot, sue\u00f1os e interpretaci\u00f3n hol\u00edstica',
        u'Crear y gestionar tu propia marca personal en el sector',
        u'Cobrar sesiones entre 40 \u20ac y 180 \u20ac seg\u00fan tu mercado y experiencia',
        u'Organizar talleres grupales, retiros y formaciones propias',
        u'Operar legalmente como aut\u00f3noma en Espa\u00f1a o Latinoam\u00e9rica',
        u'Publicar tu perfil en el directorio profesional Selene',
    ]

    for i, item in enumerate(outcomes):
        yy = y - i * 19
        c.setFillColor(SUCCESS)
        c.setFont('Helvetica', 10)
        c.drawString(MARGIN + 5, yy, u'\u2713')
        c.setFillColor(WHITE)
        c.setFont('Helvetica', 9.5)
        c.drawString(MARGIN + 20, yy, item)

    y -= len(outcomes) * 19 + 15

    # Formatos de trabajo
    draw_gold_line(c, y + 5)
    y -= 18

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(MARGIN, y, u'Formatos de trabajo')
    y -= 20

    formats = [
        (u'Consultas 1:1', u'Sesiones individuales presenciales u online. El formato m\u00e1s demandado.'),
        (u'Talleres grupales', u'Workshops tem\u00e1ticos para grupos de 8-15 personas.'),
        (u'Retiros', u'Experiencias inmersivas de fin de semana. Alto valor percibido.'),
        (u'Programas online', u'Cursos grabados o en directo. Escalable e independiente de tu tiempo.'),
        (u'Contenido digital', u'Blog, podcast, newsletter. Construye audiencia y autoridad.'),
    ]

    col_w = (CONTENT_W - 10) / 2
    for i, (title, desc) in enumerate(formats):
        col = i % 2
        row = i // 2
        x = MARGIN + col * (col_w + 10)
        yy = y - row * 38

        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 9)
        c.drawString(x, yy, title)
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 8)
        # Simple wrap
        words = desc.split()
        line = ''
        lnum = 0
        for w in words:
            test = line + ' ' + w if line else w
            if c.stringWidth(test, 'Helvetica', 8) < col_w - 10:
                line = test
            else:
                c.drawString(x, yy - 13 - lnum * 10, line)
                line = w
                lnum += 1
        if line:
            c.drawString(x, yy - 13 - lnum * 10, line)

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 9: CERTIFICATION
# ═══════════════════════════════════════════════
def page_certification(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=99)

    y = draw_header(c)
    y = draw_section_title(c, y, u'Certificaci\u00f3n')
    y -= 5

    y = draw_paragraph(c,
        u'Al completar los 12 m\u00f3dulos y aprobar el examen final (m\u00ednimo 70%), '
        u'recibir\u00e1s tu certificado oficial de <b>Gu\u00eda Profesional Certificada Selene</b>. '
        u'Este certificado es verificable mediante c\u00f3digo QR y te da acceso al directorio '
        u'profesional de Selene Academia.',
        MARGIN, y, CONTENT_W, STYLE_BODY_WHITE
    )
    y -= 15

    # Certificate mockup card
    cert_h = 160
    draw_card(c, MARGIN + 30, y - cert_h, CONTENT_W - 60, cert_h, GOLD)

    cy = y - 20
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawCentredString(W / 2, cy, u'S E L E N E   A C A D E M I A')
    cy -= 8
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, cy, u'CERTIFICADO DE FINALIZACI\u00d3N')
    cy -= 18

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W / 2, cy, u'Se certifica que')
    cy -= 18
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Oblique', 16)
    c.drawCentredString(W / 2, cy, u'[Tu nombre aqu\u00ed]')
    cy -= 16
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 8)
    c.drawCentredString(W / 2, cy, u'ha completado con \u00e9xito el curso')
    cy -= 16
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 12)
    c.drawCentredString(W / 2, cy, u'Gu\u00eda Espiritual Profesional')
    cy -= 13
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, cy, u'80h de formaci\u00f3n  \u00b7  12 m\u00f3dulos  \u00b7  Evaluaci\u00f3n superada')
    cy -= 22
    c.setStrokeColor(GOLD_DIM)
    c.setLineWidth(0.5)
    c.line(W / 2 - 55, cy, W / 2 + 55, cy)
    cy -= 10
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, cy, u'Direcci\u00f3n Acad\u00e9mica \u2014 Selene Academia')

    y -= cert_h + 20

    # What the cert includes
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 13)
    c.drawString(MARGIN, y, u'Tu certificaci\u00f3n incluye:')
    y -= 20

    cert_features = [
        (u'Certificado digital verificable', u'PDF profesional con c\u00f3digo QR de verificaci\u00f3n instant\u00e1nea. Comparte en redes, web y con clientes.'),
        (u'V\u00e1lido internacionalmente', u'Certificaci\u00f3n reconocida para ejercer en Espa\u00f1a, M\u00e9xico, Argentina, Colombia, Chile y toda Latinoam\u00e9rica. Programa alineado con est\u00e1ndares IPHM (International Practitioners of Holistic Medicine).'),
        (u'Perfil en directorio profesional', u'Tu p\u00e1gina profesional en el directorio Selene, visible para clientes que buscan gu\u00edas certificados.'),
        (u'Comunidad de graduados', u'Grupo exclusivo para supervisi\u00f3n entre pares, casos compartidos y formaci\u00f3n continua.'),
    ]

    for i, (title, desc) in enumerate(cert_features):
        yy = y - i * 42

        # Number pill
        c.saveState()
        c.setFillColor(GOLD)
        c.setFillAlpha(0.15)
        c.roundRect(MARGIN, yy - 3, 24, 18, 4, fill=1, stroke=0)
        c.setFillAlpha(1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(MARGIN + 12, yy + 1, str(i + 1))
        c.restoreState()

        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 10)
        c.drawString(MARGIN + 32, yy + 2, title)

        draw_paragraph(c, desc, MARGIN + 32, yy - 12, CONTENT_W - 35, STYLE_BODY_SMALL)

    # Premium stat
    y -= len(cert_features) * 42 + 10
    draw_gold_line(c, y + 5)
    y -= 15

    draw_card(c, MARGIN, y - 45, CONTENT_W, 50, GOLD_DIM)
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(W / 2, y - 12,
        u'El 85% de los clientes prefieren profesionales certificados')
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y - 30,
        u'y pagan un 20-40% m\u00e1s por sus servicios (ICF Global Study 2023)')

    draw_footer(c)


# ═══════════════════════════════════════════════
# PAGE 10: TESTIMONIALS + CTA
# ═══════════════════════════════════════════════
def page_cta(c):
    draw_bg(c)
    draw_constellation_dots(c, seed=44)

    y = draw_header(c)

    # Testimonials
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, y, u'Lo que dicen nuestras alumnas')
    y -= 12
    draw_gold_line(c, y, W / 2 - 60, W / 2 + 60)
    y -= 25

    testimonials = [
        (u'L.M., Escorpio',
         u'Me dio escalofr\u00edos lo precisa que fue. Nunca hab\u00eda le\u00eddo algo que me describiera tan bien. '
         u'Si esto es lo que ofrece el m\u00e9todo Selene, quiero aprenderlo todo.'),
        (u'A.R., C\u00e1ncer',
         u'Pens\u00e9 que ser\u00eda gen\u00e9rico, pero toc\u00f3 puntos que solo yo conozco. '
         u'La combinaci\u00f3n de astrolog\u00eda con psicolog\u00eda real es lo que diferencia a Selene.'),
        (u'M.R., Sagitario',
         u'Me ayud\u00f3 a entender patrones que llevaba repitiendo toda mi vida. '
         u'Es autoconocimiento profundo. Ahora quiero guiar a otros con la misma claridad.'),
    ]

    for i, (name, quote) in enumerate(testimonials):
        card_h = 62
        yy = y - i * (card_h + 10)
        draw_card(c, MARGIN, yy - card_h + 20, CONTENT_W, card_h, BORDER)

        # Stars
        c.setFillColor(GOLD)
        c.setFont('Helvetica', 8)
        c.drawString(MARGIN + 15, yy + 5, u'\u2605' * 5)

        # Quote
        draw_paragraph(c,
            u'<i>\u00ab%s\u00bb</i>' % quote,
            MARGIN + 15, yy - 8, CONTENT_W - 30, STYLE_BODY_SMALL
        )

        # Name
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 8)
        c.drawString(MARGIN + 15, yy - card_h + 26, u'\u2014 %s' % name)

    y -= 3 * (62 + 10) + 15

    # ── Final CTA ──
    draw_gold_line(c, y + 5)
    y -= 10

    # Big CTA card
    cta_h = 155
    draw_card(c, MARGIN - 5, y - cta_h, CONTENT_W + 10, cta_h, GOLD)

    # Glow behind CTA
    draw_glow(c, W / 2, y - cta_h / 2, 100, PURPLE, 0.08)

    cta_y = y - 18
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, cta_y, u'Ya tienes el don.')
    cta_y -= 28
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, cta_y, u'Ahora convi\u00e9rtelo en tu profesi\u00f3n.')
    cta_y -= 25

    # Price
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(W / 2, cta_y, u'149,99 \u20ac')
    cta_y -= 16
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, cta_y,
        u'o 3 cuotas de 50 \u20ac/mes  |  Garant\u00eda 14 d\u00edas  |  Acceso de por vida')
    cta_y -= 13
    c.setFillColor(WHITE_DIMMER)
    c.setFont('Helvetica', 7.5)
    c.drawCentredString(W / 2, cta_y,
        u'$164 USD  \u00b7  $2.899 MXN  \u00b7  \u00a3129 GBP  \u00b7  $179 AUD')
    cta_y -= 18

    # URL
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 10)
    c.drawCentredString(W / 2, cta_y, u'academy.selenaura.com/programa/guia-profesional')

    draw_footer(c)


# ═══════════════════════════════════════════════
# BUILD PDF
# ═══════════════════════════════════════════════
def main():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle(u'M\u00e1ster en Gu\u00eda Espiritual Profesional \u2014 Selene Academia')
    c.setAuthor(u'Selene Academia')
    c.setSubject(u'Programa formativo para gu\u00edas espirituales profesionales')
    c.setCreator(u'Selene Academia \u2014 academy.selenaura.com')

    pages = [
        page_cover,
        page_vision,
        page_motivation,
        page_why_selene,
        page_methodology,
        page_curriculum_1,
        page_curriculum_2,
        page_outcomes,
        page_certification,
        page_cta,
    ]

    for i, page_fn in enumerate(pages):
        page_fn(c)
        if i < len(pages) - 1:
            c.showPage()

    c.save()
    print(f'PDF generated: {OUTPUT}')
    print(f'Pages: {len(pages)}')
    print(f'Size: {os.path.getsize(OUTPUT) / 1024:.1f} KB')


if __name__ == '__main__':
    main()
