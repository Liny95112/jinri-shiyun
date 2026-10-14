"""Generate the shop menu machine sprites using the shared pixel palette."""
from pathlib import Path
from PIL import Image, ImageDraw
import ast, subprocess, sys, json

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / 'src/assets/pixel/machine'
OUT.mkdir(parents=True, exist_ok=True)
source = ast.parse((ROOT / 'scripts/generate-pixel-fortune.py').read_text(encoding='utf-8'))
P = next(ast.literal_eval(n.value) for n in source.body if isinstance(n, ast.Assign) and any(isinstance(t, ast.Name) and t.id == 'P' for t in n.targets))
AUDIT = Path.home() / '.codex/skills/pixel-art/scripts/quality_audit.py'
SPEC = {'food_three_reel_machine.png':(128,16),'machine_lever_idle.png':(32,8),'machine_lever_pull.png':(32,8),'machine_lever_return.png':(32,8),'machine_light_01.png':(16,6),'machine_light_02.png':(16,6)}

def build(name, painter):
    # Re-read locked size and color budget before each individual sprite.
    size, max_colors = SPEC[name]
    image = Image.new('RGBA', (size,size), (0,0,0,0))
    d = ImageDraw.Draw(image)
    def rect(box, color): d.rectangle(box, fill=P[color])
    painter(rect)
    assert image.size == (size,size)
    colors = {p[:3] for p in image.getdata() if p[3]}
    assert all(c in {tuple(bytes.fromhex(v[1:])) for v in P.values()} for c in colors)
    assert len(colors) <= max_colors, (name, len(colors), max_colors)
    path = OUT/name
    image.save(path)
    proc = subprocess.run([sys.executable,str(AUDIT),'--image',str(path),'--grid','16','--max-colors',str(max_colors),'--json'],capture_output=True,text=True)
    data = json.loads(proc.stdout)
    if proc.returncode or data.get('errors'):
        raise RuntimeError(f'{name}: {proc.stdout} {proc.stderr}')
    print(name, size, len(colors), data.get('passed', 'audit complete'))

def body(r):
    # One 128×128 cabinet with three equal reel windows, using the locked shop palette.
    r((15,3,111,112),'ink'); r((10,10,116,110),'ink')
    r((14,9,112,108),'wood_dark'); r((19,10,108,107),'wood')
    r((20,11,108,16),'wood_light'); r((19,18,23,104),'wood_dark')
    r((105,19,109,102),'wood_light')
    r((18,106,110,115),'ink'); r((22,108,106,112),'wood_light')
    r((24,113,46,124),'ink'); r((80,113,103,124),'ink')
    r((27,114,43,120),'wood_dark'); r((83,114,100,120),'wood_dark')
    # Warm menu header and two small lamps; lettering remains accessible HTML.
    r((27,12,101,33),'ink'); r((30,14,98,30),'paper')
    r((33,16,96,18),'cream')
    # A tiny bowl and tea cup flank the sign like a shop's menu plaque.
    r((33,22,42,27),'ink'); r((35,22,40,24),'red'); r((36,25,39,26),'wood_light')
    r((87,21,96,27),'ink'); r((89,22,94,25),'matcha'); r((91,26,93,28),'wood_light')
    # Hanging side menu board keeps the cabinet closer to a small eatery.
    r((2,47,14,81),'ink'); r((4,49,12,78),'paper')
    r((5,52,11,54),'red'); r((5,60,11,61),'wood'); r((5,67,11,68),'matcha')
    # Three hard-edged windows. React renders moving reels over these inner backgrounds.
    for left in (14,48,82):
        r((left,37,left+31,88),'ink')
        r((left+2,39,left+29,85),'wood_dark')
        r((left+3,40,left+28,83),'paper_shadow')
        r((left+4,41,left+27,82),'cream')
        r((left+25,42,left+27,81),'paper')
    # The light horizontal rail is deliberately quiet until all three reels hit.
    r((15,87,113,90),'wood_light')
    r((23,94,104,104),'ink'); r((26,96,101,101),'paper')
    for x,color in ((35,'red'),(48,'gold'),(61,'matcha'),(74,'gold'),(87,'red')):
        r((x,97,x+5,99),color)
    # Right-side lever housing from the existing three-frame lever set.
    r((108,40,120,95),'ink'); r((111,43,117,91),'wood_light')
    r((112,45,113,88),'cream')

def lever(position):
    def paint(r):
        r((3,21,15,31),'ink'); r((5,23,13,28),'wood'); r((7,24,12,25),'wood_light')
        coords={'idle':((12,7,15,24),(8,2,20,13),(10,3,18,8)), 'pull':((14,23,27,26),(19,18,31,30),(22,19,29,22)), 'return':((14,13,19,25),(13,8,25,19),(17,9,23,12))}
        stem,knob,shine=coords[position]
        r(stem,'ink')
        if position=='pull': r((16,23,25,24),'wood_light')
        else: r((15,stem[1]+1,16,22),'wood_light')
        r(knob,'ink')
        r((knob[0]+2,knob[1]+2,knob[2]-2,knob[3]-2),'red')
        r(shine,'pink')
    return paint

def light(bright):
    def paint(r):
        r((0,4,15,13),'ink'); r((2,5,13,11),'wood_dark')
        r((4,3,11,12),'ink'); r((5,4,10,10),'gold' if bright else 'orange')
        if bright: r((7,4,10,6),'cream'); r((6,8,8,9),'paper')
        else: r((8,4,10,5),'paper')
    return paint

build('food_three_reel_machine.png',body)
for state in ('idle','pull','return'): build(f'machine_lever_{state}.png',lever(state))
for i in (1,2): build(f'machine_light_{i:02d}.png',light(i==2))
