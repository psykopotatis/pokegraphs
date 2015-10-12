from __future__ import print_function

from PIL import Image
from collections import Counter


def read_image():
    image = Image.open("static/images/pokemons/85.png")
    rgb_image = image.convert('RGBA')
    width, height = image.size

    json_image = [[0 for x in range(96)] for x in range(96)]
    hex_colors = []
    for x in range(0, width):
        for y in range(0, height):
            r, g, b, a = rgb_image.getpixel((x, y))
            # Skip transparent colors
            if a == 0:
                continue
            else:
                hex_color = '#%02x%02x%02x' % (r, g, b)
                hex_colors.append(hex_color)
                json_image[x][y] = hex_color

    print(json_image)
    most_common = Counter(hex_colors).most_common()
    print(most_common)

    result = []
    colored_pixels = 0
    for c in most_common:
        colored_pixels += c[1]
    print('all_pixels', 96 * 96)
    print('colored_pixels', colored_pixels)

    for c in most_common:
        hex_color = c[0]
        pixels = c[1]
        percent_of_all = pixels / float(colored_pixels) * 100
        print(percent_of_all)
        result.append(hex_color)
    print(result)

    f = open('apa.txt', 'w')
    f.write(str(json_image))
    f.close()

read_image()