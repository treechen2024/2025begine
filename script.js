document.addEventListener('DOMContentLoaded', function() {
    // 顏色選擇器預覽
    const fontColor = document.getElementById('fontColor');
    const bgColor = document.getElementById('bgColor');
    const fontColorPreview = document.getElementById('fontColorPreview');
    const bgColorPreview = document.getElementById('bgColorPreview');
    
    fontColor.addEventListener('input', function() {
        fontColorPreview.style.backgroundColor = this.value;
    });
    
    bgColor.addEventListener('input', function() {
        bgColorPreview.style.backgroundColor = this.value;
    });
    
    // 初始化顏色預覽
    fontColorPreview.style.backgroundColor = fontColor.value;
    bgColorPreview.style.backgroundColor = bgColor.value;
    
    // 轉換按鈕點擊處理
    const convertBtn = document.getElementById('convertBtn');
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('downloadLink');
    
    // 改為按鈕點擊事件而非表單提交
    convertBtn.addEventListener('click', function() {
        const txtFile = document.getElementById('txtFile').files[0];
        if (!txtFile) {
            alert('請選擇 TXT 檔案');
            return;
        }
        
        const fontColorValue = hexToRgb(fontColor.value);
        const bgColorValue = hexToRgb(bgColor.value);
        
        convertBtn.disabled = true;
        convertBtn.textContent = '處理中...';
        
        // 讀取 TXT 檔案
        const reader = new FileReader();
        reader.onload = function(e) {
            const content = e.target.result;
            
            // 創建 PPT
            createPptx(content, fontColorValue, bgColorValue)
                .then(pptxBlob => {
                    // 創建下載連結
                    const url = URL.createObjectURL(pptxBlob);
                    downloadLink.href = url;
                    downloadLink.download = 'presentation.pptx';
                    
                    // 顯示結果區域
                    resultDiv.classList.remove('hidden');
                    window.scrollTo(0, resultDiv.offsetTop);
                })
                .catch(error => {
                    alert('生成 PPT 時發生錯誤: ' + error.message);
                })
                .finally(() => {
                    convertBtn.disabled = false;
                    convertBtn.textContent = '轉換';
                });
        };
        
        reader.onerror = function() {
            alert('讀取檔案時發生錯誤');
            convertBtn.disabled = false;
            convertBtn.textContent = '轉換';
        };
        
        reader.readAsText(txtFile, 'UTF-8');
    });
    
    // 將十六進制顏色轉換為 RGB 物件
    function hexToRgb(hex) {
        hex = hex.replace(/^#/, '');
        const bigint = parseInt(hex, 16);
        return {
            r: (bigint >> 16) & 255,
            g: (bigint >> 8) & 255,
            b: bigint & 255
        };
    }
    
    // 創建 PPT 檔案
    async function createPptx(content, fontColor, bgColor) {
        // 創建 PPT 實例
        const pptx = new PptxGenJS();
        
        // 以兩個以上空白行為分頁依據
        const blocks = content.split(/\n\s*\n/).filter(block => block.trim());
        
        for (const block of blocks) {
            // 創建新投影片
            const slide = pptx.addSlide();
            
            // 設置背景色
            slide.background = { color: `RGB(${bgColor.r},${bgColor.g},${bgColor.b})` };
            
            // 使用 /N 作為內頁換行
            const lines = block.split('/N').map(line => line.trim());
            
            // 添加文字
            slide.addText(lines, {
                x: 1,
                y: 1,
                w: 8,
                h: 5.5,
                fontSize: 32,
                color: `RGB(${fontColor.r},${fontColor.g},${fontColor.b})`,
                breakLine: true
            });
        }
        
        // 生成 PPT 並返回 Blob
        return pptx.writeFile({ outputType: 'blob' });
    }
});
