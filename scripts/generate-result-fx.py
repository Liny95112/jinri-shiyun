"""Small 16px effect sprites for the local result-page serving trial.

The palette is the project's locked 16-color pixel palette. Assets are made
one at a time and audited before use; all alpha values are 0 or 255.
"""
import argparse
import runpy
from pathlib import Path
from PIL import Image, ImageDraw

ROOT = Path(__file__).resolve().parents[1]
P = runpy.run_path(str(Path(__file__).with_name("generate-pixel-fortune.py")))["P"]
OUT = ROOT / "src/assets/pixel/fx"

def steam_sheet():
    # Spec: SNES Retro, three 16x16 frames in a 16x48 transparent sheet,
    # top-right light, shared paper-shadow/wood-light/cream shades.
    assert all(key in P for key in ("paper_shadow", "wood_light", "cream"))
    image = Image.new("RGBA", (16, 48), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    paths = [
        [((4, 10, 5, 14), "paper_shadow"), ((5, 8, 6, 10), "paper_shadow"),
         ((8, 10, 9, 14), "wood_light"), ((9, 8, 10, 10), "wood_light")],
        [((5, 8, 6, 12), "paper_shadow"), ((4, 6, 5, 8), "paper_shadow"),
         ((9, 8, 10, 12), "wood_light"), ((8, 6, 9, 8), "wood_light")],
        [((4, 6, 5, 10), "paper_shadow"), ((5, 4, 6, 6), "paper_shadow"),
         ((8, 6, 9, 10), "wood_light"), ((9, 4, 10, 6), "wood_light")],
    ]
    for frame, strokes in enumerate(paths):
        for (x0, y0, x1, y1), color in strokes:
            draw.rectangle((x0, y0 + 16 * frame, x1, y1 + 16 * frame), fill=P[color])
    return image

def cool_sparkle():
    # Spec: SNES Retro, one 16x16 opaque-or-clear ice glint.
    assert all(key in P for key in ("ice", "ice_light", "cream"))
    image = Image.new("RGBA", (16, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    draw.rectangle((7, 2, 8, 13), fill=P["ice"])
    draw.rectangle((2, 7, 13, 8), fill=P["ice"])
    draw.rectangle((6, 6, 9, 9), fill=P["ice_light"])
    draw.rectangle((7, 6, 8, 7), fill=P["cream"])
    return image

def serving_tray():
    # Spec lock: SNES Retro UI prop, 64x16, project shared palette,
    # fully transparent or opaque pixels only; top-right light.
    assert all(key in P for key in ("ink", "wood_dark", "wood", "wood_light", "cream", "paper", "paper_shadow"))
    image = Image.new("RGBA", (64, 16), (0, 0, 0, 0))
    draw = ImageDraw.Draw(image)
    # A light plate sits on a shallow wooden serving tray.
    draw.rectangle((7, 8, 56, 13), fill=P["ink"])
    draw.rectangle((10, 7, 53, 11), fill=P["wood_dark"])
    draw.rectangle((12, 7, 52, 10), fill=P["wood"])
    draw.rectangle((14, 8, 48, 8), fill=P["wood_light"])
    draw.rectangle((17, 12, 46, 14), fill=P["ink"])
    draw.rectangle((19, 12, 44, 13), fill=P["wood_light"])
    draw.rectangle((13, 4, 50, 8), fill=P["ink"])
    draw.rectangle((16, 2, 47, 7), fill=P["paper_shadow"])
    draw.rectangle((18, 1, 45, 6), fill=P["cream"])
    draw.rectangle((22, 2, 41, 4), fill=P["paper"])
    draw.rectangle((29, 2, 43, 2), fill=P["cream"])
    return image


if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--asset", choices=("steam", "cool", "tray"), required=True)
    args = parser.parse_args()
    OUT.mkdir(parents=True, exist_ok=True)
    image = steam_sheet() if args.asset == "steam" else cool_sparkle() if args.asset == "cool" else serving_tray()
    path = OUT / ("result_steam_sheet.png" if args.asset == "steam" else "result_cool_sparkle.png" if args.asset == "cool" else "result_serving_tray.png")
    assert {pixel[3] for pixel in image.getdata()} <= {0, 255}
    image.save(path)
    print(f"{path}: {image.size}")
