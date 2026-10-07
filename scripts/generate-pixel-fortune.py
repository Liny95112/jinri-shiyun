"""Generate the first locked-palette sprite set for 今日食运.

Run with Python 3.8+ and Pillow. Each sprite is drawn on its native pixel grid;
the browser must display it at an integer scale with nearest-neighbor sampling.
"""

import argparse
from pathlib import Path
from PIL import Image, ImageDraw


ROOT = Path(__file__).resolve().parents[1] / "src" / "assets" / "pixel"
P = {
    "ink": "#3F302D",
    "wood_dark": "#6A4539",
    "wood": "#8F5B4A",
    "wood_light": "#E3B990",
    "cream": "#FFF7E7",
    "paper": "#F7E5C5",
    "paper_shadow": "#D9C49C",
    "red": "#BF5F4E",
    "orange": "#D88B58",
    "pink": "#E7A1A1",
    "matcha": "#78946C",
    "matcha_light": "#9FBE91",
    "ice": "#88B5BC",
    "ice_light": "#CEE7E5",
    "gold": "#EFC56D",
    "cocoa": "#A06D52",
}
ALLOWED = {tuple(bytes.fromhex(value[1:])) for value in P.values()}


class Sprite:
    def __init__(self, size):
        self.image = Image.new("RGBA", (size, size), (0, 0, 0, 0))
        self.draw = ImageDraw.Draw(self.image)

    def rect(self, box, color):
        self.draw.rectangle(box, fill=P[color])

    def polygon(self, points, color):
        self.draw.polygon(points, fill=P[color])

    def save(self, folder, name, max_colors=10):
        colors = {rgba[:3] for rgba in self.image.getdata() if rgba[3]}
        alpha = {rgba[3] for rgba in self.image.getdata()}
        assert colors <= ALLOWED, f"{name}: palette drift"
        assert len(colors) <= max_colors, f"{name}: {len(colors)} colors > {max_colors}"
        assert alpha <= {0, 255}, f"{name}: antialiased/partial alpha"
        destination = ROOT / folder / name
        destination.parent.mkdir(parents=True, exist_ok=True)
        self.image.save(destination)
        print(f"{destination.relative_to(ROOT)} {self.image.width}x{self.image.height} {len(colors)} colors")


def jar(offset=0, sticks=0):
    # Spec lock: 64x64, warm wood + red seal, right-top highlights, <=10 colors.
    s = Sprite(64)
    x = lambda n: n + offset
    for index, (sx, height) in enumerate(((25, 15), (31, 11), (37, 16))):
        sway = (sticks if index != 1 else -sticks)
        s.rect((x(sx + sway), height - 8, x(sx + 2 + sway), 20), "ink")
        s.rect((x(sx + 1 + sway), height - 7, x(sx + 1 + sway), 18), "paper")
        s.rect((x(sx + sway), height - 8, x(sx + 2 + sway), height - 6), "red")
    s.polygon([(x(21), 17), (x(43), 17), (x(47), 22), (x(44), 52),
               (x(40), 57), (x(24), 57), (x(20), 52), (x(17), 22)], "ink")
    s.polygon([(x(21), 19), (x(43), 19), (x(45), 23), (x(42), 51),
               (x(39), 54), (x(25), 54), (x(22), 51), (x(19), 23)], "wood")
    s.rect((x(21), 22, x(43), 25), "wood_light")
    s.rect((x(20), 26, x(22), 45), "wood_dark")
    s.rect((x(40), 26, x(43), 45), "wood_light")
    s.rect((x(22), 47, x(41), 51), "wood_dark")
    s.rect((x(25), 28, x(27), 34), "cocoa")
    s.rect((x(37), 29, x(39), 36), "wood_light")
    s.rect((x(22), 37, x(42), 39), "matcha")
    s.rect((x(23), 37, x(27), 37), "matcha_light")
    s.rect((x(29), 32, x(35), 45), "paper")
    s.rect((x(30), 33, x(34), 44), "red")
    s.rect((x(31), 35, x(33), 41), "cream")
    s.rect((x(26), 55, x(38), 57), "wood_dark")
    s.rect((x(25), 58, x(39), 59), "ink")
    return s


def paper():
    # Spec lock: 64x64, transparent slip, empty center for accessible HTML text.
    s = Sprite(64)
    s.rect((18, 2, 46, 60), "ink")
    s.rect((20, 4, 44, 57), "paper")
    s.rect((42, 5, 44, 55), "cream")
    s.rect((20, 4, 44, 8), "red")
    s.rect((22, 10, 42, 11), "gold")
    s.rect((24, 14, 40, 15), "wood_light")
    s.rect((20, 51, 44, 53), "red")
    s.rect((20, 56, 44, 57), "paper_shadow")
    s.rect((24, 24, 25, 38), "paper_shadow")
    s.rect((39, 24, 40, 38), "paper_shadow")
    s.rect((29, 18, 35, 20), "red")
    s.rect((30, 21, 34, 22), "orange")
    return s


def badge():
    # Spec lock: 32x32 shared medallion; the five readable fortune labels stay HTML.
    s = Sprite(32)
    s.polygon([(12, 2), (19, 2), (19, 4), (25, 4), (25, 8), (28, 8),
               (28, 23), (25, 23), (25, 27), (19, 27), (19, 30),
               (12, 30), (12, 27), (6, 27), (6, 23), (3, 23),
               (3, 8), (6, 8), (6, 4), (12, 4)], "ink")
    s.rect((6, 8, 25, 23), "red")
    s.rect((9, 5, 22, 26), "red")
    s.rect((8, 8, 23, 22), "gold")
    s.rect((10, 6, 21, 25), "gold")
    s.rect((11, 8, 20, 23), "paper")
    s.rect((13, 11, 18, 18), "red")
    s.rect((14, 10, 17, 19), "red")
    s.rect((15, 8, 16, 21), "cream")
    s.rect((12, 13, 19, 16), "cream")
    return s


def sparkle(radius):
    # Spec lock: 16x16, a connected 4-way glint with no soft alpha.
    s = Sprite(16)
    c = 8
    s.rect((c, c - radius, c, c + radius), "gold")
    s.rect((c - radius, c, c + radius, c), "gold")
    s.rect((c, c, c, c), "cream")
    return s


def ramen():
    # Spec lock: 32x32 food silhouette, <=10 shared colors.
    s = Sprite(32)
    s.rect((7, 2, 8, 7), "paper_shadow")
    s.rect((14, 1, 15, 6), "paper_shadow")
    s.rect((22, 2, 23, 7), "paper_shadow")
    s.rect((4, 13, 27, 17), "ink")
    s.rect((6, 11, 25, 14), "ink")
    s.rect((7, 12, 24, 15), "paper")
    s.rect((8, 14, 23, 15), "cocoa")
    s.rect((10, 12, 14, 13), "gold")
    s.rect((19, 12, 22, 13), "matcha")
    s.rect((15, 11, 18, 14), "cream")
    s.rect((16, 12, 17, 13), "orange")
    s.polygon([(5, 17), (26, 17), (24, 25), (21, 28), (10, 28), (7, 25)], "ink")
    s.polygon([(7, 18), (24, 18), (22, 24), (20, 26), (11, 26), (9, 24)], "cream")
    s.rect((8, 19, 9, 23), "paper_shadow")
    s.rect((20, 19, 22, 21), "paper")
    s.rect((13, 21, 18, 22), "red")
    s.rect((11, 28, 20, 29), "wood")
    return s


def sushi():
    # Spec lock: 32x32, two nigiri pieces with right-top highlights.
    s = Sprite(32)
    for x, y, fish in ((3, 10, "red"), (16, 14, "orange")):
        s.rect((x, y + 7, x + 12, y + 15), "ink")
        s.rect((x + 1, y + 7, x + 11, y + 13), "cream")
        s.rect((x + 2, y + 13, x + 10, y + 14), "paper_shadow")
        s.rect((x, y + 2, x + 12, y + 8), "ink")
        s.rect((x + 1, y + 3, x + 11, y + 7), fish)
        s.rect((x + 6, y + 3, x + 10, y + 3), "pink" if fish == "red" else "gold")
        s.rect((x + 5, y + 7, x + 7, y + 12), "wood_dark")
    return s


def milk_tea():
    # Spec lock: 32x32, sealed cup, pearls, and a single pixel straw.
    s = Sprite(32)
    s.rect((16, 1, 18, 11), "ink")
    s.rect((17, 2, 17, 10), "ice")
    s.rect((6, 8, 26, 11), "ink")
    s.rect((8, 9, 24, 10), "paper")
    s.polygon([(8, 12), (24, 12), (22, 28), (19, 30), (13, 30), (10, 28)], "ink")
    s.polygon([(10, 13), (22, 13), (20, 27), (18, 28), (14, 28), (12, 27)], "wood_light")
    s.rect((20, 14, 21, 24), "cream")
    s.rect((12, 16, 19, 18), "paper")
    s.rect((14, 20, 18, 23), "red")
    s.rect((13, 25, 14, 26), "wood_dark")
    s.rect((17, 25, 18, 26), "wood_dark")
    return s


def coffee():
    # Spec lock: 32x32, ceramic mug with hard-edged coffee and steam.
    s = Sprite(32)
    s.rect((10, 2, 11, 7), "paper_shadow")
    s.rect((17, 1, 18, 6), "paper_shadow")
    s.rect((5, 11, 24, 26), "ink")
    s.rect((24, 13, 28, 22), "ink")
    s.rect((24, 15, 26, 20), "cream")
    s.rect((7, 13, 22, 23), "cream")
    s.rect((9, 15, 20, 18), "cocoa")
    s.rect((10, 15, 19, 16), "wood_dark")
    s.rect((19, 19, 21, 23), "ice_light")
    s.rect((8, 24, 21, 25), "paper_shadow")
    s.rect((8, 27, 23, 28), "wood")
    return s


def main():
    parser = argparse.ArgumentParser(description="Regenerate a locked-palette pixel asset")
    parser.add_argument("--asset", help="Generate just one PNG (useful for one-at-a-time audits)")
    args = parser.parse_args()
    # The palette and resolution checks above are re-applied before every save.
    fortune_assets = (
        ("fortune_jar_idle.png", jar()),
        ("fortune_jar_shake_01.png", jar(-1, -1)),
        ("fortune_jar_shake_02.png", jar(-3, -2)),
        ("fortune_jar_shake_03.png", jar(0, -1)),
        ("fortune_jar_shake_04.png", jar(3, 2)),
        ("fortune_jar_shake_05.png", jar(1, 1)),
        ("fortune_jar_shake_06.png", jar(0, 1)),
        ("fortune_paper.png", paper()),
        ("fortune_badge.png", badge()),
    )
    if args.asset:
        selected = next(((name, sprite) for name, sprite in fortune_assets if name == args.asset), None)
        if selected is None:
            parser.error(f"unknown fortune asset: {args.asset}")
        selected[1].save("fortune", selected[0])
        return
    for name, sprite in fortune_assets:
        sprite.save("fortune", name)
    for index, radius in enumerate((1, 3, 2), 1):
        sparkle(radius).save("fx", f"sparkle_{index:02d}.png")
    ramen().save("food", "food_ramen.png")
    sushi().save("food", "food_sushi.png")
    milk_tea().save("drink", "drink_milk_tea.png")
    coffee().save("drink", "drink_coffee.png")


if __name__ == "__main__":
    main()
