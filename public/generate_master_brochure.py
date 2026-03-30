"""
Selene Academia - Master en Guia Espiritual Profesional
PDF Brochure Generator
Dark theme, gold accents, university-style layout
"""

from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm, cm
from reportlab.lib.colors import HexColor, white, black
from reportlab.pdfgen import canvas
from reportlab.lib.enums import TA_CENTER, TA_LEFT, TA_JUSTIFY
from reportlab.platypus import Paragraph, Frame
from reportlab.lib.styles import ParagraphStyle
import os

# ── Colors ──
BG = HexColor('#0A0A0F')
BG_CARD = HexColor('#141420')
GOLD = HexColor('#C9A84C')
GOLD_DIM = HexColor('#8B7535')
TEAL = HexColor('#006B77')
WHITE = HexColor('#E8E8E8')
WHITE_DIM = HexColor('#9A9AB0')
PURPLE = HexColor('#2D1B4E')
SUCCESS = HexColor('#00D68F')
BORDER = HexColor('#2A2A3C')

W, H = A4  # 210 x 297 mm

OUTPUT = os.path.join(os.path.dirname(__file__), 'master-brochure.pdf')


def draw_bg(c):
    """Draw dark background with subtle gradient effect"""
    c.setFillColor(BG)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def draw_gold_line(c, y, x1=40, x2=None):
    """Draw a thin gold decorative line"""
    if x2 is None:
        x2 = W - 40
    c.setStrokeColor(GOLD)
    c.setLineWidth(0.5)
    c.line(x1, y, x2, y)


def draw_section_box(c, y, title, width=None):
    """Draw a bordered pill-style section title"""
    if width is None:
        width = c.stringWidth(title, 'Helvetica-Bold', 9) + 24
    x = 50
    c.setStrokeColor(GOLD_DIM)
    c.setLineWidth(0.6)
    c.setFillColor(HexColor('#1A1A2E'))
    c.roundRect(x, y - 4, width, 20, 6, fill=1, stroke=1)
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 9)
    c.drawString(x + 12, y + 2, title.upper())
    return y - 30


def draw_star(c, x, y, size=3):
    """Draw a small decorative star/diamond"""
    c.setFillColor(GOLD)
    p = c.beginPath()
    p.moveTo(x, y + size)
    p.lineTo(x + size * 0.6, y)
    p.lineTo(x, y - size)
    p.lineTo(x - size * 0.6, y)
    p.close()
    c.drawPath(p, fill=1, stroke=0)


def draw_constellation_dots(c):
    """Draw subtle constellation-like dots"""
    import random
    random.seed(42)
    c.setFillColor(HexColor('#C9A84C'))
    for _ in range(30):
        x = random.randint(30, int(W) - 30)
        y = random.randint(30, int(H) - 30)
        opacity = random.uniform(0.02, 0.06)
        c.setFillColor(GOLD)
        c.setFillAlpha(opacity)
        c.circle(x, y, random.uniform(0.5, 1.5), fill=1, stroke=0)
    c.setFillAlpha(1)


# ═══════════════════════════════════════════════
# PAGE 1: COVER
# ═══════════════════════════════════════════════
def page_cover(c):
    draw_bg(c)
    draw_constellation_dots(c)

    # Top glow effect
    c.setFillColor(PURPLE)
    c.setFillAlpha(0.15)
    c.circle(W / 2, H - 100, 200, fill=1, stroke=0)
    c.setFillAlpha(0.08)
    c.setFillColor(GOLD)
    c.circle(W / 2, H - 100, 120, fill=1, stroke=0)
    c.setFillAlpha(1)

    # Moon icon (simple crescent)
    cy = H - 160
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.setFillColor(BG)
    c.circle(W / 2, cy, 25, fill=0, stroke=1)
    c.setFillColor(BG)
    c.circle(W / 2 + 10, cy + 5, 20, fill=1, stroke=0)

    # Brand
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 11)
    c.drawCentredString(W / 2, cy - 45, 'S E L E N E   A C A D E M I A')

    # Decorative line
    draw_gold_line(c, cy - 60, W / 2 - 80, W / 2 + 80)

    # Title
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 28)
    c.drawCentredString(W / 2, H / 2 + 40, 'Master en')
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 28)
    c.drawCentredString(W / 2, H / 2 + 5, 'Guia Espiritual')
    c.drawCentredString(W / 2, H / 2 - 30, 'Profesional')

    # Subtitle
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 12)
    c.drawCentredString(W / 2, H / 2 - 70, 'Convierte tu don en tu profesion')

    # Key facts strip
    y_facts = H / 2 - 120
    draw_gold_line(c, y_facts + 15, W / 2 - 140, W / 2 + 140)
    facts = ['80 horas', '12 modulos', '7 casos practicos', 'Certificacion']
    c.setFont('Helvetica', 9)
    x_start = 85
    spacing = (W - 170) / (len(facts) - 1)
    for i, fact in enumerate(facts):
        x = x_start + i * spacing
        draw_star(c, x, y_facts - 5)
        c.setFillColor(WHITE_DIM)
        c.drawCentredString(x, y_facts - 20, fact)

    draw_gold_line(c, y_facts - 35, W / 2 - 140, W / 2 + 140)

    # Price
    y_price = 160
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 10)
    c.drawCentredString(W / 2, y_price + 25, 'Inversion')

    # Strikethrough old price
    c.setFillColor(HexColor('#666666'))
    c.setFont('Helvetica', 14)
    old_w = c.stringWidth('299 EUR', 'Helvetica', 14)
    c.drawCentredString(W / 2 - 45, y_price, '299 EUR')
    c.setStrokeColor(HexColor('#666666'))
    c.setLineWidth(1)
    c.line(W / 2 - 45 - old_w / 2, y_price + 5, W / 2 - 45 + old_w / 2, y_price + 5)

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(W / 2 + 45, y_price, '149,99 EUR')

    # -50% badge
    c.setFillColor(HexColor('#FF4444'))
    c.setFillAlpha(0.2)
    c.roundRect(W / 2 + 105, y_price - 5, 40, 20, 4, fill=1, stroke=0)
    c.setFillAlpha(1)
    c.setFillColor(HexColor('#FF6B6B'))
    c.setFont('Helvetica-Bold', 8)
    c.drawCentredString(W / 2 + 125, y_price + 1, '-50%')

    # Payment option
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y_price - 25, 'o 3 cuotas de 50 EUR/mes')

    # Footer
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 8)
    c.setFillAlpha(0.4)
    c.drawCentredString(W / 2, 40, 'academy.selenaura.com')
    c.setFillAlpha(1)


# ═══════════════════════════════════════════════
# PAGE 2: WHY SELENE
# ═══════════════════════════════════════════════
def page_why_selene(c):
    draw_bg(c)
    draw_constellation_dots(c)

    y = H - 60
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawString(50, y, 'S E L E N E   A C A D E M I A')
    draw_gold_line(c, y - 12)

    y -= 50
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(W / 2, y, 'Por que estudiar en Selene?')
    y -= 15

    c.setFillColor(GOLD)
    draw_gold_line(c, y, W / 2 - 60, W / 2 + 60)
    y -= 35

    # 6 differentiators in 2 columns
    differentiators = [
        ('Ciencia + Consciencia', 'Metodologia unica que integra neurociencia, cronobiologia y tradiciones milenarias con estudios citados en cada leccion.'),
        ('Certificacion Verificable', 'Certificado digital con codigo QR verificable. Tu perfil profesional en el directorio Selene.'),
        ('7 Casos Practicos Reales', 'No solo teoria: primera consulta, pareja, crisis, duelo, transicion vital, conflicto familiar, bloqueo creativo.'),
        ('3 Sesiones Supervisadas', 'Practica real con protocolo: observar, co-facilitar y facilitar con feedback profesional.'),
        ('Guia Legal y Fiscal', 'Alta como autonoma, facturacion, impuestos, RGPD. Espana y Latinoamerica (Mexico, Argentina, Colombia, Chile).'),
        ('Plan de Lanzamiento 90 Dias', 'Sales del master con tu marca, tu oferta, tu precio y un plan paso a paso para empezar a ejercer.'),
    ]

    col_w = (W - 120) / 2
    for i, (title, desc) in enumerate(differentiators):
        col = i % 2
        row = i // 2
        x = 50 + col * (col_w + 20)
        yy = y - row * 115

        # Card background
        c.setFillColor(BG_CARD)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.5)
        c.roundRect(x, yy - 65, col_w, 95, 8, fill=1, stroke=1)

        # Gold top accent
        c.setFillColor(GOLD)
        c.setFillAlpha(0.15)
        c.roundRect(x, yy + 22, col_w, 8, 4, fill=1, stroke=0)
        c.setFillAlpha(1)

        # Number
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 20)
        c.drawString(x + 12, yy + 2, f'0{i + 1}')

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 11)
        c.drawString(x + 42, yy + 4, title)

        # Description - wrap text manually
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 8.5)
        words = desc.split()
        lines = []
        current = ''
        for w in words:
            test = current + ' ' + w if current else w
            if c.stringWidth(test, 'Helvetica', 8.5) < col_w - 28:
                current = test
            else:
                lines.append(current)
                current = w
        if current:
            lines.append(current)
        for li, line in enumerate(lines[:3]):
            c.drawString(x + 14, yy - 18 - li * 12, line)

    # Bottom comparison
    y_comp = 130
    draw_gold_line(c, y_comp + 30)

    # "Others vs Selene" mini comparison
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    others = ['Predicciones genericas', 'Sin base cientifica', 'Solo horoscopo solar']
    selene = ['Neurociencia + astrologia', 'Estudios citados', '10 planetas analizados']

    c.setFillColor(HexColor('#FF6B6B'))
    c.setFont('Helvetica-Bold', 9)
    c.drawString(60, y_comp, 'OTRAS FORMACIONES')
    c.setFillColor(GOLD)
    c.drawString(W / 2 + 30, y_comp, 'SELENE')

    for i in range(3):
        yy = y_comp - 18 - i * 15
        c.setFillColor(HexColor('#FF6B6B'))
        c.setFont('Helvetica', 8)
        c.drawString(75, yy, others[i])
        c.drawString(60, yy, 'x')
        c.setFillColor(SUCCESS)
        c.drawString(W / 2 + 30, yy, selene[i])
        c.setFont('Helvetica', 10)
        c.drawString(W / 2 + 16, yy - 1, chr(10003))
        c.setFont('Helvetica', 8)


# ═══════════════════════════════════════════════
# PAGE 3: CURRICULUM
# ═══════════════════════════════════════════════
def page_curriculum(c):
    draw_bg(c)

    y = H - 60
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawString(50, y, 'S E L E N E   A C A D E M I A')
    draw_gold_line(c, y - 12)

    y -= 50
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(W / 2, y, 'Plan de Estudios')
    y -= 10
    c.setFillColor(GOLD)
    draw_gold_line(c, y, W / 2 - 50, W / 2 + 50)
    y -= 10

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 9)
    c.drawCentredString(W / 2, y, '12 modulos  ·  40 lecciones  ·  9 evaluaciones  ·  1 examen final')
    y -= 30

    modules = [
        ('M1', 'El Metodo Selene', 'Filosofia, perfil como guia, etica'),
        ('M2', 'Integracion de disciplinas', 'Astrologia + tarot + suenos'),
        ('M3', 'Psicologia para guias', 'Escucha activa, transferencia, crisis'),
        ('M4', 'La sesion profesional', 'Estructura, preguntas, gestion emocional'),
        ('M5', 'Casos practicos I', 'Primera consulta, pareja, crisis, duelo'),
        ('M6', 'Casos practicos II', 'Transicion, conflicto familiar, bloqueo'),
        ('M7', 'Practicas supervisadas', 'Observar, co-facilitar, facilitar'),
        ('M8', 'Tu marca personal', 'Nicho, presencia online, portfolio'),
        ('M9', 'Modelo de negocio', 'Pricing, formatos, herramientas'),
        ('M10', 'Marketing y captacion', 'Redes, email, referidos'),
        ('M11', 'Legalidad y fiscalidad', 'Alta autonoma, impuestos, RGPD'),
        ('M12', 'Plan de lanzamiento', 'Tu plan de 90 dias + examen final'),
    ]

    row_h = 52
    for i, (code, title, desc) in enumerate(modules):
        col = i % 2
        row = i // 2
        x = 45 + col * ((W - 100) / 2 + 10)
        yy = y - row * row_h
        card_w = (W - 110) / 2

        # Card
        c.setFillColor(BG_CARD)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.4)
        c.roundRect(x, yy - 30, card_w, 42, 6, fill=1, stroke=1)

        # Module number
        c.setFillColor(GOLD)
        c.setFillAlpha(0.2)
        c.roundRect(x + 8, yy - 20, 30, 22, 4, fill=1, stroke=0)
        c.setFillAlpha(1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(x + 23, yy - 14, code)

        # Title
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9.5)
        c.drawString(x + 44, yy - 8, title)

        # Description
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 7.5)
        c.drawString(x + 44, yy - 22, desc)

    # Bottom: process visualization
    y_proc = y - 6 * row_h - 30
    draw_gold_line(c, y_proc + 15)

    steps = [
        ('01', 'Fundamentos', 'M1-M3'),
        ('02', 'Practica', 'M4-M7'),
        ('03', 'Negocio', 'M8-M10'),
        ('04', 'Lanzamiento', 'M11-M12'),
    ]

    step_w = (W - 100) / 4
    for i, (num, label, modules_ref) in enumerate(steps):
        x = 50 + i * step_w + step_w / 2

        # Circle
        c.setStrokeColor(GOLD)
        c.setLineWidth(1)
        c.setFillColor(BG_CARD)
        c.circle(x, y_proc - 20, 18, fill=1, stroke=1)
        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 12)
        c.drawCentredString(x, y_proc - 25, num)

        # Label
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Bold', 9)
        c.drawCentredString(x, y_proc - 48, label)
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 7.5)
        c.drawCentredString(x, y_proc - 60, modules_ref)

        # Arrow
        if i < 3:
            ax = x + 25
            c.setStrokeColor(GOLD_DIM)
            c.setLineWidth(0.5)
            c.line(ax, y_proc - 20, ax + step_w - 50, y_proc - 20)
            # arrowhead
            c.line(ax + step_w - 50, y_proc - 20, ax + step_w - 55, y_proc - 17)
            c.line(ax + step_w - 50, y_proc - 20, ax + step_w - 55, y_proc - 23)


# ═══════════════════════════════════════════════
# PAGE 4: CAREER OUTCOMES + CERTIFICATION
# ═══════════════════════════════════════════════
def page_outcomes(c):
    draw_bg(c)
    draw_constellation_dots(c)

    y = H - 60
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawString(50, y, 'S E L E N E   A C A D E M I A')
    draw_gold_line(c, y - 12)

    # ── Career Outcomes ──
    y -= 50
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 22)
    c.drawCentredString(W / 2, y, 'Salidas Profesionales')
    y -= 10
    c.setFillColor(GOLD)
    draw_gold_line(c, y, W / 2 - 60, W / 2 + 60)
    y -= 30

    # ROI section
    roi_data = [
        ('40 - 180 EUR', 'Precio por sesion\n(Espana 2025)'),
        ('2-3 sesiones', 'Para recuperar\ntu inversion'),
        ('1.200+ EUR/mes', 'Con 4 sesiones\npor semana'),
    ]

    card_w = (W - 130) / 3
    for i, (big, small) in enumerate(roi_data):
        x = 50 + i * (card_w + 15)

        c.setFillColor(BG_CARD)
        c.setStrokeColor(GOLD_DIM)
        c.setLineWidth(0.5)
        c.roundRect(x, y - 55, card_w, 70, 8, fill=1, stroke=1)

        c.setFillColor(GOLD)
        c.setFont('Helvetica-Bold', 16)
        c.drawCentredString(x + card_w / 2, y - 5, big)

        lines = small.split('\n')
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 8)
        for li, line in enumerate(lines):
            c.drawCentredString(x + card_w / 2, y - 25 - li * 11, line)

    y -= 85

    # What you can do
    y = draw_section_box(c, y, 'AL TERMINAR PODRAS')
    outcomes = [
        'Ejercer como guia espiritual profesional de forma independiente',
        'Ofrecer sesiones de astrologia, tarot, suenos e interpretacion holistica',
        'Crear y gestionar tu propia marca personal en el sector',
        'Cobrar sesiones entre 40 EUR y 180 EUR segun tu mercado',
        'Organizar talleres grupales, retiros y formaciones propias',
        'Operar legalmente como autonoma en Espana o Latinoamerica',
    ]

    for i, item in enumerate(outcomes):
        yy = y - i * 18
        c.setFillColor(SUCCESS)
        c.setFont('Helvetica', 10)
        c.drawString(60, yy, chr(10003))
        c.setFillColor(WHITE)
        c.setFont('Helvetica', 9)
        c.drawString(78, yy, item)

    y -= len(outcomes) * 18 + 25

    # ── Certification ──
    draw_gold_line(c, y + 10)
    y -= 15
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, y, 'Certificacion')
    y -= 30

    # Certificate card
    c.setFillColor(BG_CARD)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1)
    c.roundRect(60, y - 120, W - 120, 130, 10, fill=1, stroke=1)

    # Certificate content
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawCentredString(W / 2, y - 5, 'SELENE ACADEMIA')
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 13)
    c.drawCentredString(W / 2, y - 25, 'Guia Profesional Certificada Selene')
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 8.5)
    c.drawCentredString(W / 2, y - 45, 'Certificado digital con codigo QR verificable')
    c.drawCentredString(W / 2, y - 58, 'Perfil premium en el directorio profesional Selene')
    c.drawCentredString(W / 2, y - 71, '12 modulos completados + examen final aprobado (min. 70%)')

    # Signature line
    c.setStrokeColor(GOLD_DIM)
    c.setLineWidth(0.5)
    c.line(W / 2 - 60, y - 95, W / 2 + 60, y - 95)
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 7)
    c.drawCentredString(W / 2, y - 105, 'Irene Lloret Trillo  --  Directora, Selene Academia')


# ═══════════════════════════════════════════════
# PAGE 5: TARGET + TESTIMONIALS + CTA
# ═══════════════════════════════════════════════
def page_target_cta(c):
    draw_bg(c)
    draw_constellation_dots(c)

    y = H - 60
    c.setFillColor(GOLD)
    c.setFont('Helvetica', 10)
    c.drawString(50, y, 'S E L E N E   A C A D E M I A')
    draw_gold_line(c, y - 12)

    # ── For whom ──
    y -= 50
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 20)
    c.drawCentredString(W / 2, y, 'Te suena esto?')
    y -= 30

    pain_points = [
        'Ya lees cartas, tarot o suenos, pero no te atreves a cobrar',
        'Quieres vivir de tu don, pero no sabes por donde empezar',
        'Te falta estructura: como cobro? que digo? es legal?',
        'Necesitas practicar con casos reales antes de lanzarte',
    ]

    for i, item in enumerate(pain_points):
        yy = y - i * 22
        c.setFillColor(GOLD)
        c.setFont('Helvetica', 10)
        draw_star(c, 60, yy + 3)
        c.setFillColor(WHITE)
        c.setFont('Helvetica', 10)
        c.drawString(75, yy, item)

    y -= len(pain_points) * 22 + 10

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 12)
    c.drawCentredString(W / 2, y, 'Este master es para ti.')
    y -= 35

    draw_gold_line(c, y + 10)

    # ── Testimonials ──
    y -= 15
    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 18)
    c.drawCentredString(W / 2, y, 'Lo que dicen nuestras alumnas')
    y -= 30

    testimonials = [
        ('L.M., Escorpio', 'Me dio escalofrios lo precisa que fue. Nunca habia leido algo que me describiera tan bien.'),
        ('A.R., Cancer', 'Pense que seria generico, pero toco puntos que solo yo conozco.'),
        ('M.R., Sagitario', 'Me ayudo a entender patrones que llevaba repitiendo toda mi vida. Es autoconocimiento profundo.'),
    ]

    for i, (name, quote) in enumerate(testimonials):
        card_h = 55
        yy = y - i * (card_h + 10)
        c.setFillColor(BG_CARD)
        c.setStrokeColor(BORDER)
        c.setLineWidth(0.4)
        c.roundRect(50, yy - 35, W - 100, card_h, 8, fill=1, stroke=1)

        # Stars
        c.setFillColor(GOLD)
        c.setFont('Helvetica', 8)
        c.drawString(65, yy + 5, chr(9733) * 5)

        # Quote
        c.setFillColor(WHITE)
        c.setFont('Helvetica-Oblique', 9)
        c.drawString(65, yy - 10, f'"{quote}"')

        # Name
        c.setFillColor(WHITE_DIM)
        c.setFont('Helvetica', 8)
        c.drawString(65, yy - 25, f'-- {name}')

    y -= 3 * 65 + 20
    draw_gold_line(c, y + 5)

    # ── Final CTA ──
    y -= 30
    c.setFillColor(BG_CARD)
    c.setStrokeColor(GOLD)
    c.setLineWidth(1.5)
    c.roundRect(50, y - 100, W - 100, 120, 12, fill=1, stroke=1)

    c.setFillColor(WHITE)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(W / 2, y - 10, 'Ya tienes el don.')
    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 16)
    c.drawCentredString(W / 2, y - 30, 'Ahora conviertelo en tu profesion.')

    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 10)
    c.drawCentredString(W / 2, y - 55, '149,99 EUR  |  3 cuotas de 50 EUR  |  Garantia 14 dias')

    c.setFillColor(GOLD)
    c.setFont('Helvetica-Bold', 11)
    c.drawCentredString(W / 2, y - 80, 'academy.selenaura.com/programa/guia-profesional')

    # Footer
    c.setFillColor(WHITE_DIM)
    c.setFont('Helvetica', 7)
    c.setFillAlpha(0.4)
    c.drawCentredString(W / 2, 30, 'Selene Academia  |  info@selenaura.com  |  selenaura.com')
    c.setFillAlpha(1)


# ═══════════════════════════════════════════════
# BUILD PDF
# ═══════════════════════════════════════════════
def main():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle('Master en Guia Espiritual Profesional - Selene Academia')
    c.setAuthor('Selene Academia')
    c.setSubject('Programa formativo para guias espirituales profesionales')

    page_cover(c)
    c.showPage()

    page_why_selene(c)
    c.showPage()

    page_curriculum(c)
    c.showPage()

    page_outcomes(c)
    c.showPage()

    page_target_cta(c)
    c.save()

    print(f'PDF generated: {OUTPUT}')
    print(f'Size: {os.path.getsize(OUTPUT) / 1024:.1f} KB')


if __name__ == '__main__':
    main()
