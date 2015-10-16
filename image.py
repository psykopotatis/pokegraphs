from __future__ import print_function

from PIL import Image
from collections import Counter
import json


def get_luminance(r, g, b):
    # return 0.2126 * r + 0.7152 * g + 0.0722 * b
    return 0.299 * r + 0.587 * g + 0.114 * b


def read_image(poke_id):
    image = Image.open("static/images/pokemons/%s.png" % poke_id)
    rgb_image = image.convert('RGBA')
    width, height = image.size

    pixels = [[0 for x in range(96)] for x in range(96)]
    all_colors = []
    lightest = 0
    lightest_color = '#ffffff'  # white
    for x in range(0, width):
        for y in range(0, height):
            r, g, b, a = rgb_image.getpixel((x, y))
            # Skip transparent colors
            if a == 0:
                continue
            else:
                hex_color = '#%02x%02x%02x' % (r, g, b)
                all_colors.append(hex_color)
                pixels[x][y] = hex_color

                # Find lightest color
                candidate_lightest = r + g + b
                white = 255 + 255 + 255
                if white > candidate_lightest > lightest:
                    lightest = candidate_lightest
                    lightest_color = hex_color

    most_common = Counter(all_colors).most_common()
    # Get total number of colored pixels
    colored_pixels = 0
    for c in most_common:
        colored_pixels += c[1]

    # Get each color's part of total number of colored pixels
    color_chart = []
    colors = []
    for c in most_common:
        hex_color = c[0]
        colors.append(hex_color)
        percent_of_all = c[1] / float(colored_pixels) * 100
        color_chart.append((hex_color, percent_of_all))

    image_data = {"pixels": pixels, "colors": colors, "lightest": lightest_color}
    poke_file = 'static/js/poke/%s.json' % poke_id
    f = open(poke_file, 'w')
    f.write(json.dumps(image_data))
    f.close()
    print('saved: %s' % poke_file)



for idx in range(1, 650):
    read_image(idx)