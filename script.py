# Import Module 
from PIL import Image
from pytesseract import pytesseract
import json
import requests
import webcolors 
from scipy.spatial import KDTree

import sys






def RGB_Color(img):
	width_image, height_image = img.size
	r_total = 0
	g_total = 0
	b_total = 0
	count = 0
	for x in range(0, width_image):
		for y in range(0, height_image):
			# r,g,b value of pixel
			r, g, b = img.getpixel((x, y))

			r_total += r
			g_total += g
			b_total += b
			count += 1
	return (int(r_total/count), int(g_total/count), int(b_total/count))
tesseract_path = r"/usr/local/bin/tesseract"
img = Image.open(r"/Users/salsabilracil/Desktop/medi/nodejdid/public/"+sys.argv[1])
pytesseract.tesseract_cmd = tesseract_path
img = img.convert("RGB")
color = RGB_Color(img)
text_med = pytesseract.image_to_string(img)

def image_closest_colour(requested_colour):
    min_colours = {}
    for key, name in webcolors.css3_hex_to_names.items():
        r_c, g_c, b_c = webcolors.hex_to_rgb(key)
        rd = (r_c - requested_colour[0]) ** 2
        gd = (g_c - requested_colour[1]) ** 2
        bd = (b_c - requested_colour[2]) ** 2
        min_colours[(rd + gd + bd)] = name
    return min_colours[min(min_colours.keys())]

def image_get_colour_name(requested_colour):
    try:
        closest_name = actual_name = webcolors.rgb_to_name(requested_colour)
    except ValueError:
        closest_name = image_closest_colour(requested_colour)
        actual_name = None
    return actual_name, closest_name

requested_colour = (color)
actual_name, closest_name = image_get_colour_name(requested_colour)


image_whitecolor = "white"
image_bluecolor = "blue"
image_orangecolor = "orange"

if image_bluecolor in closest_name :
    print("text"+text_med+"color blue")
elif image_orangecolor in closest_name :
    print("text"+text_med+"color orange")
else : 
	print("text"+text_med+"color white")

