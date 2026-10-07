"""Generate the home sprites with the locked fortune palette.

Create one asset at a time with --asset, audit it with pixel-art's quality
checker, then continue. No browser build step depends on Python.
"""

import argparse
import runpy
from pathlib import Path

from PIL import Image, ImageDraw


# Reuse the exact 0.6.x color lock and PNG validation; do not fork the palette.
shared = runpy.run_path(str(Path(__file__).with_name("generate-pixel-fortune.py")))
P = shared["P"]
Sprite = shared["Sprite"]


class Canvas(Sprite):
    def __init__(self, width, height):
        self.image = Image.new("RGBA", (width, height), (0, 0, 0, 0))
        self.draw = ImageDraw.Draw(self.image)


def shop(period="day", idle=False):
    # Spec lock: 160x96, warm Japanese street-side diner, right-top light,
    # brown outline, shared 16 colors only. Idle changes local details only.
    assert period in {"morning", "day", "night"}
    s = Canvas(160, 96)
    sky = {"morning": "cream", "day": "paper", "night": "wood_dark"}[period]
    street = {"morning": "paper", "day": "wood_light", "night": "wood"}[period]
    street_edge = "wood_light" if period == "night" else "paper_shadow"
    s.rect((0, 0, 159, 74), sky)
    s.rect((0, 75, 159, 95), street)
    s.rect((0, 75, 159, 77), street_edge)
    if period == "morning":
        # A blocky sunrise stays behind the facade and uses no soft glow.
        s.rect((6, 10, 29, 19), "paper")
        s.rect((10, 6, 25, 23), "gold")
        s.rect((12, 7, 23, 10), "cream")
        s.rect((26, 13, 31, 16), "paper")
    elif period == "night":
        # Large, quiet color blocks make the warm shop windows stand out.
        s.rect((0, 66, 159, 74), "wood")
        s.rect((0, 72, 159, 74), "wood_light")
    for x in (7, 26, 46, 71, 96, 121, 144):
        s.rect((x, 85, x + 10, 86), "paper_shadow")
    for x in (17, 55, 107, 151):
        s.rect((x, 92, x + 6, 93), "paper_shadow")

    # Stepped roof, sign, and wooden facade.
    s.rect((22, 20, 139, 77), "ink")
    s.rect((25, 23, 136, 74), "wood")
    s.rect((29, 27, 133, 72), "wood_light")
    s.rect((19, 17, 142, 25), "ink")
    s.rect((21, 19, 140, 22), "wood_dark")
    s.rect((26, 13, 135, 18), "wood_dark")
    s.rect((28, 13, 132, 14), "wood_light")
    s.rect((39, 5, 119, 18), "ink")
    s.rect((41, 7, 117, 16), "paper")
    s.rect((43, 7, 114, 8), "cream")
    s.rect((45, 10, 54, 14), "red")
    s.rect((47, 9, 52, 10), "orange")
    s.rect((60, 10, 73, 12), "wood_dark")
    s.rect((77, 10, 91, 12), "wood_dark")
    s.rect((95, 10, 109, 12), "wood_dark")
    s.rect((24, 24, 137, 27), "wood_dark")
    s.rect((28, 28, 31, 73), "wood_dark")
    s.rect((131, 28, 134, 73), "wood_dark")
    s.rect((27, 73, 137, 77), "ink")
    s.rect((29, 74, 135, 75), "wood")

    # Lit serving window with a bowl on the counter.
    s.rect((35, 33, 72, 66), "ink")
    s.rect((38, 36, 69, 62), "wood_dark")
    s.rect((40, 38, 67, 59), "gold" if period == "night" else "paper")
    s.rect((63, 39, 67, 58), "paper" if period == "night" else "cream")
    if period == "night":
        s.rect((41, 39, 61, 42), "cream")
    s.rect((39, 51, 68, 53), "wood")
    s.rect((45, 44, 59, 46), "ink")
    s.rect((47, 42, 57, 44), "cream")
    s.rect((48, 46, 56, 49), "red")
    s.rect((48, 49, 56, 50), "wood_dark")
    s.rect((34, 61, 73, 66), "wood_dark")
    s.rect((37, 62, 70, 63), "wood_light")

    # Door and a three-panel noren curtain.
    s.rect((77, 34, 110, 73), "ink")
    s.rect((80, 37, 107, 72), "wood_dark")
    s.rect((82, 42, 105, 72), "paper")
    s.rect((81, 47, 82, 68), "wood")
    s.rect((101, 47, 104, 69), "wood_light")
    s.rect((84, 52, 99, 68), "orange" if period == "night" else "ice")
    s.rect((86, 53, 98, 54), "gold" if period == "night" else "ice_light")
    s.rect((76, 31, 111, 43), "ink")
    s.rect((78, 33, 109, 41), "red")
    for x in (79, 89, 99):
        s.rect((x, 34, x + 8, 42), "red")
        s.rect((x + 5, 34, x + 7, 36), "orange")
        s.rect((x + 3, 38, x + 5, 39), "paper")
    s.rect((88, 33, 89, 42), "ink")
    s.rect((98, 33, 99, 42), "ink")
    if idle:
        # Only the curtain hems shift by one or two native pixels.
        s.rect((79, 42, 87, 43), "red")
        s.rect((100, 42, 107, 44), "red")
        s.rect((84, 44, 87, 44), "orange")
    s.rect((77, 70, 111, 74), "wood_dark")

    # Hanging lantern and small menu board.
    s.rect((123, 25, 124, 31), "ink")
    s.rect((118, 30, 130, 48), "ink")
    s.rect((120, 33, 128, 45), "red")
    s.rect((124, 33, 127, 43), "gold" if period == "night" and idle else "orange")
    s.rect((121, 35, 122, 42), "paper")
    s.rect((121, 30, 127, 32), "gold")
    s.rect((121, 45, 127, 47), "wood_dark")
    s.rect((114, 53, 130, 70), "ink")
    s.rect((116, 55, 128, 68), "paper")
    s.rect((117, 56, 127, 57), "cream")
    s.rect((118, 60, 125, 61), "wood_dark")
    s.rect((118, 64, 123, 65), "red")

    # Two pots at the entrance add life without animation.
    s.rect((12, 75, 26, 82), "ink")
    s.rect((14, 76, 24, 80), "red")
    s.rect((18, 59, 20, 75), "wood_dark")
    s.rect((12, 66, 17, 72), "matcha")
    s.rect((20, 62, 26, 69), "matcha")
    s.rect((16, 56, 22, 64), "matcha_light")
    s.rect((13, 62, 16, 65), "matcha_light")
    s.rect((22, 57, 25, 61), "matcha")
    s.rect((142, 77, 152, 83), "ink")
    s.rect((144, 78, 150, 81), "wood")
    s.rect((146, 65, 147, 77), "wood_dark")
    s.rect((140, 69, 145, 74), "matcha")
    s.rect((148, 65, 154, 71), "matcha_light")
    s.rect((145, 63, 149, 69), "matcha")
    return s


def food_icon():
    # 32x32 neutral rice bowl: it represents eating, not one named dish.
    s = Sprite(32)
    s.rect((19, 2, 20, 12), "ink")
    s.rect((22, 3, 23, 13), "wood")
    s.rect((6, 15, 25, 18), "ink")
    s.rect((8, 12, 23, 16), "paper")
    s.rect((10, 10, 21, 13), "cream")
    s.rect((14, 9, 19, 10), "cream")
    s.rect((17, 11, 21, 12), "gold")
    s.rect((4, 17, 27, 20), "ink")
    s.polygon([(5, 20), (26, 20), (23, 27), (20, 29), (11, 29), (8, 27)], "ink")
    s.polygon([(7, 21), (24, 21), (21, 26), (19, 27), (12, 27), (10, 26)], "red")
    s.rect((19, 21, 22, 24), "orange")
    s.rect((11, 25, 15, 26), "wood_dark")
    s.rect((12, 30, 20, 30), "wood_dark")
    return s


def drink_icon():
    # 32x32 clear everyday cup, without pearls or a coffee-specific label.
    s = Sprite(32)
    s.rect((17, 1, 19, 11), "ink")
    s.rect((18, 2, 18, 10), "matcha")
    s.rect((7, 8, 25, 11), "ink")
    s.rect((9, 9, 23, 10), "paper")
    s.polygon([(8, 12), (24, 12), (22, 27), (20, 30), (12, 30), (10, 27)], "ink")
    s.polygon([(10, 13), (22, 13), (20, 26), (19, 28), (13, 28), (12, 26)], "ice")
    s.rect((19, 14, 21, 24), "ice_light")
    s.rect((11, 15, 15, 16), "cream")
    s.rect((12, 20, 15, 22), "paper")
    s.rect((16, 17, 18, 19), "paper")
    s.rect((14, 27, 18, 28), "wood_light")
    return s


def heart_icon():
    s = Sprite(16)
    s.polygon([(2, 3), (5, 3), (7, 5), (8, 5), (10, 3), (13, 3),
               (15, 5), (15, 9), (8, 15), (7, 15), (1, 9), (1, 5)], "ink")
    s.polygon([(3, 5), (5, 5), (7, 7), (9, 7), (11, 5), (13, 5),
               (13, 9), (8, 13), (7, 13), (3, 9)], "red")
    s.rect((10, 5, 11, 6), "pink")
    return s


def history_icon():
    s = Sprite(16)
    s.rect((4, 1, 11, 14), "ink")
    s.rect((2, 4, 13, 11), "ink")
    s.rect((4, 3, 11, 12), "paper")
    s.rect((3, 5, 12, 10), "paper")
    s.rect((7, 4, 8, 8), "wood_dark")
    s.rect((8, 7, 10, 8), "wood_dark")
    s.rect((9, 4, 10, 4), "cream")
    return s


def favorite_icon():
    s = Sprite(16)
    s.polygon([(7, 1), (9, 1), (10, 5), (14, 5), (15, 7),
               (12, 10), (13, 14), (11, 15), (8, 12), (5, 15),
               (3, 14), (4, 10), (1, 7), (2, 5), (6, 5)], "ink")
    s.polygon([(7, 3), (9, 3), (10, 6), (13, 6), (11, 9),
               (11, 12), (8, 10), (5, 12), (5, 9), (3, 6), (6, 6)], "gold")
    s.rect((8, 3, 9, 6), "cream")
    return s


def dex_icon():
    s = Sprite(16)
    s.rect((1, 3, 14, 14), "ink")
    s.rect((3, 4, 7, 12), "paper")
    s.rect((9, 4, 13, 12), "paper")
    s.rect((7, 3, 8, 13), "red")
    s.rect((3, 5, 6, 5), "cream")
    s.rect((9, 5, 12, 5), "cream")
    s.rect((4, 8, 6, 8), "wood")
    s.rect((10, 8, 12, 8), "wood")
    s.rect((3, 13, 7, 13), "wood_light")
    s.rect((9, 13, 13, 13), "wood_light")
    return s


ASSETS = {
    "home_shop.png": (shop, 15),  # Original 0.7.0 scene kept as a source reference.
    "home_shop_morning.png": (lambda: shop("morning"), 16),
    "home_shop_morning_idle.png": (lambda: shop("morning", True), 16),
    "home_shop_day.png": (lambda: shop("day"), 16),
    "home_shop_day_idle.png": (lambda: shop("day", True), 16),
    "home_shop_night.png": (lambda: shop("night"), 16),
    "home_shop_night_idle.png": (lambda: shop("night", True), 16),
    "home_food_icon.png": (food_icon, 10),
    "home_drink_icon.png": (drink_icon, 10),
    "icon_heart.png": (heart_icon, 8),
    "icon_history.png": (history_icon, 8),
    "icon_favorite.png": (favorite_icon, 8),
    "icon_dex.png": (dex_icon, 8),
}


def main():
    parser = argparse.ArgumentParser(description="Create one locked-palette home sprite")
    parser.add_argument("--asset", required=True, choices=ASSETS)
    name = parser.parse_args().asset
    sprite, max_colors = ASSETS[name]
    sprite().save("home", name, max_colors=max_colors)


if __name__ == "__main__":
    main()
