from PIL import Image, ImageDraw, ImageFont, ImageFilter
import os
S="/tmp/claude-0/-home-user-Video-maker/c24daf3e-1e77-51d4-a96b-372362088a78/scratchpad"
W,H=1280,720
CREAM=(246,239,220); GOLD=(231,200,115); GOLDD=(205,162,74); INK=(11,20,16)
SERIF="/usr/share/fonts/truetype/dejavu/DejaVuSerif-Bold.ttf"
SANS="/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"

def cover(path):
    im=Image.open(path).convert("RGB"); iw,ih=im.size
    scale=max(W/iw, H/ih); nw,nh=int(iw*scale),int(ih*scale)
    im=im.resize((nw,nh))
    return im.crop(((nw-W)//2,(nh-H)//2,(nw-W)//2+W,(nh-H)//2+H))

def grad(base, side="bottom", strength=210):
    ov=Image.new("L",(W,H),0); d=ImageDraw.Draw(ov)
    for y in range(H):
        if side=="bottom": a=int(strength*max(0,(y-H*0.30)/(H*0.70)))
        else: a=int(strength*(1-y/H))
        d.line([(0,y),(W,y)],fill=min(255,a))
    black=Image.new("RGB",(W,H),(4,8,6))
    return Image.composite(black, base, ov)

def leftgrad(base, strength=200):
    ov=Image.new("L",(W,H),0); d=ImageDraw.Draw(ov)
    for x in range(W):
        a=int(strength*max(0,1-(x/(W*0.72))))
        for_=a
        d.line([(x,0),(x,H)],fill=min(255,a))
    black=Image.new("RGB",(W,H),(4,8,6))
    return Image.composite(black, base, ov)

def F(path,size): return ImageFont.truetype(path,size)

def spaced(t,n=8): return (" "*1).join(t)  # light tracking via spaces handled per-char below

def draw_kicker(d,x,y,text,size=34,color=GOLD,track=6):
    f=F(SANS,size); cx=x
    for ch in text:
        d.text((cx,y),ch,font=f,fill=color)
        cx+=d.textlength(ch,font=f)+track
    return cx

def draw_title(img,lines,x,y,size,leading,accent_idx=None):
    d=ImageDraw.Draw(img); f=F(SERIF,size); cy=y
    for li,(line,col) in enumerate(lines):
        # shadow
        for dx,dy in [(4,5)]:
            d.text((x+dx,cy+dy),line,font=f,fill=(0,0,0))
        d.text((x,cy),line,font=f,fill=col)
        cy+=size+leading
    return cy

def brand(d, x=None, y=None):
    f=F(SANS,26)
    txt="KETABI STUDIO"; tw=sum(d.textlength(c,font=f)+5 for c in txt)
    bx = W-tw-44 if x is None else x; by= H-52 if y is None else y
    cx=bx
    for ch in txt:
        d.text((cx,by),ch,font=f,fill=GOLD); cx+=d.textlength(ch,font=f)+5

# ---- Concept A: river + "A MOUNTAIN OF GOLD" ----
a=cover(f"{S}/bg_river.png"); a=grad(a,"bottom",225); a=leftgrad(a,150)
d=ImageDraw.Draw(a)
draw_kicker(d,70,360,"THE EUPHRATES PROPHECY",34,GOLD,7)
draw_title(a,[("A MOUNTAIN",CREAM),("OF GOLD",GOLD)],66,405,118,8)
d.text((72,648),"Foretold 1,400 years ago",font=F(SANS,30),fill=CREAM)
brand(d)
a.save(f"{S}/thumb_A.png")

# ---- Concept B: molten gold + "THE EUPHRATES PROPHECY" ----
b=cover(f"{S}/bg_gold.png"); b=grad(b,"bottom",235)
d=ImageDraw.Draw(b)
draw_kicker(d,70,300,"QUR'AN AND THE SUNNAH",32,GOLD,7)
draw_title(b,[("THE EUPHRATES",CREAM),("PROPHECY",GOLD)],66,345,112,8)
d.text((72,610),"A mountain of gold, and a warning",font=F(SANS,30),fill=CREAM)
brand(d, x=72, y=662)
b.save(f"{S}/thumb_B.png")

# ---- Concept C: river + "HE WARNED US ABOUT THIS RIVER" ----
c=cover(f"{S}/bg_river.png"); c=grad(c,"bottom",230); c=leftgrad(c,140)
d=ImageDraw.Draw(c)
draw_kicker(d,70,300,"1,400 YEARS AGO",32,GOLD,7)
draw_title(c,[("HE WARNED US",CREAM),("ABOUT THIS",CREAM),("RIVER",GOLD)],66,345,92,6)
brand(d)
c.save(f"{S}/thumb_C.png")

# contact sheet
sheet=Image.new("RGB",(W+40, H*3+80),(40,40,40))
for i,p in enumerate(["thumb_A.png","thumb_B.png","thumb_C.png"]):
    im=Image.open(f"{S}/{p}"); sheet.paste(im,(20,20+i*(H+20)))
sheet.save(f"{S}/thumbs_all.png")
print("saved thumb_A/B/C and thumbs_all")
