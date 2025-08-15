#!/usr/bin/env python3
"""
서비스 영역별 아이콘 이미지를 생성하는 스크립트
Pillow를 사용하여 간단한 아이콘을 생성합니다.
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(text, filename, size=(200, 200), bg_color="#0a487c", text_color="white"):
    """간단한 텍스트 기반 아이콘을 생성합니다."""
    # 새 이미지 생성
    img = Image.new('RGB', size, bg_color)
    draw = ImageDraw.Draw(img)
    
    # 폰트 설정 (기본 폰트 사용)
    try:
        # Windows 기본 폰트 시도
        font = ImageFont.truetype("arial.ttf", 24)
    except:
        try:
            # 다른 폰트 시도
            font = ImageFont.truetype("C:/Windows/Fonts/arial.ttf", 24)
        except:
            # 기본 폰트 사용
            font = ImageFont.load_default()
    
    # 텍스트 중앙 정렬
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    x = (size[0] - text_width) // 2
    y = (size[1] - text_height) // 2
    
    # 텍스트 그리기
    draw.text((x, y), text, fill=text_color, font=font)
    
    # assets 폴더가 없으면 생성
    if not os.path.exists('assets'):
        os.makedirs('assets')
    
    # 파일 저장
    filepath = f"assets/{filename}"
    img.save(filepath, 'PNG', optimize=True)
    print(f"아이콘 생성 완료: {filepath}")

def main():
    print("서비스 영역별 아이콘 이미지를 생성합니다...")
    
    # 각 서비스별 아이콘 생성
    services = [
        ("정신건강", "mental-health-icon.png"),
        ("EMR자동화", "emr-automation-icon.png"),
        ("재활통역", "rehabilitation-icon.png"),

    ]
    
    for text, filename in services:
        create_icon(text, filename)
    
    print("\n모든 아이콘 생성이 완료되었습니다!")

if __name__ == "__main__":
    main()
