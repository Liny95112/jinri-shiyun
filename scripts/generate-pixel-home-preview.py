"""Create 0.7.2 candidate shop frames without replacing published 0.7.1 art.

Each 160x96 RGBA PNG is a complete hard-edged frame. Reuse the locked 16-color
palette where possible. The night preview adds three cold exterior colors to
contrast with the existing warm interior. Draw and audit one frame at a time.
"""

import argparse
import runpy
from pathlib import Path

from PIL import ImageDraw


shared = runpy.run_path(str(Path(__file__).with_name("generate-pixel-home.py")))
P = shared["P"]
shop = shared["shop"]

# Preview-only palette extension. The release sprites and shared palette are
# untouched; each output frame still uses no more than 16 opaque colors.
NIGHT_COLORS = {
    "night_sky": "#293B57",
    "night_mid": "#455E7B",
    "night_street": "#71889B",
}
P.update(NIGHT_COLORS)
shared["Sprite"].save.__globals__["ALLOWED"].update(
    tuple(bytes.fromhex(value[1:])) for value in NIGHT_COLORS.values()
)

PERIODS = ("morning", "day", "night")
POSES = ("preview", "noren_left", "noren_right", "cat_tail", "accent")


def rgba(name):
    return tuple(bytes.fromhex(P[name][1:])) + (255,)


def draw_cat(scene, period, tail=False):
    """A 19px seated cat by the right planter; only the tail changes pose."""
    fur = "cream" if period == "night" else "wood_light"
    light = "gold" if period == "night" else "cream"
    # Draw the tail behind the body so both poses have the same silhouette core.
    if tail:
        scene.rect((135, 83, 139, 85), "ink")
        scene.rect((138, 77, 141, 84), "ink")
        scene.rect((139, 78, 140, 82), fur)
    else:
        scene.rect((135, 84, 139, 87), "ink")
        scene.rect((137, 80, 140, 86), "ink")
        scene.rect((138, 81, 139, 84), fur)
    scene.rect((124, 80, 136, 90), "ink")
    scene.rect((126, 81, 134, 87), fur)
    scene.rect((127, 88, 135, 89), fur)
    scene.rect((129, 83, 133, 86), light)
    scene.rect((123, 73, 136, 81), "ink")
    scene.draw.polygon([(123, 75), (124, 69), (128, 73)], fill=P["ink"])
    scene.draw.polygon([(131, 73), (135, 69), (136, 76)], fill=P["ink"])
    scene.rect((125, 74, 134, 79), fur)
    scene.rect((125, 72, 126, 74), fur)
    scene.rect((133, 72, 134, 74), fur)
    scene.rect((132, 74, 134, 75), light)  # top-right glint
    if period == "morning":
        scene.rect((127, 77, 128, 77), "ink")
        scene.rect((132, 77, 133, 77), "ink")
    else:
        scene.rect((128, 76, 128, 77), "ink")
        scene.rect((132, 76, 132, 77), "ink")
    scene.rect((130, 79, 131, 79), "red")


def draw_noren(scene, pose):
    """Three explicit hem poses: neutral, left sway, right sway."""
    if pose == "noren_left":
        hems = (47, 44, 41)
    elif pose == "noren_right":
        hems = (41, 44, 47)
    else:
        return

    # Restore the doorway below the published curtain before adding longer hems.
    scene.rect((77, 40, 110, 48), "ink")
    scene.rect((80, 40, 107, 48), "wood_dark")
    scene.rect((82, 42, 105, 48), "paper")
    scene.rect((81, 47, 82, 48), "wood")
    scene.rect((101, 47, 104, 48), "wood_light")
    for x, hem in zip((79, 90, 100), hems):
        scene.rect((x, 40, x + 7, hem), "red")
        scene.rect((x + 5, 40, x + 7, 41), "orange")
        scene.rect((x + 3, 40, x + 4, 41), "paper")
    scene.rect((88, 40, 89, max(hems[0], hems[1])), "ink")
    scene.rect((98, 40, 99, max(hems[1], hems[2])), "ink")


def cool_night_exterior(scene):
    """Cool only the outside; window, lantern, sign and doorway stay warm."""
    ImageDraw.floodfill(scene.image, (0, 0), rgba("night_sky"))
    ImageDraw.floodfill(scene.image, (0, 90), rgba("night_street"))
    pixels = scene.image.load()
    for y in range(96):
        for x in range(160):
            color = pixels[x, y]
            if 18 <= y <= 32 and 19 <= x <= 142:
                # Roof and top exterior catch a little cold moonlight.
                if color == rgba("wood_dark"):
                    pixels[x, y] = rgba("night_sky")
                elif color == rgba("wood"):
                    pixels[x, y] = rgba("night_mid")
                elif color == rgba("wood_light"):
                    pixels[x, y] = rgba("night_street")
            elif 27 <= y <= 73 and (25 <= x <= 35 or 111 <= x <= 138):
                if color == rgba("wood_light"):
                    pixels[x, y] = rgba("night_mid")
                elif color in (rgba("wood"), rgba("wood_dark")):
                    pixels[x, y] = rgba("night_sky")
            elif y >= 78 and color == rgba("paper_shadow"):
                pixels[x, y] = rgba("night_mid")

    # Blue horizon and pavement edging remain behind the shop and the cat.
    scene.rect((0, 60, 18, 74), "night_mid")
    scene.rect((143, 59, 159, 74), "night_mid")
    scene.rect((0, 71, 18, 74), "night_street")
    scene.rect((143, 70, 159, 74), "night_street")
    scene.rect((0, 75, 21, 77), "night_mid")
    scene.rect((140, 75, 159, 77), "night_mid")
    # Sparse crisp stars support the indigo sky.
    scene.rect((10, 15, 11, 16), "ice_light")
    scene.rect((147, 31, 148, 32), "ice_light")


def make_frame(period, pose):
    assert period in PERIODS and pose in POSES
    # Use the original 0.7.1 drawing as the geometry source. All new colors
    # below come from the same locked P dictionary; no filters or alpha blends.
    scene = shop("day" if period == "morning" else period)
    if period == "morning":
        ImageDraw.floodfill(scene.image, (0, 0), rgba("cream"))
        ImageDraw.floodfill(scene.image, (0, 90), rgba("paper"))
        scene.rect((142, 8, 155, 19), "gold")
        scene.rect((145, 5, 152, 22), "gold")
        scene.rect((147, 7, 154, 11), "cream")
        scene.rect((136, 13, 140, 15), "paper")
        scene.rect((149, 26, 157, 27), "paper")
        scene.rect((117, 83, 133, 85), "gold")
        scene.rect((41, 39, 62, 41), "cream")
    elif period == "day":
        ImageDraw.floodfill(scene.image, (0, 0), rgba("ice_light"))
        scene.rect((145, 8, 156, 10), "cream")
        scene.rect((149, 6, 153, 12), "cream")
        scene.rect((29, 28, 36, 29), "paper")
        scene.rect((131, 29, 134, 40), "wood_light")
    else:
        cool_night_exterior(scene)
        scene.rect((145, 7, 153, 18), "paper")
        scene.rect((147, 5, 151, 7), "paper")
        scene.rect((147, 18, 153, 19), "paper")
        scene.rect((150, 7, 157, 15), "night_sky")  # pixel crescent moon
        scene.rect((39, 38, 40, 58), "gold")
        scene.rect((41, 39, 62, 41), "cream")
        scene.rect((64, 39, 67, 57), "paper")
        scene.rect((83, 53, 100, 55), "gold")
        scene.rect((83, 77, 111, 78), "orange")
        scene.rect((89, 79, 107, 80), "gold")
        scene.rect((94, 82, 106, 83), "wood_light")

    draw_noren(scene, pose)
    draw_cat(scene, period, tail=pose == "cat_tail")

    if pose == "accent":
        if period == "morning":
            scene.rect((135, 25, 137, 33), "gold")
            scene.rect((132, 28, 140, 30), "gold")
            scene.rect((135, 28, 137, 30), "cream")
        elif period == "day":
            scene.rect((111, 6, 113, 14), "gold")
            scene.rect((108, 9, 116, 11), "gold")
            scene.rect((111, 9, 113, 11), "cream")
        else:
            # Two-frame warm lamp breath: brighter window, lantern, doorstep.
            scene.rect((42, 40, 60, 43), "cream")
            scene.rect((120, 33, 128, 44), "orange")
            scene.rect((122, 34, 127, 42), "gold")
            scene.rect((124, 35, 127, 39), "cream")
            scene.rect((88, 82, 109, 83), "gold")
    return scene


ASSETS = {
    f"home_shop_{period}_{pose}.png": (period, pose)
    for period in PERIODS for pose in POSES
}


def main():
    parser = argparse.ArgumentParser(description="Generate one 0.7.2 preview shop frame")
    parser.add_argument("--asset", required=True, choices=ASSETS)
    name = parser.parse_args().asset
    period, pose = ASSETS[name]
    make_frame(period, pose).save("home/preview", name, max_colors=16)


if __name__ == "__main__":
    main()
