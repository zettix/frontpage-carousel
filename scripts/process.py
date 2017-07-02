#!/usr/bin/python
#// Copyright 2017 Sean Brennan
#//
#// License: Apache 2.0
#// https://www.apache.org/licenses/LICENSE-2.0

# Each logo is inititally saved by the following process:
# --
# visit https://en.wikipedia.org/wiki/List_of_most_popular_websites
# for about 32 of the top websites, do:
#   click the article for the website.
#   click the logo if available.
#   right click to download it as an image.
#   The resulting image is called foo.svg.png or just foo.png
# run this program to create textures and mtl files for the terminals.
# look at terminal.js for how to include them in the carousel.
# --
# textures and mtl files are put in ./output/
# requires ./assets/white.png to work.  white is a 1024x1024 png of just white.
# The texture is laid out like this:
# X--
# ---
# ---
#  that is, the fronts screen is the upper third, left third.  1024/3 = 341.
#  hence logos should fit a 341x341 box.  Only x is confined to 341, if the
#  logo is portrait instead of landscape, it will wrap around the terminal box.
import re
import os
import glob

#341
resolution_re = re.compile(r'341 x (\d+)')

filetmpl = """# Blender MTL File: 'None'
# Material Count: 1

newmtl Material
Ns 96.078431
Ka 1.000000 1.000000 1.000000
Kd 0.640000 0.640000 0.640000
Ks 0.500000 0.500000 0.500000
Ke 1.000000 1.000000 1.000000
Ni 1.000000
d 1.000000
illum 2
map_Kd TERM_%s
"""

files = glob.glob("*png");
files2 = files[:1]

def sh_escape(s):
   return s.replace("(","\\(").replace(")","\\)").replace(" ","\\ ")

def sh_no(s):
   return s.replace("(","-").replace(")","-").replace(" ","-")


for f in files:
  os.system('convert -scale 341 %s assets/tmp.png' % sh_escape(f))
  os.system('file assets/tmp.png > info.tmp')
  info = open('info.tmp', 'r').read()
  m = resolution_re.search(info)
  if m:
    yori = (341 - int(m.group(1))) / 2
    if (yori < 0):
      yori = 0
    print "pasting %s at %d, %d" % ("assets/tmp.png", 0, yori)
    os.system('convert assets/white.png assets/tmp.png -geometry "+0+%d" -composite output/TERM_%s' % (yori, sh_no(f)))
    open('output/M_%s.mtl' % sh_no(f), 'w').write(filetmpl % sh_no(f))
