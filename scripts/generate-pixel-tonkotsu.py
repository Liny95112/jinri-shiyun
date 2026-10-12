"""Draw the 32x32 tonkotsu ramen anchor with 今日食运's locked pixel palette."""
from pathlib import Path
import runpy
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
P = runpy.run_path(str(Path(__file__).with_name("generate-pixel-fortune.py")))["P"]
USED = ("ink", "wood_dark", "wood", "cream", "paper", "red", "pink", "matcha", "gold", "orange")
assert len(USED) <= 10
assert all(key in P for key in USED)

def draw_tonkotsu() -> Image.Image:
    # Spec lock: 32x32 RGBA, right-top light, dark-brown outline, <=10 shared colors.
    im = Image.new("RGBA", (32, 32), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    def rect(box, color): d.rectangle(box, fill=P[color])
    def poly(points, color): d.polygon(points, fill=P[color])
    def ellipse(box, color): d.ellipse(box, fill=P[color])

    # Two seaweed leaves sit behind the broth but remain attached to the rim.
    rect((6, 5, 11, 17), "ink")
    rect((7, 6, 10, 16), "matcha")
    rect((9, 7, 10, 12), "wood_dark")
    rect((22, 6, 26, 17), "ink")
    rect((23, 7, 25, 16), "matcha")
    rect((24, 7, 25, 12), "wood_dark")

    # A compact ceramic bowl with a red glaze and a single pale band.
    poly([(5, 16), (27, 16), (27, 22), (24, 27), (21, 30), (10, 30),
          (7, 27), (4, 22), (4, 18)], "ink")
    poly([(6, 18), (25, 18), (25, 22), (22, 27), (20, 28), (11, 28),
          (8, 26), (6, 22)], "red")
    rect((6, 20, 9, 23), "wood_dark")
    rect((22, 20, 25, 23), "orange")
    rect((8, 23, 23, 24), "cream")
    rect((10, 25, 21, 25), "wood_dark")
    rect((14, 26, 18, 27), "paper")
    rect((15, 26, 17, 27), "red")
    rect((10, 29, 21, 30), "ink")

    # Thick pixel rim and pale tonkotsu broth.
    poly([(6, 11), (25, 11), (28, 13), (30, 17), (28, 20),
          (25, 22), (6, 22), (3, 20), (2, 17), (4, 13)], "ink")
    poly([(6, 13), (25, 13), (27, 14), (28, 17), (26, 19),
          (24, 20), (7, 20), (5, 19), (4, 17), (5, 14)], "cream")
    rect((7, 15, 25, 19), "paper")
    rect((6, 17, 8, 19), "wood")
    rect((24, 17, 27, 18), "cream")

    # Chashu's warm pink spiral, an egg with golden yolk, and visible noodles.
    ellipse((7, 13, 15, 20), "wood_dark")
    ellipse((8, 14, 14, 19), "pink")
    rect((10, 15, 13, 16), "cream")
    rect((10, 17, 12, 18), "red")
    rect((14, 17, 19, 17), "gold")
    rect((15, 19, 21, 19), "gold")
    rect((15, 16, 17, 16), "cream")
    ellipse((18, 12, 26, 20), "ink")
    ellipse((19, 13, 25, 19), "cream")
    ellipse((21, 15, 24, 18), "gold")
    rect((23, 14, 24, 14), "paper")
    # Negi scallions: a connected cluster, not scattered single pixels.
    rect((14, 13, 17, 14), "matcha")
    rect((16, 14, 19, 15), "matcha")
    rect((17, 13, 18, 13), "cream")

    opaque = {px[:3] for px in im.getdata() if px[3] == 255}
    allowed = {tuple(bytes.fromhex(P[key][1:])) for key in USED}
    assert opaque <= allowed and len(opaque) <= 10
    assert {px[3] for px in im.getdata()} <= {0, 255}
    return im

if __name__ == "__main__":
    image = draw_tonkotsu()
    out = ROOT / "src/assets/pixel/food/food_tonkotsu_ramen.png"
    out.parent.mkdir(parents=True, exist_ok=True)
    image.save(out)
    print(f"{out}: {image.size}, {len({p[:3] for p in image.getdata() if p[3]})} colors")
