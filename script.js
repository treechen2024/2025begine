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
    
    // 表單提交處理
    const convertForm = document.getElementById('convertForm');
    const resultDiv = document.getElementById('result');
    const downloadLink = document.getElementById('downloadLink');
    
    convertForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const formData = new FormData(this);
        const submitBtn = document.getElementById('convertBtn');
        
        // 禁用按鈕並顯示加載狀態
        submitBtn.disabled = true;
        submitBtn.textContent = '處理中...';
        
        fetch('/convert', {
            method: 'POST',
            body: formData
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('轉換過程發生錯誤');
            }
            return response.json();
        })
        .then(data => {
            if (data.success) {
                downloadLink.href = data.download_url;
                resultDiv.classList.remove('hidden');
                window.scrollTo(0, resultDiv.offsetTop);
            } else {
                alert('錯誤: ' + data.error);
            }
        })
        .catch(error => {
            alert('發生錯誤: ' + error.message);
        })
        .finally(() => {
            submitBtn.disabled = false;
            submitBtn.textContent = '轉換';
        });
    });
});