from flask import Flask, render_template, request, jsonify
from google.generativeai import GenerativeModel, configure
from dotenv import load_dotenv
import os

# 載入環境變數
load_dotenv()

app = Flask(__name__)
app.config['JSON_AS_ASCII'] = False

# 添加 CORS 支援
@app.after_request
def after_request(response):
    response.headers.add('Access-Control-Allow-Origin', '*')
    response.headers.add('Access-Control-Allow-Headers', 'Content-Type')
    response.headers.add('Access-Control-Allow-Methods', 'GET,POST')
    return response

# 從環境變數獲取 API key
API_KEY = os.getenv('GEMINI_API_KEY')
if not API_KEY:
    raise ValueError("未設置 GEMINI_API_KEY 環境變數")

configure(api_key=API_KEY)
model = GenerativeModel('gemini-1.5-pro')

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/generate', methods=['POST'])
def generate():
    try:
        prompt = request.json.get('prompt', '')
        if not prompt:
            return jsonify({'error': '請輸入提示語！'}), 400
        
        # 添加超時處理
        response = model.generate_content(prompt, timeout=30)
        if not response or not response.text:
            return jsonify({'error': '生成內容失敗，請重試'}), 500
            
        return jsonify({'result': response.text})
    except Exception as e:
        app.logger.error(f"生成內容時發生錯誤: {str(e)}")
        return jsonify({'error': f'發生錯誤：{str(e)}'}), 500

@app.errorhandler(404)
def not_found(error):
    return jsonify({'error': '找不到該頁面'}), 404

@app.errorhandler(500)
def server_error(error):
    return jsonify({'error': '伺服器錯誤'}), 500

if __name__ == '__main__':
    port = int(os.getenv('PORT', 5000))
    app.run(host='0.0.0.0', port=port)