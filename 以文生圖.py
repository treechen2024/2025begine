import google.generativeai as genai
from PIL import Image
from io import BytesIO
import base64

# 設定 API 金鑰
genai.configure(api_key="AIzaSyBK8Cukatlb4VjsCqcmoeZhw8Ju-peRTTo")

# 建立模型（Gemini 1.5 Pro）
model = genai.GenerativeModel("gemini-1.5-pro")

# 請求生成圖片的內容
prompt = "Create a 3D rendered image of a 兔子 with wings and a top hat, flying over a happy futuristic sci-fi city with lots of greenery."

# 生成內容（移除 response_mime_type）
response = model.generate_content(prompt)

# 解析回應並顯示圖片
for part in response.parts:
    if hasattr(part, "text") and part.text:
        print(part.text)  # 如果有文字回應，則列印
    elif hasattr(part, "inline_data") and part.inline_data:
        image_data = base64.b64decode(part.inline_data.data)  # 解碼 base64
        image = Image.open(BytesIO(image_data))
        image.save("generated_image.png")  # 儲存圖片
        image.show()  # 顯示圖片