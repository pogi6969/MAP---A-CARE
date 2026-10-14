"""Convert the PNG screenshots in a folder to WebP for the website, and remove the PNGs."""
import glob, os, sys
from PIL import Image
d = sys.argv[1]
for f in glob.glob(os.path.join(d, "*.png")):
    Image.open(f).convert("RGB").save(f[:-4] + ".webp", "WEBP", quality=78, method=6)
    os.remove(f)
    print(f[:-4] + ".webp", os.path.getsize(f[:-4] + ".webp"))
